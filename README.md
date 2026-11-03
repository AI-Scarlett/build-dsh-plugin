# build-dsh-plugin

面向 DeepSeek Harness（DSH）插件开发的可复用 Agent Skill 与 DSH 原生 Skill Provider Bundle。它把自然语言或结构化 Brief 转换为标准插件方案、源码工程、工具卡片契约、审计、发行、安装和验收流程，同时把宿主边界、风险等级、权限、变更授权与证据门槛固化为可执行约束。

官网：[DSH STORE Build Lab](https://dsh.store/build/)

仓库现在同时提供两种宿主入口：

- `build-dsh-plugin/` 是可部署到 Codex、Claude、Grok 等兼容 `SKILL.md` 的 Agent Skill；
- 仓库根目录的 `package.json` + `cordis.patch.yml` 是标准 DSH Bundle；Patch 只插入插件自有的 `dsh-build-plugin` Host 适配器，再由适配器通过注入的公开 `ctx.skills.register()` 服务接口，将同一份 Skill 挂载到 DSH。该接口及完整 Bundle 生命周期由随官方最新三版本动态更新的隔离 CI 矩阵验证。

DSH Bundle `0.6.1` 起明确 Desktop 适配标识不是安装门槛：没有桌面专属界面的 Host-only 插件也可交给 DSH Desktop 官方插件管理器检查。当前 Store Desktop 面板还允许对结构安全的 `blocked` 固定来源，在展示审核原因并逐次确认后调用 DSH `inspect`；只有 DSH 接受才调用安装，结果由 DSH 返回。这个交接不改变 Catalog 审核状态，也不放开 Store 自主管理的 Web 安装。Web 与 Desktop 是不同宿主，需分别记录兼容性证据；`v0.6.1` 发布时的 DSH 最新三版本为 `0.2.1-rc.4`、`0.2.1-rc.5`、`0.2.2-alpha.2`，官方 Desktop feed 为 `0.2.1-rc.5`。真实 Desktop UI/Profile E4 始终单独验收。Bundle 适配层不安装其他 Agent 运行时，不修改 DSH 核心或官方 Skill Provider，也不包含安装期生命周期脚本。

`0.6.2` 候选按 DSH `0.2.2-alpha.3` 更新：根 `package.json` 补上官方安装器读取的 `engines.dsh`，并同步 Catalog 兼容范围；商城审计器会检查两者一致。当前动态最新三版 `0.2.1-rc.5`、`0.2.2-alpha.2`、`0.2.2-alpha.3` 均已在 macOS disposable Profile 中通过安装、启动、卸载及精确配置恢复；Linux/Windows 矩阵仍待 CI，真实 Desktop UI/Profile 也未验收。DSH Bundle 只打包 Skill 运行所需资源和审计脚本，不再附带仅供开发校验的 `test-*` 脚本。它仍是未发布候选版本。

用户最低只需提供三项信息：

1. 当前要解决的问题；
2. 希望达到的结果；
3. 至少一条可观察的成功标准。

Skill 会补齐安全默认值，判断 DSH 宿主兼容性与 R0–R3 风险，比较 Host、Client、Skill Adapter、ApiProxy 或生命周期管理方案，并输出目的、原因、优势、劣势、适用条件、替代方案、执行步骤与证据门槛。

对于注册模型 Tool 的插件，Skill 会同时设计 DSH 卡片契约：把规范 JSON 输出、模型可见渲染、`presentCall`/`presentResult` 卡片意图、`presentationMeta` 持久化投影和可选 Client 自定义卡片分开；要求 live/replay 一致、通用降级、字段限额、截断状态真实且不泄露凭据、完整私有文件或模型推理。

对于准备进入 DSH STORE 的插件，Skill 会从开发第一天保持商城兼容结构，并把第三方仓库分流为 `direct`、`monorepo`、`adapter-required` 或 `blocked`。0.2.0 起先生成与可信安装库物理分离的发现候选：候选没有包名、安装路径、Entry ID、权限、兼容性或安装操作；只有完成独立晋级审查后才生成 Catalog 提案。Store 的 `blocked` 仍表示未通过可信 Catalog 审核；在 Desktop 面板中，符合固定源码结构门槛的条目可经用户确认交给官方插件管理器 `inspect/installBundle`，由 DSH 决定是否安装，且不改变 Catalog 状态。模板和审计器会动态读取官方最新三版本，并在更高版本存在时独立测试官方 `next` 通道。可信提案会显式记录固定源更新时间、发现/可安装/运行/安全审查四级证据，以及每个单独测试过的 DSH 版本之安装/启动/卸载/回滚证据。推荐、推广或赞助不会改变验证等级。

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
- 根 `engines.dsh` 是 DSH 安装器的版本门槛；`compatibility.dshReleases` 是商城证据，不能互相替代，也不能替代逐版安装、启动、卸载和回滚结果。
- Tool 展示优先使用 DSH 的 provider-neutral 卡片契约；Presenter 不做 I/O、不读当前会话/Profile、不依赖时钟或随机数，也不覆盖官方 Tool 卡片 key。

## 仓库结构

```text
package.json         DSH Bundle manifest
cordis.patch.yml     仅插入插件自有 Host 适配器
src/index.mjs        调用官方公开 Skills 服务接口的 Host 适配器
build-dsh-plugin/    可直接部署的 Skill 本体
test/                DSH Bundle 与卡片审计契约测试
docs/                中文简介与完整方法说明
dist/                Agent Skill ZIP、SHA-256、清单和安装说明
```

Skill 入口是 [`build-dsh-plugin/SKILL.md`](build-dsh-plugin/SKILL.md)。完整介绍见 [`docs/Skill完整介绍-10000字内.md`](docs/Skill完整介绍-10000字内.md)。

## 安装到通用 Agent

从固定发行页下载 [`build-dsh-plugin-0.6.1.zip`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v0.6.1/build-dsh-plugin-0.6.1.zip) 和配套的 [`SHA-256` 文件](https://github.com/AI-Scarlett/build-dsh-plugin/releases/download/v0.6.1/build-dsh-plugin-0.6.1.sha256)，然后验证完整性：

```bash
cd dist
shasum -a 256 -c build-dsh-plugin-0.6.1.sha256
```

确认目标 Skills 目录不存在同名文件夹，或已单独备份已有版本，然后解压：

```bash
unzip build-dsh-plugin-0.6.1.zip -d ~/.codex/skills
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

通用 Agent Skill 脚本需要 Node.js 18 或更高版本；`0.6.2` 候选当前 DSH 最新三版在 macOS disposable Profile 均通过安装、启动、卸载和精确配置恢复，Linux/Windows 矩阵仍待 CI。历史 `0.6.1` 结果未被继承。Desktop 适配标签不作为安装门槛；Desktop 面板可把符合结构门槛、经用户确认的 `blocked` 固定来源交给官方插件管理器，DSH 返回结果决定安装是否成功，Catalog 审核状态保持独立。CLI Disposable Profile 结果不等于已安装 Desktop UI/Profile E4。后续每次发布都必须重新运行动态窗口矩阵。预期测试输出包含 `BRIEF_TEST_OK`、`MARKETPLACE_TEST_OK` 和 `CANDIDATE_TEST_OK`；只读示例保持 `R0`，生命周期示例保持 `R3` 且不会直接执行真实 Profile 操作。

`npm test` 还会验证根目录 DSH Bundle、隔离 Provider、无生命周期脚本、卡片契约文档，以及审计器对不支持的卡片 discriminant、缺失 replay/fallback/bounds 测试的 fail-closed 行为。

## 使用示例

```text
使用 $build-dsh-plugin，根据下面的 Brief 直接生成 DSH 插件源码：

当前问题：会话很多时，很难快速找到失败或长期无响应的任务。
期望结果：在 DSH 设置页看到异常会话及原因摘要。
成功标准：一次性 Profile 中页面可见；异常夹具分类正确；真实 Profile 保持不变。
```

## 发行完整性

- 发行版本：`2026.11.01.1`
- 固定发行标签：[`v0.6.1`](https://github.com/AI-Scarlett/build-dsh-plugin/releases/tag/v0.6.1)
- ZIP SHA-256：`09a567fd382af1313591d2df45689035024a4393cb1de72e971544dc1b990aac`
- ZIP 内常规文件数：31（含官方 DSH 桌面端指南与独立 `LICENSE`）
- `v0.6.1` 发布时的官方最新三版本为 `0.2.1-rc.4`、`0.2.1-rc.5`、`0.2.2-alpha.2`；该历史兼容矩阵由 GitHub Actions 对固定版本执行。官方 Desktop UI/Profile 验收仍与 CLI 矩阵分开。

`dist/manifest.json` 是版本、下载地址、SHA-256、文件数和许可证的机器可读单一来源。README 与 INSTALL 只负责说明；DSH STORE 等分发页面必须读取“最新 GitHub Release → 对应标签下的 manifest”，不能把这些字段复制成另一份运行时数据。这样即使网页缓存暂时未刷新，下载页仍会把同一固定标签的 manifest、ZIP 和校验值绑定在一起。

## 开源许可证

本项目采用 [MIT License](LICENSE)。你可以使用、复制、修改、合并、发布、分发、再许可或销售本项目的副本，但必须在副本或主要部分中保留原版权声明和许可声明。发行 ZIP 内也包含相同许可证，解压后仍能保留授权信息。

`v0.6.1` Release 发布后，独立回读 GitHub API、ZIP、SHA-256、manifest 与 MIT License；真实 Profile 和官方桌面 UI 验收不会由 CLI 矩阵推断。

### v0.6.2 候选（未发布）

- 候选标签：`v0.6.2`
- 候选 ZIP SHA-256：`b3e8e11f6503e5ca6193d87d4ae8124be04920758f0af56578c8e9e8f7b530a5`
- 当前 DSH 最新三版：`0.2.1-rc.5`、`0.2.2-alpha.2`、`0.2.2-alpha.3`
- 当前最新三版均已列入 `engines.dsh`；macOS disposable Profile 的安装、启动、卸载和精确配置恢复已通过，Linux/Windows CI 与真实 Desktop UI/Profile 仍未验收

该候选尚未创建 GitHub Release、尚未合并到 `main`，也尚未提交 DSH STORE。`dist/manifest.json` 是待发布候选清单；公网发布状态仍以 GitHub Release 和商城页面回读为准。
