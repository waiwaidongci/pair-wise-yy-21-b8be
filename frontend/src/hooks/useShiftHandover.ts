import { computed, ref } from "vue";
import { useShiftHandoverStore } from "../stores/ShiftHandoverStore";

export function useShiftHandover() {
  const store = useShiftHandoverStore();
  const dialogVisible = ref(false);
  const fromTeamId = ref<number | null>(null);
  const targetTeamId = ref<number | null>(null);
  const operatorName = ref("");

  const eligibleCandidates = computed(() => store.preview?.candidates.filter((candidate) => candidate.eligible) ?? []);
  const canConfirm = computed(
    () => dialogVisible.value && !store.loading && !store.submitting && !store.preview?.blocked && targetTeamId.value != null
  );

  const open = (teamId: number) => {
    fromTeamId.value = teamId;
    targetTeamId.value = null;
    dialogVisible.value = true;
    void store.loadPreview(teamId);
  };

  const close = () => {
    dialogVisible.value = false;
    store.clearError();
  };

  const confirm = async () => {
    if (fromTeamId.value == null || targetTeamId.value == null) return false;
    const ok = await store.submit({
      from_team_id: fromTeamId.value,
      to_team_id: targetTeamId.value,
      operator_name: operatorName.value.trim()
    });
    if (ok) {
      dialogVisible.value = false;
      operatorName.value = "";
    }
    return ok;
  };

  return { store, dialogVisible, fromTeamId, targetTeamId, operatorName, eligibleCandidates, canConfirm, open, close, confirm };
}
