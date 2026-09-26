import { computed } from "vue";
import type { Ref } from "vue";
import type { RepairTicket } from "../types/RepairTicket";
import type { Crew } from "../types/Crew";
import type { TicketBlock } from "../types/Handover";
import { isOpenTicket, isOnSiteTicket } from "../constants/TicketStatus";

// 抢修工单流转：区分可交接、已到场阻断、已完工，并给出每张工单的阻断原因
export function useTicketFlow(
  tickets: Ref<RepairTicket[]> | RepairTicket[],
  crews: Ref<Crew[]> | Crew[] = []
) {
  const ticketRows = computed<RepairTicket[]>(() =>
    "value" in tickets ? tickets.value : tickets
  );
  const crewRows = computed<Crew[]>(() => ("value" in crews ? crews.value : crews));

  const crewName = (crewId: number): string =>
    crewRows.value.find((crew) => crew.id === crewId)?.name ?? `班组#${crewId}`;

  // 未完工单
  const openTickets = computed(() => ticketRows.value.filter((ticket) => isOpenTicket(ticket.status)));
  // 已到达现场（到场/抢修中）：换班阻断
  const onSiteTickets = computed(() => ticketRows.value.filter((ticket) => isOnSiteTicket(ticket.status)));
  // 已完工
  const finishedTickets = computed(() => ticketRows.value.filter((ticket) => !isOpenTicket(ticket.status)));

  // 评估某班组名下工单的逐张阻断原因
  const evaluateCrewTickets = (crewId: number): TicketBlock[] =>
    ticketRows.value
      .filter((ticket) => ticket.team_id === crewId && isOpenTicket(ticket.status))
      .map((ticket) => ({
        ticket_id: ticket.id,
        status: ticket.status,
        transferable: !isOnSiteTicket(ticket.status),
        reasons: isOnSiteTicket(ticket.status) ? ["TICKET_ON_SITE"] : []
      }));

  return { ticketRows, crewName, openTickets, onSiteTickets, finishedTickets, evaluateCrewTickets };
}
