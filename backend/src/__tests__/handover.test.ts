import assert from "node:assert";
import { handoverService } from "../services/HandoverService";
import { crewRepository } from "../repositories/CrewRepository";
import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { sparePartUsageRepository } from "../repositories/SparePartUsageRepository";
import { arrivalRecordRepository } from "../repositories/ArrivalRecordRepository";
import { handoverRecordRepository } from "../repositories/HandoverRecordRepository";
import type { ServiceError } from "../utils/ServiceError";

const assertBlocked = (fn: () => unknown, expectedCode: string) => {
  try {
    fn();
    assert.fail("expected throw");
  } catch (error) {
    assert.strictEqual((error as ServiceError).code, expectedCode);
    return error as ServiceError;
  }
};

// ---------- 场景1：班组1 预览（2 张未到场未完工单，无到场阻断） ----------
let preview = handoverService.preview(1);
assert.deepStrictEqual(preview.transferable_ticket_ids.sort(), [1, 4]);
assert.strictEqual(preview.global_blocked, false);
assert.deepStrictEqual(preview.part_ids.sort(), [1, 4]); // 待领用备件
assert.ok(preview.arrival_ids.includes(1)); // 未闭环到场记录

const byId3 = preview.candidates.find((c) => c.crew_id === 3)!;
assert.strictEqual(byId3.eligible, true, "机动班应合格");
const byId4 = preview.candidates.find((c) => c.crew_id === 4)!;
assert.ok(byId4.reasons.includes("SKILL_NOT_MATCH") && byId4.reasons.includes("TEAM_BUSY"));
const byId5 = preview.candidates.find((c) => c.crew_id === 5)!;
assert.ok(byId5.reasons.includes("TEAM_OFF_DUTY"));
const byId1 = preview.candidates.find((c) => c.crew_id === 1)!;
assert.ok(byId1.reasons.includes("SAME_TEAM"));
console.log("场景1 通过：候选资格与阻断原因正确");

// ---------- 场景2：已到场任务不得换班（班组2 全部到场/抢修中） ----------
preview = handoverService.preview(2);
assert.strictEqual(preview.global_blocked, true);
assert.deepStrictEqual(preview.transferable_ticket_ids, []);
for (const block of preview.ticket_blocks) {
  assert.ok(block.reasons.includes("TICKET_ON_SITE"), `工单${block.ticket_id} 应阻断`);
}
const blockedError = assertBlocked(
  () => handoverService.execute({ from_crew_id: 2, to_crew_id: 3, handover_operator: "甲", receiver_operator: "乙" }),
  "HANDOVER_BLOCKED"
);
// 阻断后原记录保留
assert.strictEqual(repairTicketRepository.findById(2)!.team_id, 2);
assert.strictEqual(repairTicketRepository.findById(3)!.team_id, 2);
assert.strictEqual(crewRepository.findById(2)!.current_ticket_id, 2);
const failedRecord = (blockedError.details as { record: { status: string; block_reasons: string[] } }).record;
assert.strictEqual(failedRecord.status, "FAILED");
assert.ok(failedRecord.block_reasons.includes("TICKET_ON_SITE"));
console.log("场景2 通过：已到场阻断 + 失败留痕 + 原记录保留");

// ---------- 场景3：选离岗/技能不匹配班组 ----------
assertBlocked(
  () => handoverService.execute({ from_crew_id: 1, to_crew_id: 5, handover_operator: "甲", receiver_operator: "乙" }),
  "HANDOVER_TARGET_INVALID"
);
assertBlocked(
  () => handoverService.execute({ from_crew_id: 1, to_crew_id: 4, handover_operator: "甲", receiver_operator: "乙" }),
  "HANDOVER_TARGET_INVALID"
);
assertBlocked(
  () => handoverService.execute({ from_crew_id: 1, to_crew_id: 1, handover_operator: "甲", receiver_operator: "乙" }),
  "HANDOVER_TARGET_INVALID"
);
// 失败后班组1 数据仍在
assert.strictEqual(repairTicketRepository.findById(1)!.team_id, 1);
console.log("场景3 通过：接班资格校验拦截");

// ---------- 场景4：成功交接 1 -> 3，三类记录一起转移，原班组释放 ----------
const before = handoverRecordRepository.findAll().length;
const record = handoverService.execute({
  from_crew_id: 1,
  to_crew_id: 3,
  handover_operator: "班组长-马涛（交班）",
  receiver_operator: "班组长-赵磊（接班）",
  remark: "夜间抢修注意环网柜带电"
});
assert.strictEqual(record.status, "SUCCESS");
assert.deepStrictEqual(record.ticket_ids.sort(), [1, 4]);
assert.deepStrictEqual(record.part_ids.sort(), [1, 4]);
assert.deepStrictEqual(record.arrival_ids, [1]);
assert.strictEqual(repairTicketRepository.findById(1)!.team_id, 3);
assert.strictEqual(repairTicketRepository.findById(4)!.team_id, 3);
assert.strictEqual(arrivalRecordRepository.findById(1)!.crew_id, 3);
assert.strictEqual(crewRepository.findById(1)!.current_ticket_id, null, "原班组应释放");
assert.strictEqual(crewRepository.findById(3)!.current_ticket_id, 1, "接班班组承接工单");
// 待领用备件仍挂在工单上
assert.strictEqual(sparePartUsageRepository.findById(1)!.ticket_id, 1);
assert.strictEqual(handoverRecordRepository.findAll().length, before + 1);
// 留痕保留前后班组与交接人
assert.strictEqual(record.from_crew_id, 1);
assert.strictEqual(record.to_crew_id, 3);
assert.strictEqual(record.handover_operator, "班组长-马涛（交班）");
assert.strictEqual(record.receiver_operator, "班组长-赵磊（接班）");
console.log("场景4 通过：成功交接、整体转移、班组释放、留痕完整");

// ---------- 场景5：交接后班组3 持有未结工单，不能再作为接班人 ----------
preview = handoverService.preview(2); // 班组2 仍被到场阻断
const crew3Now = preview.candidates.find((c) => c.crew_id === 3)!;
assert.ok(crew3Now.reasons.includes("TEAM_BUSY"));
console.log("场景5 通过：已承接班组变为忙碌，不再可选");

console.log("\n全部换班交接测试通过 ✅");
