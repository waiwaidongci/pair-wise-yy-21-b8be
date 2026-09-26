import { defineStore } from "pinia";
import { listArrivalRecords } from "../api/ArrivalRecord";
import type { ArrivalRecord } from "../types/ArrivalRecord";

export const useArrivalRecordStore = defineStore("arrivalRecord", {
  state: () => ({ rows: [] as ArrivalRecord[], loading: false }),
  actions: {
    async load() {
      this.loading = true;
      this.rows = await listArrivalRecords();
      this.loading = false;
    }
  }
});
