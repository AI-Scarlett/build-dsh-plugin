# build-dsh-plugin 分发包

这个 ZIP 是给 Agent 使用的 Skill，不是要安装进 DSH Profile 的插件包。它负责把标准需求 Brief 转换成 DSH 插件方案、源码、Tool 卡片契约、审计和验收流程。仓库根目录另外提供标准 DSH Skill Provider Bundle；DSH 用户应安装仓库 Bundle，而不是把 ZIP 当成 Profile 插件包。

## 文件

- `build-dsh-plugin-20260821.1.zip`：完整 Skill，ZIP 顶层是 `build-dsh-plugin/`。
- `build-dsh-plugin-20260821.1.sha256`：ZIP 完整性校验。
- `manifest.json`：版本、入口、依赖、校验状态和明确排除项。

固定发行页：<https://github.com/AI-Scarlett/build-dsh-plugin/releases/tag/v2026.08.21.1>

发行版本：`2026.08.21.1`

`manifest.json` 是版本、下载地址、SHA-256、文件数和许可证的机器可读单一来源。分发页面应先解析最新 GitHub Release，再读取该标签下的 manifest；不要从 README 或 INSTALL 抽取运行时元数据。

## 安装前验证

在本目录运行：

```bash
shasum -a 256 -c build-dsh-plugin-20260821.1.sha256
unzip -l build-dsh-plugin-20260821.1.zip
```

期望 SHA-256：

```text
0875beb56dff055f8e876d00acec3907e48f2eceeab554f21040c034b4ad9b5d
```

## 安装到另一套 Codex

先确认目标环境中不存在同名目录，或先手工备份已有的 `build-dsh-plugin`。不要直接覆盖一份正在使用或有本地修改的 Skill。

把 ZIP 解压到目标 Codex 的 skills 目录，使最终结构为：

```text
<CODEX_HOME>/skills/build-dsh-plugin/SKILL.md
```

例如目标使用默认目录时，可以在确认同名目录不存在后执行：

```bash
unzip build-dsh-plugin-20260821.1.zip -d ~/.codex/skills
```

重新打开任务或让 Agent 重新加载 Skills，然后用下面的方式触发：

```text
使用 $build-dsh-plugin，根据下面的 Brief 直接生成 DSH 插件源码：……
```

## 安装到支持 SKILL.md 的其他 Agent

保持 ZIP 内相对目录不变，把 `build-dsh-plugin/` 放入该 Agent 的技能目录，并将 `SKILL.md` 设置为技能入口。`agents/openai.yaml` 是 Codex UI 元数据；不识别它的 Agent 可以忽略，但不能忽略 `SKILL.md`、`references/`、`assets/` 和 `scripts/`。

如果 Agent 没有原生 Skill 机制，可以把 `SKILL.md` 作为任务级系统/工作流指令加载，并允许它按相对路径读取 `references/`。这种方式能复用方法论，但自动触发和 UI 元数据取决于目标 Agent。

## DSH 原生入口

DSH `0.1.1-rc.1` 已在一次性 Profile 中验证仓库根目录的 `dsh-build-plugin` 0.3.0 Bundle；声明范围仍为 `>=0.1.0-rc.8 <0.2.0`。它通过唯一条目 `dsh-build-plugin-skill-provider` 隔离挂载同一份 Skill，不安装 Codex、Claude 或 Grok Runtime，也不覆盖官方 Skill Provider。固定 GitHub Commit 的远程/商城入口需要在对应 Commit 合并并通过独立 Registry 校验后使用。

真实 Profile 安装仍属于单独操作，需要计划、确认、备份、健康检查和回滚。E3 验收必须在首次 CLI 调用前设置临时 `DSH_HOME`；不要在真实 DSH home 下对不存在的 Profile 运行 `dsh plugin --profile <name> --help`，因为 CLI 可能先创建 Profile 再显示帮助。

## 目标环境要求

- 读取 Markdown 和相对路径引用；
- 如需运行 Brief 归一化器或审计器，需要 Node.js 18 或更高版本；
- 不需要 npm 安装或第三方 Node 包；
- 真正构建或验收 DSH 插件时，目标环境还需要另行提供 DSH 源码/文档或运行环境；分发包本身不携带它们。

## 安装后自检

在目标 Skill 目录运行：

```bash
node scripts/test-normalize-brief.mjs
node scripts/test-marketplace-entry.mjs
node scripts/test-candidate-entry.mjs
node scripts/normalize-brief.mjs assets/plugin-brief.readonly-example.json
node scripts/normalize-brief.mjs assets/plugin-brief.r3-example.json
```

期望结果：

- 测试输出 `BRIEF_TEST_OK`；
- 商城夹具输出 `MARKETPLACE_TEST_OK`，覆盖 direct、monorepo、adapter-required、blocked 和不一致候选；
- 候选层夹具输出 `CANDIDATE_TEST_OK`，并拒绝任何安装字段、可信目录重复项或弱化的可信策略；
- 只读示例为 `READY / R0 / host-client`；
- 生命周期示例为 `READY / R3 / lifecycle-manager`，同时保持真实 Profile 操作阻断。

## 建议试用 Prompt

```markdown
使用 `$build-dsh-plugin` 直接生成 DSH 插件源码。

插件名称：DSH 会话健康概览
现在遇到的问题：会话很多时，很难快速找到失败或长期无响应的任务。
希望达到的结果：在 DSH 设置页看到异常会话及原因摘要。
核心能力：读取状态；筛选异常；展示有界详情。
明确不能做什么：不能修改会话、DSH 核心和真实 Profile。
怎么才算成功：一次性 Profile 中页面可见；异常夹具分类正确；真实 Profile 保持不变。
```

观察目标 Agent 是否能够：

1. 归一化 Brief 并公开默认假设；
2. 判断为 R0 和 Host+Client；
3. 说明方案的目的、原因、优势、劣势和证据；
4. 直接进入源码与测试，而不是重新提出宽泛问卷；
5. 停在真实 Profile、发布和外部操作授权门之前。

## 开源许可证

本 Skill 使用 MIT License。发行 ZIP 内包含 `build-dsh-plugin/LICENSE`；复制、修改或再分发时必须保留该版权与许可声明。
