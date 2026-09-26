export const mockData = {
  "gridAsset": [
    {
      "id": 1,
      "asset_code": "asset code 1",
      "asset_type": "VOLTAGE_LOW",
      "feeder_line": "feeder line 1",
      "voltage_level": "LOW",
      "location_desc": "location desc 1",
      "health_status": "ASSIGNED",
      "owner_team_id": 1
    },
    {
      "id": 2,
      "asset_code": "asset code 2",
      "asset_type": "TRIP",
      "feeder_line": "feeder line 2",
      "voltage_level": "MEDIUM",
      "location_desc": "location desc 2",
      "health_status": "ARRIVED",
      "owner_team_id": 2
    },
    {
      "id": 3,
      "asset_code": "asset code 3",
      "asset_type": "EQUIPMENT_DAMAGE",
      "feeder_line": "feeder line 3",
      "voltage_level": "HIGH",
      "location_desc": "location desc 3",
      "health_status": "WAIT_DISPATCH",
      "owner_team_id": 3
    }
  ],
  "faultReport": [
    {
      "id": 1,
      "reporter_name": "reporter name 1",
      "phone": "13800000001",
      "asset_id": 1,
      "fault_type": "VOLTAGE_LOW",
      "address_desc": "address desc 1",
      "severity": "severity 1",
      "report_channel": "report channel 1",
      "status": "ASSIGNED"
    },
    {
      "id": 2,
      "reporter_name": "reporter name 2",
      "phone": "13800000002",
      "asset_id": 2,
      "fault_type": "TRIP",
      "address_desc": "address desc 2",
      "severity": "severity 2",
      "report_channel": "report channel 2",
      "status": "ARRIVED"
    },
    {
      "id": 3,
      "reporter_name": "reporter name 3",
      "phone": "13800000003",
      "asset_id": 3,
      "fault_type": "EQUIPMENT_DAMAGE",
      "address_desc": "address desc 3",
      "severity": "severity 3",
      "report_channel": "report channel 3",
      "status": "WAIT_DISPATCH"
    }
  ],
  "repairTicket": [
    {
      "id": 1,
      "fault_report_id": 1,
      "team_id": 1,
      "dispatcher_id": 1,
      "priority": "priority 1",
      "status": "ASSIGNED",
      "assigned_at": "2026-06-11T09:00:00Z",
      "restored_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "fault_report_id": 2,
      "team_id": 2,
      "dispatcher_id": 2,
      "priority": "priority 2",
      "status": "ARRIVED",
      "assigned_at": "2026-06-12T09:00:00Z",
      "restored_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "fault_report_id": 3,
      "team_id": 3,
      "dispatcher_id": 3,
      "priority": "priority 3",
      "status": "WAIT_DISPATCH",
      "assigned_at": "2026-06-13T09:00:00Z",
      "restored_at": "2026-06-13T09:00:00Z"
    }
  ],
  "crew": [
    {
      "id": 1,
      "name": "抢修一班",
      "leader_id": 1,
      "skill_tags": "高压,电缆,架空线",
      "duty_status": "ON_DUTY",
      "current_ticket_id": 1,
      "contact_phone": "13800000001"
    },
    {
      "id": 2,
      "name": "抢修二班",
      "leader_id": 2,
      "skill_tags": "高压,变压器",
      "duty_status": "ON_DUTY",
      "current_ticket_id": 2,
      "contact_phone": "13800000002"
    },
    {
      "id": 3,
      "name": "抢修三班",
      "leader_id": 3,
      "skill_tags": "低压,电缆",
      "duty_status": "OFF_DUTY",
      "current_ticket_id": 3,
      "contact_phone": "13800000003"
    },
    {
      "id": 4,
      "name": "抢修四班",
      "leader_id": 4,
      "skill_tags": "高压,电缆",
      "duty_status": "ON_DUTY",
      "current_ticket_id": 0,
      "contact_phone": "13800000004"
    },
    {
      "id": 5,
      "name": "抢修五班",
      "leader_id": 5,
      "skill_tags": "低压,计量",
      "duty_status": "ON_DUTY",
      "current_ticket_id": 0,
      "contact_phone": "13800000005"
    }
  ],
  "arrivalRecord": [
    {
      "id": 1,
      "ticket_id": 1,
      "team_id": 1,
      "arrived_at": "2026-06-11T09:30:00Z"
    },
    {
      "id": 2,
      "ticket_id": 2,
      "team_id": 2,
      "arrived_at": "2026-06-12T10:00:00Z"
    }
  ],
  "sparePartUsage": [
    {
      "id": 1,
      "ticket_id": 1,
      "part_code": "part code 1",
      "part_name": "part name 1",
      "quantity": 92,
      "warehouse_name": "warehouse name 1",
      "approved_by": "approved by 1",
      "usage_status": "PENDING"
    },
    {
      "id": 2,
      "ticket_id": 2,
      "part_code": "part code 2",
      "part_name": "part name 2",
      "quantity": 104,
      "warehouse_name": "warehouse name 2",
      "approved_by": "approved by 2",
      "usage_status": "APPROVED"
    },
    {
      "id": 3,
      "ticket_id": 3,
      "part_code": "part code 3",
      "part_name": "part name 3",
      "quantity": 116,
      "warehouse_name": "warehouse name 3",
      "approved_by": "approved by 3",
      "usage_status": "PENDING"
    }
  ]
} as const;
