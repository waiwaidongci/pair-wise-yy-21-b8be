import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { FaultReport } from "../types/FaultReport";

const endpoint = "/api/fault-report";

export async function listFaultReport(): Promise<FaultReport[]> {
  try {
    return await request<FaultReport[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.faultReport];
  }
}

export async function saveFaultReport(payload: FaultReport) {
  console.info("save FaultReport", payload);
  return payload;
}
