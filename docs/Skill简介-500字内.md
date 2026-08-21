# build-dsh-plugin Skill 简介

`build-dsh-plugin` 0.3.0 是面向 DeepSeek Harness（DSH）插件开发的 Agent Skill，并提供已针对 DSH `0.1.1-rc.1` 验证的原生 Skill Provider Bundle。用户只需说明“问题、结果、成功标准”，即可生成标准 Bundle、rc.5–rc.8 与 `0.1.1-rc.1` 兼容和操作证据矩阵、权限矩阵、测试、审计和验收流程。

它会判断宿主与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期方案；为模型 Tool 设计卡片契约，保证 live/replay 一致、可降级、有界且不泄密。针对 DSH STORE，它先生成无安装能力的独立发现候选，再经晋级审查检查固定 Commit、Manifest、Patch、Entry ID、许可证、权限、四级可信证据与逐版本安装/启动/卸载/回滚矩阵，并给出 direct、monorepo、adapter-required 或 blocked 路线。

Skill 坚持只读优先、一次性 Profile 事务、隔离测试和 E0–E5 证据分级；未经授权不修改 DSH 核心、DSH STORE、真实 Profile 或公网环境。
