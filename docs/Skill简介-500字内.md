# build-dsh-plugin Skill 简介

`build-dsh-plugin` 0.5.3 是面向 DeepSeek Harness（DSH）插件开发的 Agent Skill，并提供原生 Skill Provider Bundle。它从官方 GitHub Releases 与 npm 动态解析最新三个 DSH 版本，并通过 Linux、macOS、Windows 的 disposable Profile 矩阵验证安装、启动、卸载和回滚；每个精确版本只有在矩阵通过后才会标记兼容。用户只需说明“问题、结果、成功标准”，即可生成标准 Bundle、权限矩阵、测试、审计和验收流程。

它会判断宿主与 R0–R3 风险，选择 Host、Client、Skill Adapter、ApiProxy 或生命周期方案；为模型 Tool 设计卡片契约，保证 live/replay 一致、可降级、有界且不泄密。针对 DSH STORE，它先生成无安装能力的独立发现候选，再经晋级审查检查固定 Commit、Manifest、Patch、Entry ID、许可证、权限、四级可信证据与逐版本安装/启动/卸载/回滚矩阵，并给出 direct、monorepo、adapter-required 或 blocked 路线。

Skill 坚持只读优先、一次性 Profile 事务、隔离测试和 E0–E5 证据分级；未经授权不修改 DSH 核心、DSH STORE、真实 Profile 或公网环境。
