<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: string }>();

const text = computed(() => ({ HIGH: "高优先级", MEDIUM: "中优先级", LOW: "低优先级" } as Record<string, string>)[props.value] ?? props.value);
const tone = computed(() => ({ HIGH: "danger", MEDIUM: "warn", LOW: "neutral" } as Record<string, string>)[props.value] ?? "neutral");
</script>

<template>
  <span class="prio" :data-tone="tone">{{ text }}</span>
</template>
