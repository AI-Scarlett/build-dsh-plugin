# build-dsh-plugin Skill 简介

`build-dsh-plugin` 0.6.2 候选是面向 DeepSeek Harness（DSH）插件开发的 Agent Skill，并提供原生 Skill Provider Bundle。它从官方 GitHub Releases 与 npm 动态解析最新三个 DSH 版本；候选已按 DSH 0.2.2-alpha.3 补充根 `engines.dsh` 安装范围，当前最新三版均通过 macOS disposable Profile 安装、启动、卸载和精确配置恢复，Linux/Windows CI 仍待完成。Skill 提供 DSH Desktop 宿主规范，并明确客户端适配标识只描述 Desktop 专属 UI 证据，不是安装门槛：DSH Store Desktop 面板可把符合固定来源结构门槛、经用户确认的 `blocked` 条目交由 DSH 官方插件管理器检查，安装结果由 DSH 决定；这不会改变 Catalog 审核状态。Web 与桌面端仍需分别记录能力证据。用户只需说明“问题、结果、成功标准”，即可生成标准 Bundle、权限矩阵、测试、审计和验收流程。

它会判断宿主与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期方案；为模型 Tool 设计卡片契约，保证 live/replay 一致、可降级、有界且不泄密。针对 DSH STORE，它先生成无安装能力的独立发现候选，再经晋级审查检查固定 Commit、Manifest、Patch、Entry ID、许可证、权限、四级可信证据与逐版本安装/启动/卸载/回滚矩阵，并给出 direct、monorepo、adapter-required 或 blocked 路线。

Skill 坚持只读优先、一次性 Profile 事务、隔离测试和 E0–E5 证据分级；未经授权不修改 DSH 核心、DSH STORE、真实 Profile 或公网环境。
