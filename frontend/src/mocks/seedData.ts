import type { GridAsset } from "../types/GridAsset";
import type { FaultReport } from "../types/FaultReport";
import type { RepairTicket } from "../types/RepairTicket";
import type { Crew } from "../types/Crew";
import type { SparePartUsage } from "../types/SparePartUsage";
import type { ArrivalRecord } from "../types/ArrivalRecord";
import type { HandoverRecord } from "../types/Handover";

// 与后端 src/seed.ts 保持一致的本地兜底数据（离线评审时使用）
export const mockData = {
  gridAsset: [
    { id: 1, asset_code: "XL-10kV-001", asset_type: "OUTAGE", feeder_line: "10kV 城东I线", voltage_level: "10kV", location_desc: "东城区和平路 12 号环网柜", health_status: "DANGEROUS", owner_team_id: 1 },
    { id: 2, asset_code: "XL-10kV-002", asset_type: "TRIP", feeder_line: "10kV 城东II线", voltage_level: "10kV", location_desc: "东城区解放大道 3 号分支箱", health_status: "WATCH", owner_team_id: 2 },
    { id: 3, asset_code: "XL-04kV-003", asset_type: "EQUIPMENT_DAMAGE", feeder_line: "0.4kV 南苑台区", voltage_level: "0.4kV", location_desc: "南苑小区 7 栋配变", health_status: "DEGRADED", owner_team_id: 2 },
    { id: 4, asset_code: "XL-10kV-004", asset_type: "VOLTAGE_LOW", feeder_line: "10kV 城西线", voltage_level: "10kV", location_desc: "西城区滨河路配电站", health_status: "NORMAL", owner_team_id: 1 },
    { id: 5, asset_code: "XL-04kV-005", asset_type: "SAFETY_RISK", feeder_line: "0.4kV 北郊台区", voltage_level: "0.4kV", location_desc: "北郊村 2 组表箱", health_status: "WATCH", owner_team_id: 4 }
  ] as GridAsset[],

  faultReport: [
    { id: 1, reporter_name: "王建国", phone: "13800000101", asset_id: 1, fault_type: "OUTAGE", address_desc: "和平路周边 3 栋楼停电", severity: "HIGH", report_channel: "95598", status: "ASSIGNED" },
    { id: 2, reporter_name: "李秀兰", phone: "13800000102", asset_id: 2, fault_type: "TRIP", address_desc: "解放大道分支箱跳闸冒烟", severity: "HIGH", report_channel: "95598", status: "ARRIVED" },
    { id: 3, reporter_name: "张伟", phone: "13800000103", asset_id: 3, fault_type: "EQUIPMENT_DAMAGE", address_desc: "南苑配变异响漏油", severity: "MEDIUM", report_channel: "网格群", status: "REPAIRING" },
    { id: 4, reporter_name: "陈芳", phone: "13800000104", asset_id: 4, fault_type: "VOLTAGE_LOW", address_desc: "滨河路晚高峰电压偏低", severity: "LOW", report_channel: "在线监测", status: "ASSIGNED" },
    { id: 5, reporter_name: "赵强", phone: "13800000105", asset_id: 5, fault_type: "SAFETY_RISK", address_desc: "北郊表箱带电裸露", severity: "MEDIUM", report_channel: "巡检上报", status: "CLOSED" }
  ] as FaultReport[],

  repairTicket: [
    { id: 1, fault_report_id: 1, team_id: 1, dispatcher_id: 1, priority: "HIGH", status: "ASSIGNED", assigned_at: "2026-09-26T20:10:00Z", restored_at: null },
    { id: 2, fault_report_id: 2, team_id: 2, dispatcher_id: 1, priority: "HIGH", status: "ARRIVED", assigned_at: "2026-09-26T21:05:00Z", restored_at: null },
    { id: 3, fault_report_id: 3, team_id: 2, dispatcher_id: 1, priority: "MEDIUM", status: "REPAIRING", assigned_at: "2026-09-26T21:30:00Z", restored_at: null },
    { id: 4, fault_report_id: 4, team_id: 1, dispatcher_id: 1, priority: "LOW", status: "ASSIGNED", assigned_at: "2026-09-26T22:00:00Z", restored_at: null },
    { id: 5, fault_report_id: 5, team_id: 4, dispatcher_id: 1, priority: "MEDIUM", status: "CLOSED", assigned_at: "2026-09-25T09:00:00Z", restored_at: "2026-09-25T11:20:00Z" }
  ] as RepairTicket[],

  crew: [
    { id: 1, name: "城东一班（夜班）", leader_id: 101, skill_tags: "复电抢修,低压运维,线路巡检", duty_status: "ON_DUTY", current_ticket_id: 1, contact_phone: "13900000101" },
    { id: 2, name: "城东二班（夜班）", leader_id: 102, skill_tags: "复电抢修,线路巡检,设备检修", duty_status: "ON_DUTY", current_ticket_id: 2, contact_phone: "13900000102" },
    { id: 3, name: "城东机动班", leader_id: 103, skill_tags: "复电抢修,低压运维,线路巡检,设备检修,应急处置", duty_status: "ON_DUTY", current_ticket_id: null, contact_phone: "13900000103" },
    { id: 4, name: "北郊运维班", leader_id: 104, skill_tags: "线路巡检", duty_status: "ON_DUTY", current_ticket_id: 5, contact_phone: "13900000104" },
    { id: 5, name: "城西抢修班", leader_id: 105, skill_tags: "复电抢修,低压运维,设备检修,应急处置", duty_status: "OFF_DUTY", current_ticket_id: null, contact_phone: "13900000105" }
  ] as Crew[],

  sparePartUsage: [
    { id: 1, ticket_id: 1, part_code: "RMU-10/630", part_name: "环网柜负荷开关", quantity: 1, warehouse_name: "城东仓库", approved_by: "仓管-刘敏", usage_status: "PENDING_PICKUP" },
    { id: 2, ticket_id: 1, part_code: "CABLE-10-35", part_name: "10kV 电缆头", quantity: 3, warehouse_name: "城东仓库", approved_by: "仓管-刘敏", usage_status: "PICKED_UP" },
    { id: 3, ticket_id: 2, part_code: "FUSE-10/100", part_name: "跌落式熔断器", quantity: 2, warehouse_name: "城东仓库", approved_by: "仓管-刘敏", usage_status: "PENDING_PICKUP" },
    { id: 4, ticket_id: 4, part_code: "TTU-04", part_name: "配变监测终端", quantity: 1, warehouse_name: "城西仓库", approved_by: "仓管-周杰", usage_status: "PENDING_PICKUP" },
    { id: 5, ticket_id: 5, part_code: "METER-BOX-04", part_name: "表箱防护盒", quantity: 4, warehouse_name: "北郊仓库", approved_by: "仓管-孙丽", usage_status: "CONSUMED" }
  ] as SparePartUsage[],

  arrivalRecord: [
    { id: 1, crew_id: 1, ticket_id: null, site_name: "城东夜巡值守点·和平路", arrived_at: "2026-09-26T20:00:00Z", note: "夜班到场值守，待工单复电后撤离", status: "OPEN" },
    { id: 2, crew_id: 2, ticket_id: 2, site_name: "解放大道分支箱现场", arrived_at: "2026-09-26T21:20:00Z", note: "已到场隔离故障", status: "OPEN" },
    { id: 3, crew_id: 2, ticket_id: 3, site_name: "南苑配变现场", arrived_at: "2026-09-26T21:50:00Z", note: "已开展检修", status: "OPEN" },
    { id: 4, crew_id: 4, ticket_id: 5, site_name: "北郊村表箱", arrived_at: "2026-09-25T09:30:00Z", note: "处置完成撤离", status: "CLOSED" }
  ] as ArrivalRecord[],

  handoverRecord: [
    {
      id: 1,
      from_crew_id: 4,
      to_crew_id: 3,
      handover_operator: "班组长-马涛（上一班）",
      receiver_operator: "班组长-赵磊（接班）",
      status: "SUCCESS",
      ticket_ids: [],
      part_ids: [],
      arrival_ids: [4],
      block_reasons: [],
      remark: "上一轮夜班例行交接",
      created_at: "2026-09-25T08:30:00Z"
    }
  ] as HandoverRecord[]
};
