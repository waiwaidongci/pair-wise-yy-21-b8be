import type { ArrivalRecord } from "../models/ArrivalRecord";

export type ArrivalRecordPayload = Partial<Omit<ArrivalRecord, "id">> & Record<string, unknown>;
