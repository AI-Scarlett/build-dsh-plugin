# build-dsh-plugin

面向 DeepSeek Harness（DSH）插件开发的可复用 Agent Skill。它把自然语言或结构化 Brief 转换为标准插件方案、源码工程、审计、发行、安装和验收流程，同时把宿主边界、风险等级、权限、变更授权与证据门槛固化为可执行约束。

用户最低只需提供三项信息：

1. 当前要解决的问题；
2. 希望达到的结果；
3. 至少一条可观察的成功标准。

Skill 会补齐安全默认值，判断 DSH 宿主兼容性与 R0–R3 风险，比较 Host、Client、Skill Adapter、ApiProxy 或生命周期管理方案，并输出目的、原因、优势、劣势、适用条件、替代方案、执行步骤与证据门槛。

## 核心边界

- 构建标准 DSH Bundle，不修改 DSH 源码或 `@deepseek-ai/*` 包。
- 不禁用、替换或遮蔽官方插件清单。
- 只读优先；真实 Profile、重启、凭据、设备及公网操作必须单独满足条件并授权。
- 测试只使用一次性 Profile/夹具，不写入真实 `~/.dsh`。
- 区分规划、源码、自动化测试、发行、真实安装、运行时与外部验收，不用低层证据替代高层验收。
- Profile/package 变更采用单次计划、精确确认、前置哈希、备份、原子提交、健康检查和回滚。

## 仓库结构

```text
build-dsh-plugin/   可直接部署的 Skill 本体
docs/               中文简介与完整方法说明
dist/               已验证 ZIP、SHA-256、清单和安装说明
```

Skill 入口是 [`build-dsh-plugin/SKILL.md`](build-dsh-plugin/SKILL.md)。完整介绍见 [`docs/Skill完整介绍-10000字内.md`](docs/Skill完整介绍-10000字内.md)。

## 安装

从固定发行页下载 [`build-dsh-plugin-20260818.zip`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v2026.08.18/build-dsh-plugin-20260818.zip) 和配套的 [`SHA-256` 文件](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v2026.08.18/build-dsh-plugin-20260818.sha256)，然后验证完整性：

```bash
cd dist
shasum -a 256 -c build-dsh-plugin-20260818.sha256
```

确认目标 Skills 目录不存在同名文件夹，或已单独备份已有版本，然后解压：

```bash
unzip build-dsh-plugin-20260818.zip -d ~/.codex/skills
```

最终入口应为：

```text
~/.codex/skills/build-dsh-plugin/SKILL.md
```

其他支持 `SKILL.md` 的 Agent 可保持 `build-dsh-plugin/` 内部结构不变，将其复制到对应技能目录。更完整的安装说明见 [`dist/INSTALL.md`](dist/INSTALL.md)。

## 自检

```bash
node scripts/verify-distribution.mjs
cd build-dsh-plugin
node scripts/test-normalize-brief.mjs
node scripts/normalize-brief.mjs assets/plugin-brief.readonly-example.json
node scripts/normalize-brief.mjs assets/plugin-brief.r3-example.json
```

需要 Node.js 18 或更高版本，不依赖第三方 npm 包。预期测试输出包含 `BRIEF_TEST_OK`；只读示例保持 `R0`，生命周期示例保持 `R3` 且不会直接执行真实 Profile 操作。

## 使用示例

```text
使用 $build-dsh-plugin，根据下面的 Brief 直接生成 DSH 插件源码：

当前问题：会话很多时，很难快速找到失败或长期无响应的任务。
期望结果：在 DSH 设置页看到异常会话及原因摘要。
成功标准：一次性 Profile 中页面可见；异常夹具分类正确；真实 Profile 保持不变。
```

## 发行完整性

- 发行版本：`2026.08.18`
- 固定发行标签：[`v2026.08.18`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/tag/v2026.08.18)
- ZIP SHA-256：`f19ae506d79e55ca1fdd86a6eadecb7a0aefeaae7061c8f0cdc758f0404127fc`
- ZIP 内常规文件数：16（包含独立的 `LICENSE`）
- 已通过 Skill 结构、Node 语法、Brief 测试、个人绝对路径、敏感模式和一次性解压复测

`dist/manifest.json` 是版本、下载地址、SHA-256、文件数和许可证的机器可读单一来源。README 与 INSTALL 只负责说明；DSH STORE 等分发页面必须读取“最新 GitHub Release → 对应标签下的 manifest”，不能把这些字段复制成另一份运行时数据。这样即使网页缓存暂时未刷新，下载页仍会把同一固定标签的 manifest、ZIP 和校验值绑定在一起。

## 开源许可证

本项目采用 [MIT License](LICENSE)。你可以使用、复制、修改、合并、发布、分发、再许可或销售本项目的副本，但必须在副本或主要部分中保留原版权声明和许可声明。发行 ZIP 内也包含相同许可证，解压后仍能保留授权信息。
