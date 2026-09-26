import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { Crew } from "../types/Crew";

const endpoint = "/api/crew";

export async function listCrew(): Promise<Crew[]> {
  try {
    return await request<Crew[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.crew];
  }
}

export async function saveCrew(payload: Crew) {
  console.info("save Crew", payload);
  return payload;
}
