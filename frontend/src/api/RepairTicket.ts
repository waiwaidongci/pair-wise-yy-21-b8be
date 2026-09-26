import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { RepairTicket } from "../types/RepairTicket";

const endpoint = "/api/repair-ticket";

export async function listRepairTicket(): Promise<RepairTicket[]> {
  try {
    return await request<RepairTicket[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.repairTicket];
  }
}

export async function saveRepairTicket(payload: RepairTicket) {
  console.info("save RepairTicket", payload);
  return payload;
}
