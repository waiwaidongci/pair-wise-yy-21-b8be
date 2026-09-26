<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { HandoverPreview, HandoverRecord } from "../../types/Handover";
import type { Crew } from "../../types/Crew";
import type { ApiError } from "../../api/request";
import { useHandoverStore } from "../../stores/HandoverStore";
import { createHandoverForm } from "../../constructors/HandoverConstructor";
import CrewCard from "../common/CrewCard.vue";
import BlockReasonList from "./BlockReasonList.vue";
import { STATUS_TEXT } from "../../constants/statusText";

const props = defineProps<{
  visible: boolean;
  preview: HandoverPreview | null;
  crews: Crew[];
  parts: { id: number; part_name: string; ticket_id: number }[];
  arrivals: { id: number; site_name: string }[];
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "success", record: HandoverRecord): void;
}>();

const handoverStore = useHandoverStore();

const form = ref(createHandoverForm());
const selectedCrewId = ref<number | null>(null);
const serverError = ref<ApiError | null>(null);

const candidates = computed(() =>
  props.crews
    .map((crew) => {
      const candidate = props.preview?.candidates.find((row) => row.crew_id === crew.id);
      return { crew, eligible: candidate?.eligible ?? false, reasons: candidate?.reasons ?? [] };
    })
);

const selectedCrew = computed(() => props.crews.find((crew) => crew.id === selectedCrewId.value) ?? null);

const transferableTickets = computed(() => props.preview?.transferable_ticket_ids ?? []);
const blockedTickets = computed(() => props.preview?.ticket_blocks.filter((block) => !block.transferable) ?? []);
const transferParts = computed(() => props.parts.filter((part) => props.preview?.part_ids.includes(part.id)));
const transferArrivals = computed(() => props.arrivals.filter((arrival) => props.preview?.arrival_ids.includes(arrival.id)));

const canSubmit = computed(() =>
  selectedCrewId.value !== null &&
  !!form.value.handover_operator.trim() &&
  !!form.value.receiver_operator.trim() &&
  props.preview !== null &&
  !props.preview.global_blocked &&
  !handoverStore.submitting
);

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      selectedCrewId.value = null;
      serverError.value = null;
      form.value = createHandoverForm({
        from_crew_id: props.preview?.from_crew_id ?? 0,
        handover_operator: "班组长（交班）",
        receiver_operator: ""
      });
    }
  }
);

const pickCrew = (crew: Crew) => {
  selectedCrewId.value = crew.id;
  form.value.to_crew_id = crew.id;
};

const statusText = (status: string) =>
  (STATUS_TEXT.TicketStatus as Record<string, string>)[status] ?? status;

const close = () => emit("close");

const submit = async () => {
  if (!props.preview || selectedCrewId.value === null) return;
  serverError.value = null;
  try {
    const record = await handoverStore.submit({
      from_crew_id: props.preview.from_crew_id,
      to_crew_id: selectedCrewId.value,
      handover_operator: form.value.handover_operator.trim(),
      receiver_operator: form.value.receiver_operator.trim(),
      remark: form.value.remark?.trim() || ""
    });
    emit("success", record);
  } catch (error) {
    serverError.value = error as ApiError;
  }
};

const serverReasons = computed<string[]>(() => {
  const details = serverError.value?.details as { record?: HandoverRecord } | undefined;
  return details?.record?.block_reasons ?? [];
});
</script>

<template>
  <div v-if="visible" class="modal-mask" @click.self="close">
    <div class="modal">
      <header class="modal-head">
        <h2>夜班换班交接 · {{ preview?.from_crew_name }}</h2>
        <button type="button" class="modal-close" @click="close">×</button>
      </header>

      <div v-if="preview" class="modal-body">
        <!-- 阻断：已到达现场的任务不得换班 -->
        <section v-if="blockedTickets.length" class="modal-section danger">
          <h3>换班阻断（{{ blockedTickets.length }} 张工单已到场，不得交接）</h3>
          <div v-for="block in blockedTickets" :key="block.ticket_id" class="block-ticket">
            <strong>工单 #{{ block.ticket_id }}</strong>
            <span class="muted">当前状态：{{ statusText(block.status) }}</span>
            <BlockReasonList :reasons="block.reasons" />
          </div>
          <p class="danger-tip">请先由原班组完成现场处置或复电后再发起交接，本次无法提交。</p>
        </section>

        <!-- 交接清单 -->
        <section class="modal-section">
          <h3>交接清单</h3>
          <ul class="transfer-list">
            <li>未完工单：<b>{{ transferableTickets.length }}</b> 张
              <span class="muted">#{{ transferableTickets.join("、#") || "无" }}</span>
            </li>
            <li>待领用备件申请：<b>{{ transferParts.length }}</b> 条
              <span v-for="part in transferParts" :key="part.id" class="chip">{{ part.part_name }}（工单#{{ part.ticket_id }}）</span>
            </li>
            <li>未闭环到场记录：<b>{{ transferArrivals.length }}</b> 条
              <span v-for="arrival in transferArrivals" :key="arrival.id" class="chip">{{ arrival.site_name }}</span>
            </li>
            <li>所需技能：<b>{{ preview.required_skills.join("、") || "无" }}</b></li>
          </ul>
        </section>

        <!-- 接班班组选择：仅合格班组可点选 -->
        <section class="modal-section">
          <h3>选择接班班组</h3>
          <div class="candidate-grid">
            <CrewCard
              v-for="{ crew, eligible, reasons } in candidates"
              :key="crew.id"
              :crew="crew"
              selectable
              :eligible="eligible"
              :reasons="reasons"
              :selected="selectedCrewId === crew.id"
              @select="pickCrew"
            />
          </div>
        </section>

        <!-- 交接人 -->
        <section v-if="!preview.global_blocked" class="modal-section">
          <h3>交接人确认</h3>
          <div class="form-grid">
            <label>交班人（原班组）
              <input v-model="form.handover_operator" type="text" placeholder="如：班组长-马涛" />
            </label>
            <label>接班人（{{ selectedCrew?.name ?? "接班班组" }}）
              <input v-model="form.receiver_operator" type="text" placeholder="如：班组长-赵磊" />
            </label>
            <label class="full">备注
              <textarea v-model="form.remark" rows="2" placeholder="交接注意事项（可选）"></textarea>
            </label>
          </div>
        </section>

        <!-- 服务端失败回显（原记录未丢失） -->
        <section v-if="serverError" class="modal-section danger">
          <h3>交接失败，原记录已保留</h3>
          <p>{{ serverError.message }}</p>
          <BlockReasonList v-if="serverReasons.length" :reasons="serverReasons" />
        </section>
      </div>

      <footer class="modal-foot">
        <button type="button" class="btn ghost" @click="close">取消</button>
        <button type="button" class="btn primary" :disabled="!canSubmit" @click="submit">
          {{ handoverStore.submitting ? "交接中…" : "确认交接" }}
        </button>
      </footer>
    </div>
  </div>
</template>
