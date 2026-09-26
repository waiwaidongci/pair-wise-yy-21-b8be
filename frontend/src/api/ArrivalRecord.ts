import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { ArrivalRecord } from "../types/ArrivalRecord";

export async function listArrivalRecords(crewId?: number): Promise<ArrivalRecord[]> {
  try {
    const query = crewId ? `?crew_id=${crewId}` : "";
    return await request<ArrivalRecord[]>(`/api/arrival-record${query}`);
  } catch {
    const rows = [...mockData.arrivalRecord];
    return crewId ? rows.filter((row) => row.crew_id === crewId) : rows;
  }
}
