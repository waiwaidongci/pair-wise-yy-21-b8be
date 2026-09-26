export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  HANDOVER_BLOCKED: "shift handover blocked by unfinished on-site work",
  HANDOVER_TARGET_INVALID: "selected relief crew is not eligible for this handover",
  HANDOVER_TICKET_NOT_FOUND: "repair ticket not found",
  HANDOVER_CREW_NOT_FOUND: "crew not found",
  HANDOVER_CONFLICT: "crew or ticket state changed during handover, original records kept"
} as const;
