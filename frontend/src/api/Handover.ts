import { request } from "./request";
import { mockData } from "../mocks/seedData";
import type { HandoverPreview, HandoverRecord, HandoverExecutePayload, HandoverErrorDetails } from "../types/Handover";

// 换班交接预览：候选接班班组、可转移单据与全部阻断原因
export async function previewHandover(fromCrewId: number): Promise<HandoverPreview> {
  return request<HandoverPreview>(`/api/handover/preview?from_crew_id=${fromCrewId}`);
}

// 执行换班交接（后端原子事务，失败时原记录保留）
export async function executeHandover(payload: HandoverExecutePayload): Promise<HandoverRecord> {
  return request<HandoverRecord>("/api/handover/execute", { method: "POST", body: JSON.stringify(payload) });
}

export async function listHandoverRecords(crewId?: number): Promise<HandoverRecord[]> {
  try {
    const query = crewId ? `?crew_id=${crewId}` : "";
    return await request<HandoverRecord[]>(`/api/handover-record${query}`);
  } catch {
    return [...mockData.handoverRecord];
  }
}

export type { HandoverErrorDetails };
