<script setup lang="ts">
import type { ShiftHandoverPreview } from "../../types/ShiftHandover";
import StatusBadge from "./StatusBadge.vue";
import { formatDate, formatDutyStatus } from "../../utils/formatters";
import { TicketStatusText, type TicketStatus } from "../../constants/TicketStatus";

const props = defineProps<{
  preview: ShiftHandoverPreview | null;
  loading: boolean;
  submitting: boolean;
  error: string;
  errorDetails: string[];
  targetTeamId: number | null;
  operatorName: string;
}>();

const emit = defineEmits<{
  (e: "update:targetTeamId", value: number | null): void;
  (e: "update:operatorName", value: string): void;
  (e: "confirm"): void;
  (e: "close"): void;
}>();

const statusText = (status: string) => TicketStatusText[status as TicketStatus] ?? status;

const onSelectTeam = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit("update:targetTeamId", value === "" ? null : Number(value));
};
const onInputOperator = (event: Event) => emit("update:operatorName", (event.target as HTMLInputElement).value);
</script>

<template>
  <div class="dialog-mask" @click.self="emit('close')">
    <div class="dialog" role="dialog" aria-label="换班交接">
      <h2>换班交接 · {{ props.preview?.from_team_name ?? "加载中" }}</h2>

      <p v-if="props.loading" class="meta">正在校验交接条件…</p>

      <template v-if="props.preview">
        <section v-if="props.preview.block_reasons.length" class="block-box">
          <h3>阻断原因（已到达现场的任务不得换班）</h3>
          <ul>
            <li v-for="reason in props.preview.block_reasons" :key="reason" class="reason">{{ reason }}</li>
          </ul>
        </section>

        <section>
          <h3 class="meta">交接范围（原班组释放后一起转到新班组）</h3>
          <p class="meta">
            未完工单 {{ props.preview.open_tickets.length }} 张 · 待领用备件申请
            {{ props.preview.pending_spare_part_ids.length }} 条 · 到场记录 {{ props.preview.arrival_record_ids.length }} 条
          </p>
          <ul class="ticket-list">
            <li v-for="ticket in props.preview.open_tickets" :key="ticket.id">
              工单#{{ ticket.id }} <StatusBadge :value="statusText(ticket.status)" />
              <span class="meta">派工于 {{ formatDate(ticket.assigned_at) }}</span>
            </li>
          </ul>
        </section>

        <label for="handover-target">接班班组（仅技能匹配、当前无未结工单且非离岗的班组可选）</label>
        <select
          id="handover-target"
          :value="props.targetTeamId ?? ''"
          :disabled="props.preview.blocked || props.submitting"
          @change="onSelectTeam"
        >
          <option value="">请选择接班班组</option>
          <option v-for="candidate in props.preview.candidates" :key="candidate.crew.id" :value="candidate.crew.id" :disabled="!candidate.eligible">
            {{ candidate.crew.name }}（{{ formatDutyStatus(candidate.crew.duty_status) }} · 技能：{{ candidate.crew.skill_tags }}<template v-if="!candidate.eligible"> · {{ candidate.reasons.join("；") }}</template>）
          </option>
        </select>

        <label for="handover-operator">交接人</label>
        <input
          id="handover-operator"
          :value="props.operatorName"
          :disabled="props.preview.blocked || props.submitting"
          placeholder="交接人姓名，留空则记录为当前调度员"
          @input="onInputOperator"
        />
      </template>

      <p v-if="props.error" class="reason">{{ props.error }}</p>
      <ul v-if="props.errorDetails.length" class="block-box">
        <li v-for="detail in props.errorDetails" :key="detail" class="reason">{{ detail }}</li>
      </ul>

      <footer>
        <button type="button" @click="emit('close')">取消</button>
        <button
          type="button"
          class="primary"
          :disabled="props.submitting || props.loading || props.targetTeamId == null || props.preview?.blocked !== false"
          @click="emit('confirm')"
        >
          {{ props.submitting ? "交接中…" : "确认交接" }}
        </button>
      </footer>
    </div>
  </div>
</template>
