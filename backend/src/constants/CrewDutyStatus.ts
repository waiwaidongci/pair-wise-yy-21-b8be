export const CrewDutyStatus = { ON_DUTY: "ON_DUTY", OFF_DUTY: "OFF_DUTY" } as const;
export type CrewDutyStatus = (typeof CrewDutyStatus)[keyof typeof CrewDutyStatus];
