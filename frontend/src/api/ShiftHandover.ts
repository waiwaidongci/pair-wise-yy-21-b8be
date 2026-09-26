import { mockData } from "../mocks/seedData";
import { buildShiftHandoverPreview, createShiftHandoverRecord } from "../constructors/ShiftHandoverConstructor";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { ArrivalRecord } from "../types/ArrivalRecord";
import type { ShiftHandoverPayload, ShiftHandoverPreview, ShiftHandoverRecord } from "../types/ShiftHandover";

const endpoint = "/api/shift-handover";

export class ShiftHandoverError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details: string[] = []
  ) {
    super(message);
    this.name = "ShiftHandoverError";
  }
}

export async function fetchShiftHandoverPreview(teamId: number): Promise<ShiftHandoverPreview> {
  try {
    const res = await fetch(`${endpoint}/preview?team_id=${teamId}`);
    const body = await res.json().catch(() => null);
    if (res.ok) return body as ShiftHandoverPreview;
    if (body?.message) throw new ShiftHandoverError(body.message, body.code ?? "HANDOVER_BLOCKED", body.details ?? []);
  } catch (err) {
    if (err instanceof ShiftHandoverError) throw err;
    // Local mock fallback keeps the UI available during offline review.
  }
  return buildShiftHandoverPreview(
    {
      crews: mockData.crew,
      tickets: mockData.repairTicket,
      spareParts: mockData.sparePartUsage,
      arrivalRecords: mockData.arrivalRecord as unknown as ArrivalRecord[]
    },
    teamId
  );
}

export async function submitShiftHandover(payload: ShiftHandoverPayload): Promise<ShiftHandoverRecord> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => null);
    if (res.ok) {
      console.info(LOG_TEMPLATES.RepairTicket[4], body);
      return body as ShiftHandoverRecord;
    }
    throw new ShiftHandoverError(body?.message ?? ERROR_MESSAGES.HANDOVER_BLOCKED, body?.code ?? "HANDOVER_BLOCKED", body?.details ?? []);
  } catch (err) {
    if (err instanceof ShiftHandoverError) throw err;
    // 离线降级：仅本地生成交接记录，不改动任何原始数据
    return createShiftHandoverRecord(payload);
  }
}

export async function listShiftHandover(): Promise<ShiftHandoverRecord[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return (await res.json()) as ShiftHandoverRecord[];
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return [];
}
