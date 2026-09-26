<script setup lang="ts">
import { onMounted } from "vue";
import { useRepairTicketStore } from "../stores/RepairTicketStore";
import { useCrewStore } from "../stores/CrewStore";
import { useShiftHandover } from "../hooks/useShiftHandover";
import StatusBadge from "../components/common/StatusBadge.vue";
import EmptyState from "../components/common/EmptyState.vue";
import HandoverPanel from "../components/common/HandoverPanel.vue";
import { formatDate } from "../utils/formatters";
import { TicketStatusText, type TicketStatus } from "../constants/TicketStatus";

const ticketStore = useRepairTicketStore();
const crewStore = useCrewStore();
const {
  store: handoverStore,
  dialogVisible,
  targetTeamId,
  operatorName,
  open,
  close,
  confirm
} = useShiftHandover();

const crewName = (id: number) => crewStore.rows.find((crew) => crew.id === id)?.name ?? `#${id}`;
const statusText = (status: string) => TicketStatusText[status as TicketStatus] ?? status;
const formatIds = (ids: number[]) => (ids.length ? ids.map((id) => `#${id}`).join("、") : "—");

const onConfirm = async () => {
  const ok = await confirm();
  if (ok) await Promise.all([ticketStore.load(), crewStore.load()]);
};

onMounted(async () => {
  await Promise.all([ticketStore.load(), crewStore.load(), handoverStore.loadRecords()]);
});
</script>

<template>
  <section class="panel wide">
    <h2>抢修工单</h2>
    <table class="table">
      <thead>
        <tr><th>工单</th><th>报修单</th><th>抢修班组</th><th>优先级</th><th>状态</th><th>派工时间</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="ticket in ticketStore.rows" :key="ticket.id">
          <td>#{{ ticket.id }}</td>
          <td>#{{ ticket.fault_report_id }}</td>
          <td>{{ crewName(ticket.team_id) }}</td>
          <td>{{ ticket.priority }}</td>
          <td><StatusBadge :value="statusText(ticket.status)" /></td>
          <td>{{ formatDate(ticket.assigned_at) }}</td>
          <td><button type="button" class="link" @click="open(ticket.team_id)">换班交接</button></td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="panel wide">
    <h2>换班交接记录</h2>
    <table v-if="handoverStore.records.length" class="table">
      <thead>
        <tr><th>时间</th><th>交班班组</th><th>接班班组</th><th>交接人</th><th>未完工单</th><th>待领用备件</th><th>到场记录</th></tr>
      </thead>
      <tbody>
        <tr v-for="record in handoverStore.records" :key="record.id">
          <td>{{ formatDate(record.created_at) }}</td>
          <td>{{ crewName(record.from_team_id) }}</td>
          <td>{{ crewName(record.to_team_id) }}</td>
          <td>{{ record.operator_name }}</td>
          <td>{{ formatIds(record.ticket_ids) }}</td>
          <td>{{ formatIds(record.spare_part_usage_ids) }}</td>
          <td>{{ formatIds(record.arrival_record_ids) }}</td>
        </tr>
      </tbody>
    </table>
    <EmptyState v-else />
  </section>

  <HandoverPanel
    v-if="dialogVisible"
    v-model:target-team-id="targetTeamId"
    v-model:operator-name="operatorName"
    :preview="handoverStore.preview"
    :loading="handoverStore.loading"
    :submitting="handoverStore.submitting"
    :error="handoverStore.error"
    :error-details="handoverStore.errorDetails"
    @confirm="onConfirm"
    @close="close"
  />
</template>
