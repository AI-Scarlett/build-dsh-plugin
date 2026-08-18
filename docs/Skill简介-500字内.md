# build-dsh-plugin Skill 简介

`build-dsh-plugin` 是一套面向 DeepSeek Harness（DSH）插件开发的中文友好型 Agent Skill。用户只需说明“当前问题、期望结果、成功标准”，Skill 就能补齐安全默认值，判断宿主兼容性与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期管理架构，并生成标准 Bundle 源码、权限矩阵、测试、量化审计和验收方案。

它坚持只读优先、最小权限、一次性 Profile 事务、固定来源、隔离测试和 E0–E5 证据分级；不会把源码完成误报为真实安装，也不会未经单独授权修改 DSH 核心、官方插件、真实 Profile、设备或公网环境。适用于新插件生成、第三方兼容性判断、插件审计、发布规划和安全验收。
