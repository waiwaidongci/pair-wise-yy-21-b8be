import { defineStore } from "pinia";
import { fetchShiftHandoverPreview, listShiftHandover, submitShiftHandover, ShiftHandoverError } from "../api/ShiftHandover";
import type { ShiftHandoverPayload, ShiftHandoverPreview, ShiftHandoverRecord } from "../types/ShiftHandover";

export const useShiftHandoverStore = defineStore("shiftHandover", {
  state: () => ({
    preview: null as ShiftHandoverPreview | null,
    records: [] as ShiftHandoverRecord[],
    loading: false,
    submitting: false,
    error: "",
    errorDetails: [] as string[]
  }),
  actions: {
    async loadPreview(teamId: number) {
      this.loading = true;
      this.error = "";
      this.errorDetails = [];
      try {
        this.preview = await fetchShiftHandoverPreview(teamId);
      } catch (err) {
        this.preview = null;
        this.error = err instanceof Error ? err.message : String(err);
      } finally {
        this.loading = false;
      }
    },
    async loadRecords() {
      this.records = await listShiftHandover();
    },
    async submit(payload: ShiftHandoverPayload) {
      this.submitting = true;
      this.error = "";
      this.errorDetails = [];
      try {
        const record = await submitShiftHandover(payload);
        this.records = [record, ...this.records];
        return true;
      } catch (err) {
        // 交接失败时保留原有 preview 与 records，原始记录不丢失
        if (err instanceof ShiftHandoverError) {
          this.error = err.message;
          this.errorDetails = err.details;
        } else {
          this.error = err instanceof Error ? err.message : String(err);
        }
        return false;
      } finally {
        this.submitting = false;
      }
    },
    clearError() {
      this.error = "";
      this.errorDetails = [];
    }
  }
});
