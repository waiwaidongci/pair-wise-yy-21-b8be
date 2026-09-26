<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "../../utils/formatters";
import StatusBadge from "./StatusBadge.vue";

export interface TimelineItem {
  id: number;
  title: string;
  time: string;
  status?: string;
  statusKind?: "TicketStatus" | "ArrivalStatus" | "HandoverStatus" | "PartUsageStatus";
  desc?: string;
}

const props = defineProps<{ items: TimelineItem[]; title?: string; empty?: string }>();
const ordered = computed(() => [...props.items].sort((a, b) => b.time.localeCompare(a.time)));
</script>

<template>
  <div class="timeline">
    <h3 v-if="title">{{ title }}</h3>
    <p v-if="!ordered.length" class="timeline-empty">{{ empty ?? "暂无记录" }}</p>
    <ol>
      <li v-for="item in ordered" :key="item.id">
        <div class="timeline-dot" />
        <div class="timeline-body">
          <div class="timeline-head">
            <strong>{{ item.title }}</strong>
            <StatusBadge v-if="item.status" :value="item.status" :kind="item.statusKind" />
          </div>
          <time>{{ formatDate(item.time) }}</time>
          <p v-if="item.desc">{{ item.desc }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>
