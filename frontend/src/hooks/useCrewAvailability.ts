import { computed, isRef } from "vue";
import type { Ref } from "vue";
import type { Crew } from "../types/Crew";
import type { HandoverPreview } from "../types/Handover";
import { parseSkillTags } from "../utils/crewSkills";

const unrefValue = <T>(value: Ref<T> | T): T => (isRef(value) ? value.value : value);

// 班组可接班判断：非离岗、当前无未结工单、技能覆盖所需技能、且不是交出班组
export function useCrewAvailability(
  crews: Ref<Crew[]> | Crew[],
  options: { requiredSkills?: Ref<string[]> | string[]; fromCrewId?: Ref<number> | number; preview?: Ref<HandoverPreview | null> } = {}
) {
  const crewRows = computed<Crew[]>(() => unrefValue(crews));
  const requiredSkills = computed<string[]>(() =>
    options.requiredSkills ? unrefValue(options.requiredSkills) : []
  );
  const fromCrewId = computed<number | undefined>(() =>
    options.fromCrewId === undefined ? undefined : unrefValue(options.fromCrewId)
  );

  const reasonsFor = (crew: Crew): string[] => {
    // 以后端预览为准（权威），本地规则仅用于离线兜底
    const candidate = options.preview?.value?.candidates.find((row) => row.crew_id === crew.id);
    if (candidate) return candidate.reasons;

    const reasons: string[] = [];
    if (fromCrewId.value === crew.id) reasons.push("SAME_TEAM");
    if (crew.duty_status !== "ON_DUTY") reasons.push("TEAM_OFF_DUTY");
    const owned = new Set(parseSkillTags(crew.skill_tags));
    if (requiredSkills.value.some((skill) => !owned.has(skill))) reasons.push("SKILL_NOT_MATCH");
    if (crew.current_ticket_id !== null && crew.current_ticket_id !== undefined) reasons.push("TEAM_BUSY");
    return reasons;
  };

  const availableCrews = computed(() => crewRows.value.filter((crew) => reasonsFor(crew).length === 0));

  return { crewRows, reasonsFor, availableCrews };
}
