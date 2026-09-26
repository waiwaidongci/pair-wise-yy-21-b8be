import { defineStore } from "pinia";
import { previewHandover, executeHandover, listHandoverRecords } from "../api/Handover";
import type { ApiError } from "../api/request";
import type { HandoverPreview, HandoverRecord, HandoverExecutePayload } from "../types/Handover";

interface HandoverState {
  preview: HandoverPreview | null;
  records: HandoverRecord[];
  loading: boolean;
  submitting: boolean;
  error: ApiError | null;
}

export const useHandoverStore = defineStore("handover", {
  state: (): HandoverState => ({
    preview: null,
    records: [],
    loading: false,
    submitting: false,
    error: null
  }),
  actions: {
    async loadPreview(fromCrewId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.preview = await previewHandover(fromCrewId);
      } catch (error) {
        this.error = error as ApiError;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async submit(payload: HandoverExecutePayload): Promise<HandoverRecord> {
      this.submitting = true;
      this.error = null;
      try {
        const record = await executeHandover(payload);
        // 成功后刷新留痕列表
        this.records = await listHandoverRecords();
        return record;
      } catch (error) {
        // 失败（阻断/资格不符）：错误携带 details.record 与 details.preview，原数据不丢失
        this.error = error as ApiError;
        const failedRecord = (error as ApiError).details
          ? ((error as ApiError).details as { record?: HandoverRecord }).record
          : undefined;
        if (failedRecord) this.records = [failedRecord, ...this.records];
        throw error;
      } finally {
        this.submitting = false;
      }
    },
    async loadRecords(crewId?: number) {
      this.records = await listHandoverRecords(crewId);
    }
  }
});
