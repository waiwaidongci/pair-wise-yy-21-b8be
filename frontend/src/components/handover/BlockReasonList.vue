<script setup lang="ts">
import { computed } from "vue";
import { describeBlockReasons } from "../../constants/HandoverBlockReason";

// 阻断原因列表：同时用于“已到场任务”工单级阻断与候选班组级阻断
const props = defineProps<{
  reasons: readonly string[];
  title?: string;
  tone?: "danger" | "warn";
}>();

const texts = computed(() => describeBlockReasons(props.reasons));
</script>

<template>
  <ul v-if="texts.length" class="block-reasons" :data-tone="tone ?? 'danger'">
    <li v-if="title" class="block-title">{{ title }}</li>
    <li v-for="text in texts" :key="text" class="block-item">⛔ {{ text }}</li>
  </ul>
</template>
