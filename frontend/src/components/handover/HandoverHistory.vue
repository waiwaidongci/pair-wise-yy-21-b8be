<script setup lang="ts">
import { computed } from "vue";
import type { HandoverRecord } from "../../types/Handover";
import type { Crew } from "../../types/Crew";
import TimelineList, { type TimelineItem } from "../common/TimelineList.vue";
import { describeBlockReasons } from "../../constants/HandoverBlockReason";

const props = defineProps<{ records: HandoverRecord[]; crews: Crew[] }>();

const crewName = (id: number) => props.crews.find((crew) => crew.id === id)?.name ?? `班组#${id}`;

const items = computed<TimelineItem[]>(() =>
  props.records.map((record) => ({
    id: record.id,
    title: `${crewName(record.from_crew_id)} → ${crewName(record.to_crew_id)}`,
    time: record.created_at,
    status: record.status,
    statusKind: "HandoverStatus" as const,
    desc:
      `交班：${record.handover_operator}｜接班：${record.receiver_operator}` +
      `｜工单 #${record.ticket_ids.join("、#") || "无"}` +
      `｜备件 ${record.part_ids.length} 条｜到场 ${record.arrival_ids.length} 条` +
      (record.block_reasons.length ? `｜阻断：${describeBlockReasons(record.block_reasons).join("；")}` : "")
  }))
);
</script>

<template>
  <TimelineList :items="items" title="换班交接留痕" empty="暂无交接记录" />
</template>
