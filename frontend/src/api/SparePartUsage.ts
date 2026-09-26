import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { SparePartUsage } from "../types/SparePartUsage";

const endpoint = "/api/spare-part-usage";

export async function listSparePartUsage(): Promise<SparePartUsage[]> {
  try {
    return await request<SparePartUsage[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.sparePartUsage];
  }
}

export async function saveSparePartUsage(payload: SparePartUsage) {
  console.info("save SparePartUsage", payload);
  return payload;
}
