# 电力配网抢修工单系统

面向供电所的配网故障报修、抢修派工、备件领用和停电恢复跟踪平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20104>

后端健康检查：<http://localhost:21104/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Vite + Element Plus + Pinia |
| 后端 | Node.js + Express + TypeScript + Prisma |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `grid-repair`
- `FRONTEND_PORT`: 前端端口，默认 `20104`
- `BACKEND_PORT`: 后端端口，默认 `21104`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: grid-repair`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-grid-repair}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- FaultType: constants/FaultType、types/FaultType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- TicketStatus: constants/TicketStatus、types/TicketStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AssetHealthStatus: constants/AssetHealthStatus、types/AssetHealthStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DutyStatus（值班状态 ON_DUTY/OFF_DUTY/TRAINING/LEAVE）: 后端 `constants/DutyStatus.ts`、`services/handoverEligibility.ts`；前端 `constants/DutyStatus.ts`、`constants/statusText.ts`、`components/common/StatusBadge.vue`、`components/common/CrewCard.vue`。
- PartUsageStatus（备件状态，含 PENDING_PICKUP 待领用）: 后端 `constants/PartUsageStatus.ts`、`services/HandoverService.ts`；前端 `constants/PartUsageStatus.ts`、`pages/TicketsPage.vue`、`constants/statusText.ts`。
- ArrivalStatus（到场记录 OPEN/CLOSED）: 后端 `constants/ArrivalStatus.ts`、`repositories/ArrivalRecordRepository.ts`；前端 `constants/ArrivalStatus.ts`、`pages/TicketsPage.vue`。
- HandoverStatus（交接 SUCCESS/FAILED）与 HandoverBlockReason（阻断原因码）: 后端 `constants/HandoverStatus.ts`、`constants/HandoverBlockReason.ts`、`services/HandoverService.ts`、`utils/handoverSnapshot.ts`；前端 `constants/HandoverStatus.ts`、`constants/HandoverBlockReason.ts`、`components/handover/*`、`stores/HandoverStore.ts`。

## 换班交接（夜班）业务规则

入口：抢修工单页 `/tickets` → 「发起换班交接」；接口 `GET /api/handover/preview`、`POST /api/handover/execute`、`GET /api/handover-record`、`GET /api/arrival-record`。

1. 选择接班班组后，仅允许交给同时满足：技能覆盖全部待交接工单所需技能、当前无未结工单（`current_ticket_id` 为空）、值班状态非离岗（仅 ON_DUTY）、且不是原班组的班组；预览接口对每个候选班组返回阻断原因码。
2. 原班组释放（`current_ticket_id` 置空）后，名下未完工单、待领用（PENDING_PICKUP）备件申请和未闭环到场记录一并转到新班组；备件仍挂在工单上随单转移。
3. 已到达现场（ARRIVED/REPAIRING）的任务不得换班：预览按工单列出 `TICKET_ON_SITE` 等阻断原因，执行时整体失败，不做部分交接。
4. 交接失败时，服务端先对 crew/repair_ticket/spare_part_usage/arrival_record 四张表做深拷贝快照，任一步失败即整体回滚，原记录不丢失；同时写入一条 status=FAILED 的交接留痕，409 响应 details 中带回 record/preview。
5. 成功后交接记录保留前后班组（from/to_crew_id）、交班人与接班人（handover_operator/receiver_operator）、转移的工单/备件/到场记录 ID 与时间。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
