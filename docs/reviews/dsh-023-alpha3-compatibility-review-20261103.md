# Build DSH Plugin 0.6.2 candidate — DSH 0.2.2-alpha.3 review

Date: 2026-11-03  
Base source Commit: `c71903bffd9098aecbca4b1cf60b0d7602c51f33`  
Status: local source candidate; not committed, pushed, released, merged, or listed.

## Official contract checked

- [DSH `0.2.2-alpha.3` release](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-alpha.3) is the current official release.
- [Official package-and-install guide at that tag](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-alpha.3/docs/user/develop/basic/publish.md) defines root `engines.dsh` as the bundle's compatibility range checked during install and Profile startup. When the field is absent, DSH falls back to `@deepseek-ai/dsh*` peer ranges.
- The release adds native plugin-management operations to the TypeScript and Python SDK, requiring approval for each action; package changes report restart required because they do not hot reload.
- The release distinguishes plugin installation failure from activation failure and includes complete diagnostics plus the Host log location.

The Build DSH Plugin Bundle uses only the injected public `ctx.skills.register()` service. It does not call the new SDK plugin-management API, provide a Desktop-specific Client, or modify DSH internals. The new API does not require a runtime code change in this Bundle; its lifecycle and troubleshooting guidance has been updated.

## Source changes

- Candidate version is `0.6.2`.
- Root `engines.dsh` now matches `dsh.compatibility.dsh` and includes `0.2.2-alpha.3`.
- The live latest-three window is `0.2.1-rc.5`, `0.2.2-alpha.2`, `0.2.2-alpha.3`.
- All three current latest releases passed macOS disposable-Profile acceptance for the current `0.6.2` package using the official CLI: install, `--dump-config` composition, Web cold start, authenticated HTTP probe, uninstall, and exact restoration of the pre-install Profile composition. These are not inherited `0.6.1` results. Linux/Windows CI remains pending.
- The DSH Bundle package file allowlist now includes only the Skill entry/resources and required audit helpers. Repository-only `test-*` scripts remain in source and the standalone Skill ZIP, but are excluded from the installable DSH package.
- The marketplace auditor now requires explicit `engines.dsh` and checks it against Catalog `compatibility.dsh`.

## Why the current Catalog blocks it

The current Catalog record is pinned to `0.6.1` / `c71903bffd9098aecbca4b1cf60b0d7602c51f33` and reports:

> Automatic policy blocked installation: fixed-source security warnings require review; runtime source contains the files permission signal; runtime source contains the commands permission signal; runtime source contains the credentials permission signal

The Bundle is structurally a direct DSH package: its manifest declares `dsh.bundle.patch`, the Patch inserts only `dsh-build-plugin-skill-provider`, and the package declares no install lifecycle scripts. The static plugin audit returned 80/80 and `isolated-acceptance-ready`; that is E1/E2 source readiness, not runtime proof.

The old package manifest selected the complete `build-dsh-plugin/` tree. The `commands` finding came from three `test-*` JavaScript harnesses that use `child_process` to launch local fixture checks; they are development tests, not Skill runtime helpers. The 0.6.2 DSH package allowlist now excludes those harnesses while keeping them in the standalone Skill ZIP. This should remove the packaged child-process/security-warning finding; it still needs a fixed-Commit Store scan to confirm.

The `files` signal is real but bounded: `src/index.mjs` reads the bundled Skill resource, while the shipped audit/normalization helpers read the project or Brief supplied by the user. No install lifecycle script or automatic package write is declared. The optional `GITHUB_TOKEN` in `official-dsh-releases.mjs` is a real API credential used only for official GitHub release metadata; the `credentials` mention in `audit-marketplace-entry.mjs` validates Catalog permission labels and does not read a secret. A Store review should disclose the optional API key and record the exact enum-only false positive, not suppress the entire credential signal.

The Catalog's `external-only` policy is inconsistent with the source: this package does not modify DSH or `@deepseek-ai/*`, claim a protected namespace, or shadow/disable official rows. The policy lane should be `user-reviewed` after a reviewer binds the exact published source and its actual capabilities. Do not change Skill wording to evade review; preserve the known permission, complete a fixed-Commit admission review, and correct the Catalog from the Store side.

## Remaining acceptance gates

1. Run the official CLI latest-three matrix on Linux and Windows in CI; the local macOS pass does not prove cross-platform behavior.
2. Create and publish an immutable `0.6.2` source Commit before Catalog can bind to it.
3. In a separate DSH STORE policy worktree, bind a fresh review to that Commit; correct the false-positive source classification and `external-only` status only after the exact review passes; update the author-resolution record and Catalog through a CI-checked PR.
4. Verify the merged Catalog and public marketplace readback separately. No real DSH Profile or Desktop UI acceptance is claimed here.
