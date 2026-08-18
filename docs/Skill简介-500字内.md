# build-dsh-plugin Skill 简介

`build-dsh-plugin` 是面向 DeepSeek Harness（DSH）插件开发的 Agent Skill，并提供 DSH `0.1.0-rc.7+` 原生 Skill Provider Bundle。用户只需说明“问题、结果、成功标准”，即可生成标准 Bundle、权限矩阵、测试、审计和验收流程。

它会判断宿主与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期方案；为模型 Tool 设计卡片契约，保证 live/replay 一致、可降级、有界且不泄密。针对 DSH STORE，它检查固定 Commit、Manifest、Patch、Entry ID、许可证、权限与兼容性，并给出 direct、monorepo、adapter-required 或 blocked 路线。

Skill 坚持只读优先、一次性 Profile 事务、隔离测试和 E0–E5 证据分级；未经授权不修改 DSH 核心、DSH STORE、真实 Profile 或公网环境。
