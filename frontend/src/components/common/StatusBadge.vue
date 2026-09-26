<script setup lang="ts">
import { computed } from "vue";
import { STATUS_TEXT } from "../../constants/statusText";

const props = defineProps<{ value: string; kind?: keyof typeof STATUS_TEXT }>();

const text = computed(() => {
  const map = props.kind ? STATUS_TEXT[props.kind] : undefined;
  return (map as Record<string, string> | undefined)?.[props.value] ?? props.value.replace(/_/g, " ");
});

const tone = computed(() => {
  if (["ARRIVED", "REPAIRING", "OPEN", "FAILED", "DANGEROUS", "DEGRADED", "OFF_DUTY"].includes(props.value)) return "danger";
  if (["ASSIGNED", "PENDING_PICKUP", "WATCH", "ON_DUTY"].includes(props.value)) return "warn";
  if (["RESTORED", "CLOSED", "CLOSED", "SUCCESS", "NORMAL"].includes(props.value)) return "ok";
  return "neutral";
});
</script>

<template>
  <span class="badge" :data-tone="tone">{{ text }}</span>
</template>
