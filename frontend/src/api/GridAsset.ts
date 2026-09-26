import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { GridAsset } from "../types/GridAsset";

const endpoint = "/api/grid-asset";

export async function listGridAsset(): Promise<GridAsset[]> {
  try {
    return await request<GridAsset[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.gridAsset];
  }
}

export async function saveGridAsset(payload: GridAsset) {
  console.info("save GridAsset", payload);
  return payload;
}
