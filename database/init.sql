CREATE TABLE IF NOT EXISTS grid_asset (
  id INTEGER PRIMARY KEY,
  asset_code TEXT,
  asset_type TEXT,
  feeder_line TEXT,
  voltage_level TEXT,
  location_desc TEXT,
  health_status TEXT,
  owner_team_id TEXT
);

CREATE TABLE IF NOT EXISTS fault_report (
  id INTEGER PRIMARY KEY,
  reporter_name TEXT,
  phone TEXT,
  asset_id TEXT,
  fault_type TEXT,
  address_desc TEXT,
  severity TEXT,
  report_channel TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS repair_ticket (
  id INTEGER PRIMARY KEY,
  fault_report_id TEXT,
  team_id TEXT,
  dispatcher_id TEXT,
  priority TEXT,
  status TEXT,
  assigned_at TEXT,
  restored_at TEXT
);

CREATE TABLE IF NOT EXISTS crew (
  id INTEGER PRIMARY KEY,
  name TEXT,
  leader_id TEXT,
  skill_tags TEXT,
  duty_status TEXT,
  current_ticket_id TEXT,
  contact_phone TEXT
);

CREATE TABLE IF NOT EXISTS spare_part_usage (
  id INTEGER PRIMARY KEY,
  ticket_id TEXT,
  part_code TEXT,
  part_name TEXT,
  quantity TEXT,
  warehouse_name TEXT,
  approved_by TEXT,
  usage_status TEXT
);

-- 到场记录：班组到达故障现场的签到/到场台账，换班时随班组值班责任移交
CREATE TABLE IF NOT EXISTS arrival_record (
  id INTEGER PRIMARY KEY,
  crew_id TEXT,
  ticket_id TEXT,
  site_name TEXT,
  arrived_at TEXT,
  note TEXT,
  status TEXT
);

-- 换班交接留痕：成功/失败均记录，保留前后班组与交接/接班人
CREATE TABLE IF NOT EXISTS handover_record (
  id INTEGER PRIMARY KEY,
  from_crew_id TEXT,
  to_crew_id TEXT,
  handover_operator TEXT,
  receiver_operator TEXT,
  status TEXT,
  ticket_ids TEXT,
  part_ids TEXT,
  arrival_ids TEXT,
  block_reasons TEXT,
  remark TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);
