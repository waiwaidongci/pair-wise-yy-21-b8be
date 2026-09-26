export const CrewDutyStatus = { ON_DUTY: "ON_DUTY", OFF_DUTY: "OFF_DUTY" } as const;
export type CrewDutyStatus = (typeof CrewDutyStatus)[keyof typeof CrewDutyStatus];
export const CrewDutyStatusText: Record<CrewDutyStatus, string> = { ON_DUTY: "在岗", OFF_DUTY: "离岗" };
