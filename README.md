# build-dsh-plugin

面向 DeepSeek Harness（DSH）插件开发的可复用 Agent Skill 与 DSH 原生 Skill Provider Bundle。它把自然语言或结构化 Brief 转换为标准插件方案、源码工程、工具卡片契约、审计、发行、安装和验收流程，同时把宿主边界、风险等级、权限、变更授权与证据门槛固化为可执行约束。

官网：[DSH STORE Build Lab](https://dsh.store/build/)

仓库现在同时提供两种宿主入口：

- `build-dsh-plugin/` 是可部署到 Codex、Claude、Grok 等兼容 `SKILL.md` 的 Agent Skill；
- 仓库根目录的 `package.json` + `cordis.patch.yml` 是标准 DSH Bundle，通过隔离的 `@deepseek-ai/dsh-skill-filesystem` Provider 将同一份 Skill 挂载到 DSH。

DSH 入口要求 `dsh >= 0.1.0-rc.8 <0.2.0`，当前适配和一次性运行验证基线为 `0.1.1-rc.1`。兼容性矩阵保留 rc.5–rc.8 历史键，并以完整版本键 `0.1.1-rc.1` 记录新版本，避免与早期同名 rc.1 混淆。较早版本只有在独立证据确认后才标记兼容。适配层不安装其他 Agent 运行时，不修改 DSH 核心或官方 Skill Provider，也不包含安装期生命周期脚本。

用户最低只需提供三项信息：

1. 当前要解决的问题；
2. 希望达到的结果；
3. 至少一条可观察的成功标准。

Skill 会补齐安全默认值，判断 DSH 宿主兼容性与 R0–R3 风险，比较 Host、Client、Skill Adapter、ApiProxy 或生命周期管理方案，并输出目的、原因、优势、劣势、适用条件、替代方案、执行步骤与证据门槛。

对于注册模型 Tool 的插件，Skill 会同时设计 DSH 卡片契约：把规范 JSON 输出、模型可见渲染、`presentCall`/`presentResult` 卡片意图、`presentationMeta` 持久化投影和可选 Client 自定义卡片分开；要求 live/replay 一致、通用降级、字段限额、截断状态真实且不泄露凭据、完整私有文件或模型推理。

对于准备进入 DSH STORE 的插件，Skill 会从开发第一天保持商城兼容结构，并把第三方仓库分流为 `direct`、`monorepo`、`adapter-required` 或 `blocked`。0.2.0 起先生成与可信安装库物理分离的发现候选：候选没有包名、安装路径、Entry ID、权限、兼容性或安装操作；只有完成独立晋级审查后才生成 Catalog 提案。0.3.0 起模板和审计器同时覆盖 rc.5–rc.8 与 `0.1.1-rc.1`。可信提案会显式记录固定源更新时间、发现/可安装/运行/安全审查四级证据，以及每个受支持 DSH 版本的安装/启动/卸载/回滚证据。推荐、推广或赞助不会改变验证等级。

对于已上架插件的源更新，Skill 遵循 DSH-Store 的本机决策模型：低风险候选使用 `source-verified` 生成固定 SHA 计划；具备文件、网络、命令、凭据或生命周期能力的合法插件使用 `user-reviewed`，由商城展示实际变化并让用户逐次确认；只有修改 DSH 原生代码、冒用官方命名空间、干预受保护组件等硬边界才使用 `external-only`。版本发现来自用户本机对 canonical GitHub 的有限检查，不要求服务端巡检，也不安装浮动 `main`。

## 核心边界

- 构建标准 DSH Bundle，不修改 DSH 源码或 `@deepseek-ai/*` 包。
- 不禁用、替换或遮蔽官方插件清单。
- 只读优先；真实 Profile、重启、凭据、设备及公网操作必须单独满足条件并授权。
- 测试只使用一次性 Profile/夹具，不写入真实 `~/.dsh`。
- 区分规划、源码、自动化测试、发行、真实安装、运行时与外部验收，不用低层证据替代高层验收。
- Profile/package 变更采用单次计划、精确确认、前置哈希、备份、原子提交、健康检查和回滚。
- 商城上架要求公开 GitHub、40 位固定 Commit、匹配的 manifest/Patch/Entry ID/生命周期/许可证和保守权限元数据；候选、Registry CI、合并与公开页面分别验收。
- 候选发现库与可信安装库严格分离；候选永远 `installable: false` 且没有允许操作，晋级必须重新审核。
- `compatibility.dshReleases` 只表示版本声明，不能替代每个版本的安装、启动、卸载和回滚证据。
- Tool 展示优先使用 DSH 的 provider-neutral 卡片契约；Presenter 不做 I/O、不读当前会话/Profile、不依赖时钟或随机数，也不覆盖官方 Tool 卡片 key。

## 仓库结构

```text
package.json         DSH Bundle manifest
cordis.patch.yml     隔离 Skill Provider Patch
build-dsh-plugin/    可直接部署的 Skill 本体
test/                DSH Bundle 与卡片审计契约测试
docs/                中文简介与完整方法说明
dist/                Agent Skill ZIP、SHA-256、清单和安装说明
```

Skill 入口是 [`build-dsh-plugin/SKILL.md`](build-dsh-plugin/SKILL.md)。完整介绍见 [`docs/Skill完整介绍-10000字内.md`](docs/Skill完整介绍-10000字内.md)。

## 安装到通用 Agent

从固定发行页下载 [`build-dsh-plugin-20260821.1.zip`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v2026.08.21.1/build-dsh-plugin-20260821.1.zip) 和配套的 [`SHA-256` 文件](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v2026.08.21.1/build-dsh-plugin-20260821.1.sha256)，然后验证完整性：

```bash
cd dist
shasum -a 256 -c build-dsh-plugin-20260821.1.sha256
```

确认目标 Skills 目录不存在同名文件夹，或已单独备份已有版本，然后解压：

```bash
unzip build-dsh-plugin-20260821.1.zip -d ~/.codex/skills
```

最终入口应为：

```text
~/.codex/skills/build-dsh-plugin/SKILL.md
```

其他支持 `SKILL.md` 的 Agent 可保持 `build-dsh-plugin/` 内部结构不变，将其复制到对应技能目录。更完整的安装说明见 [`dist/INSTALL.md`](dist/INSTALL.md)。

## 安装到 DSH

DSH 安装的是仓库根目录的标准 Bundle，不是 Agent Skill ZIP。真实 Profile 安装前应先生成单次计划并确认；以下命令只用于明确设置临时 `DSH_HOME` 的一次性验收：

```bash
export DSH_HOME="$(mktemp -d)"
dsh plugin --profile build-plugin-e3 add /absolute/path/to/build-dsh-plugin-repository
dsh --profile build-plugin-e3 --dump-config
```

预期有效配置包含唯一条目 `dsh-build-plugin-skill-provider`，其 Provider 只扫描本仓库的 `build-dsh-plugin/`。不要在真实 `DSH_HOME` 下用一个不存在的 Profile 执行 `dsh plugin --profile <name> --help`：DSH CLI 可能在显示帮助前先创建该 Profile。

固定 GitHub Commit 的商城/远程安装入口需要在该 Commit 合并并通过 DSH STORE 独立校验后才能声明；仓库具备 Bundle 结构不等于已经上架，也不等于真实 Profile 已安装。

## 自检

```bash
npm test
node scripts/verify-distribution.mjs
cd build-dsh-plugin
node scripts/test-normalize-brief.mjs
node scripts/test-marketplace-entry.mjs
node scripts/test-candidate-entry.mjs
node scripts/normalize-brief.mjs assets/plugin-brief.readonly-example.json
node scripts/normalize-brief.mjs assets/plugin-brief.r3-example.json
node scripts/audit-marketplace-entry.mjs /path/to/plugin --entry /path/to/entry.json --registry /path/to/catalog.json
node scripts/audit-candidate-entry.mjs --entry /path/to/candidate.json --candidates /path/to/candidates.json --catalog /path/to/catalog.json
```

通用 Agent Skill 脚本需要 Node.js 18 或更高版本；DSH Bundle 0.3.0 要求 DSH `0.1.0-rc.8 <0.2.0` 及其 Node.js 运行时，并已针对 `0.1.1-rc.1` 做一次性运行验证。预期测试输出包含 `BRIEF_TEST_OK`、`MARKETPLACE_TEST_OK` 和 `CANDIDATE_TEST_OK`；只读示例保持 `R0`，生命周期示例保持 `R3` 且不会直接执行真实 Profile 操作。

`npm test` 还会验证根目录 DSH Bundle、隔离 Provider、无生命周期脚本、卡片契约文档，以及审计器对不支持的卡片 discriminant、缺失 replay/fallback/bounds 测试的 fail-closed 行为。

## 使用示例

```text
使用 $build-dsh-plugin，根据下面的 Brief 直接生成 DSH 插件源码：

当前问题：会话很多时，很难快速找到失败或长期无响应的任务。
期望结果：在 DSH 设置页看到异常会话及原因摘要。
成功标准：一次性 Profile 中页面可见；异常夹具分类正确；真实 Profile 保持不变。
```

## 发行完整性

- 发行版本：`2026.08.21.1`
- 固定发行标签：[`v2026.08.21.1`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/tag/v2026.08.21.1)
- ZIP SHA-256：`0875beb56dff055f8e876d00acec3907e48f2eceeab554f21040c034b4ad9b5d`
- ZIP 内常规文件数：25（新增候选发现模板、候选审计器和候选负向测试；保留 Tool 卡片契约、可信 Catalog 模板与独立 `LICENSE`）
- 已通过 Skill 结构、Node 语法、Brief/商城/卡片审计测试、DSH Bundle 契约、一次性 CLI 安装、配置合成、运行时 Skill 发现和 ZIP 解压复测

`dist/manifest.json` 是版本、下载地址、SHA-256、文件数和许可证的机器可读单一来源。README 与 INSTALL 只负责说明；DSH STORE 等分发页面必须读取“最新 GitHub Release → 对应标签下的 manifest”，不能把这些字段复制成另一份运行时数据。这样即使网页缓存暂时未刷新，下载页仍会把同一固定标签的 manifest、ZIP 和校验值绑定在一起。

## 开源许可证

本项目采用 [MIT License](LICENSE)。你可以使用、复制、修改、合并、发布、分发、再许可或销售本项目的副本，但必须在副本或主要部分中保留原版权声明和许可声明。发行 ZIP 内也包含相同许可证，解压后仍能保留授权信息。
