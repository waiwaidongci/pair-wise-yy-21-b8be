<script setup lang="ts">
import type { Crew } from "../../types/Crew";
import StatusBadge from "./StatusBadge.vue";
import { describeBlockReasons } from "../../constants/HandoverBlockReason";

defineProps<{
  crew: Crew;
  eligible?: boolean;
  reasons?: string[];
  selectable?: boolean;
  selected?: boolean;
}>();

const emit = defineEmits<{ (event: "select", crew: Crew): void }>();
</script>

<template>
  <button
    type="button"
    class="crew-card"
    :class="{ selected, disabled: selectable && eligible === false }"
    :disabled="selectable && eligible === false"
    @click="selectable && eligible !== false && emit('select', crew)"
  >
    <div class="crew-head">
      <strong>{{ crew.name }}</strong>
      <StatusBadge :value="crew.duty_status" kind="DutyStatus" />
    </div>
    <p class="crew-skills">技能：{{ crew.skill_tags }}</p>
    <p class="crew-phone">联系：{{ crew.contact_phone }}<span v-if="crew.current_ticket_id !== null"> · 持有工单 #{{ crew.current_ticket_id }}</span></p>
    <ul v-if="reasons && reasons.length" class="crew-blocks">
      <li v-for="reason in describeBlockReasons(reasons)" :key="reason">⚠ {{ reason }}</li>
    </ul>
    <span v-if="selectable && eligible" class="crew-ok">✓ 符合接班条件</span>
  </button>
</template>
