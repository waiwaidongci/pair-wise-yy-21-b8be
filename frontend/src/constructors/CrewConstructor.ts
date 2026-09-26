import type { Crew } from "../types/Crew";

export const createDefaultCrew = (overrides: Partial<Crew> = {}): Crew => ({
  id: 1,
  name: "城东一班（夜班）",
  leader_id: 101,
  skill_tags: "复电抢修,低压运维,线路巡检",
  duty_status: "ON_DUTY",
  current_ticket_id: null,
  contact_phone: "13900000101",
  ...overrides
});

export const createCrewForm = createDefaultCrew;
export const createCrewResponse = createDefaultCrew;
