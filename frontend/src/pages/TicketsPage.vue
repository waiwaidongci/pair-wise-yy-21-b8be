<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { useCrewStore } from "../stores/CrewStore";
import { useFaultReportStore } from "../stores/FaultReportStore";
import { useSparePartUsageStore } from "../stores/SparePartUsageStore";
import { useArrivalRecordStore } from "../stores/ArrivalRecordStore";
import { useHandoverStore } from "../stores/HandoverStore";
import { useTicketFlow } from "../hooks/useTicketFlow";
import StatusBadge from "../components/common/StatusBadge.vue";
import PriorityTag from "../components/common/PriorityTag.vue";
import EmptyState from "../components/common/EmptyState.vue";
import BlockReasonList from "../components/handover/BlockReasonList.vue";
import HandoverDialog from "../components/handover/HandoverDialog.vue";
import HandoverHistory from "../components/handover/HandoverHistory.vue";
import { TicketStatusText, isOnSiteTicket } from "../constants/TicketStatus";
import { FaultTypeText } from "../constants/FaultType";
import { PartUsageStatusText } from "../constants/PartUsageStatus";
import { ArrivalStatusText } from "../constants/ArrivalStatus";
import type { HandoverRecord, HandoverPreview } from "../types/Handover";

const ticketStore = useRepairTicketStore();
const crewStore = useCrewStore();
const faultStore = useFaultReportStore();
const partStore = useSparePartUsageStore();
const arrivalStore = useArrivalRecordStore();
const handoverStore = useHandoverStore();

const { rows: tickets } = storeToRefs(ticketStore);
const { rows: crews } = storeToRefs(crewStore);
const { rows: faults } = storeToRefs(faultStore);
const { rows: parts } = storeToRefs(partStore);
const { rows: arrivals } = storeToRefs(arrivalStore);
const { records: handoverRecords } = storeToRefs(handoverStore);

const { crewName, openTickets, onSiteTickets, evaluateCrewTickets } = useTicketFlow(tickets, crews);

const selectedCrewId = ref<number>(1);
const dialogVisible = ref(false);
const dialogPreview = ref<HandoverPreview | null>(null);
const lastSuccess = ref<HandoverRecord | null>(null);
const successBanner = ref(false);

onMounted(async () => {
  await Promise.all([
    ticketStore.load(),
    crewStore.load(),
    faultStore.load(),
    partStore.load(),
    arrivalStore.load(),
    handoverStore.loadRecords()
  ]);
  selectedCrewId.value = crews.value[0]?.id ?? 1;
});

const crewOptions = computed(() => crews.value);
const selectedCrew = computed(() => crews.value.find((crew) => crew.id === selectedCrewId.value) ?? null);

// 当前班组名下工单及逐张阻断原因
const crewTickets = computed(() => tickets.value.filter((ticket) => ticket.team_id === selectedCrewId.value));
const crewTicketBlocks = computed(() => evaluateCrewTickets(selectedCrewId.value));
const hasOnSiteBlock = computed(() => crewTicketBlocks.value.some((block) => !block.transferable));
const openCount = computed(() => openTickets.value.length);
const onSiteCount = computed(() => onSiteTickets.value.length);

// 备件、到场记录映射辅助
const ticketFault = (faultReportId: number) => faults.value.find((fault) => fault.id === faultReportId);
const crewParts = computed(() =>
  crewTickets.value.flatMap((ticket) => parts.value.filter((part) => part.ticket_id === ticket.id))
);
const crewArrivals = computed(() => arrivals.value.filter((arrival) => arrival.crew_id === selectedCrewId.value));

const statusText = (status: string) => TicketStatusText[status as keyof typeof TicketStatusText]?.replace("（到场途中）", "") ?? status;
const isOnSite = isOnSiteTicket;

const openHandover = async () => {
  lastSuccess.value = null;
  dialogPreview.value = null;
  try {
    await handoverStore.loadPreview(selectedCrewId.value);
    dialogPreview.value = handoverStore.preview;
    dialogVisible.value = true;
  } catch {
    dialogPreview.value = null;
  }
};

const onSuccess = (record: HandoverRecord) => {
  lastSuccess.value = record;
  successBanner.value = true;
  dialogVisible.value = false;
  // 交接成功后重新拉取全部数据，反映班组释放与工单转移
  Promise.all([ticketStore.load(), crewStore.load(), partStore.load(), arrivalStore.load(), handoverStore.loadRecords()]);
  window.setTimeout(() => (successBanner.value = false), 6000);
};
</script>

<template>
  <section class="tickets-page">
    <header class="page-toolbar">
      <div>
        <p class="eyebrow">night shift handover</p>
        <h2>抢修工单 · 换班交接</h2>
        <p class="muted">夜班交接场景：选择接班班组后，仅可交给技能匹配、当前无未结工单且非离岗的班组。</p>
      </div>
      <div class="toolbar-stats">
        <span class="stat-chip">未完工 <b>{{ openCount }}</b></span>
        <span class="stat-chip danger">已到场 <b>{{ onSiteCount }}</b></span>
      </div>
    </header>

    <div v-if="successBanner && lastSuccess" class="banner ok">
      ✓ 交接成功：{{ crewName(lastSuccess.from_crew_id) }} → {{ crewName(lastSuccess.to_crew_id) }}
      ，转移工单 #{{ lastSuccess.ticket_ids.join("、#") }}，交班人 {{ lastSuccess.handover_operator }} / 接班人 {{ lastSuccess.receiver_operator }}
    </div>

    <!-- 班组切换 -->
    <div class="crew-switch">
      <label>当前值班班组：
        <select v-model.number="selectedCrewId">
          <option v-for="crew in crewOptions" :key="crew.id" :value="crew.id">{{ crew.name }}</option>
        </select>
      </label>
      <button type="button" class="btn primary" @click="openHandover">发起换班交接</button>
    </div>

    <div v-if="hasOnSiteBlock" class="banner warn">
      ⛔ 该班组存在已到达现场的任务，换班将被阻断，请先完成现场处置。
    </div>

    <div class="tickets-layout">
      <!-- 工单列表 -->
      <div class="panel">
        <h3>名下工单（{{ crewTickets.length }}）</h3>
        <EmptyState v-if="!crewTickets.length" text="该班组名下暂无工单" />
        <table v-else class="data-table">
          <thead>
            <tr><th>工单</th><th>故障</th><th>优先级</th><th>状态</th><th>派工时间</th><th>交接</th></tr>
          </thead>
          <tbody>
            <tr v-for="ticket in crewTickets" :key="ticket.id" :class="{ block: isOnSite(ticket.status) }">
              <td>#{{ ticket.id }}</td>
              <td>
                <template v-if="ticketFault(ticket.fault_report_id)">
                  {{ FaultTypeText[ticketFault(ticket.fault_report_id)!.fault_type as keyof typeof FaultTypeText] }}
                  <span class="muted">{{ ticketFault(ticket.fault_report_id)!.address_desc }}</span>
                </template>
              </td>
              <td><PriorityTag :value="ticket.priority" /></td>
              <td><StatusBadge :value="ticket.status" kind="TicketStatus" /></td>
              <td>{{ new Date(ticket.assigned_at).toLocaleString("zh-CN") }}</td>
              <td>
                <BlockReasonList
                  v-if="isOnSite(ticket.status)"
                  :reasons="['TICKET_ON_SITE']"
                />
                <span v-else-if="ticket.status === 'WAIT_DISPATCH'" class="muted">待派工</span>
                <span v-else class="ok-text">可随班交接</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 备件申请与到场记录 -->
      <div class="side-col">
        <div class="panel">
          <h3>备件领用申请（{{ crewParts.length }}）</h3>
          <EmptyState v-if="!crewParts.length" text="暂无备件申请" />
          <ul v-else class="plain-list">
            <li v-for="part in crewParts" :key="part.id">
              <strong>{{ part.part_name }}</strong>
              <span class="muted">×{{ part.quantity }} · 工单#{{ part.ticket_id }}</span>
              <StatusBadge :value="part.usage_status" kind="PartUsageStatus" />
            </li>
          </ul>
          <p class="hint">仅「{{ PartUsageStatusText.PENDING_PICKUP }}」申请随工单转移。</p>
        </div>

        <div class="panel">
          <h3>到场记录（{{ crewArrivals.length }}）</h3>
          <EmptyState v-if="!crewArrivals.length" text="暂无到场记录" />
          <ul v-else class="plain-list">
            <li v-for="arrival in crewArrivals" :key="arrival.id">
              <strong>{{ arrival.site_name }}</strong>
              <span class="muted">{{ new Date(arrival.arrived_at).toLocaleString("zh-CN") }}<template v-if="arrival.ticket_id"> · 关联工单#{{ arrival.ticket_id }}</template></span>
              <StatusBadge :value="arrival.status" kind="ArrivalStatus" />
            </li>
          </ul>
          <p class="hint">「{{ ArrivalStatusText.OPEN }}」到场记录随班组值班责任整体移交。</p>
        </div>
      </div>
    </div>

    <!-- 交接留痕 -->
    <div class="panel">
      <HandoverHistory :records="handoverRecords" :crews="crews" />
    </div>

    <HandoverDialog
      :visible="dialogVisible"
      :preview="dialogPreview"
      :crews="crews"
      :parts="parts.map((part) => ({ id: part.id, part_name: part.part_name, ticket_id: part.ticket_id }))"
      :arrivals="arrivals.map((arrival) => ({ id: arrival.id, site_name: arrival.site_name }))"
      @close="dialogVisible = false"
      @success="onSuccess"
    />
  </section>
</template>
