# build-dsh-plugin Skill 简介

`build-dsh-plugin` 是一套面向 DeepSeek Harness（DSH）插件开发的中文友好型 Agent Skill。用户只需说明“当前问题、期望结果、成功标准”，Skill 就能补齐安全默认值，判断宿主兼容性与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期管理架构，并生成标准 Bundle 源码、权限矩阵、测试、量化审计和验收方案。

它坚持只读优先、最小权限、一次性 Profile 事务、固定来源、隔离测试和 E0–E5 证据分级。针对 DSH STORE，它会从开发阶段生成商城兼容结构，把第三方仓库判断为直接上架、单仓库多包、需要适配器或阻断，并检查固定 Commit、Manifest、Patch、Entry ID、生命周期、许可证、权限与兼容性；但不会把候选误报为已上架，也不会未经单独授权修改 STORE、DSH 核心、真实 Profile、设备或公网环境。
