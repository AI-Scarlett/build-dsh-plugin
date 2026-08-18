# DSH plugin templates

## Contents

1. Host-contract record
2. Implementation plan
3. Mutation plan
4. Verification report
5. Release checklist
6. Decision record
7. Stage-gate report
8. Permission matrix
9. Public distribution report
10. DSH STORE listing report

## 1. Host-contract record

```markdown
# Host contract

- Requested outcome:
- Target host:
- DSH version/commit inspected:
- Standard bundle possible: yes/no/unknown
- Public Host services/API seams:
- Browser Client needed: yes/no
- External runtime/device/network:
- State mutations:
- Risk class: R0/R1/R2/R3
- Prohibited surfaces:
- Acceptance surface:
- Host-fit conclusion: compatible/adapter-required/incompatible
```

Stop on `incompatible` or `unknown` before installation.

## 2. Implementation plan

```markdown
# DSH plugin implementation plan

## Outcome

## Bundle structure

## Host services and entry IDs

## Client slots/routes

## Data and permission boundary

## Failure behavior

## Test matrix

## Packaging/build contract

## Evidence target

## Non-goals
```

## 3. Mutation plan

```json
{
  "planId": "single-use-id",
  "operation": "install|update|enable|disable|remove|restart|migrate",
  "profile": "web",
  "source": {
    "package": "dsh-example-plugin",
    "version": "0.1.0",
    "commit": "40-char-sha"
  },
  "scope": [
    {"path": "profile/package.json", "sha256Before": "..."},
    {"path": "profile/cordis.patch.yml", "sha256Before": "..."}
  ],
  "command": {
    "file": "dsh-or-node-path",
    "args": ["plugin", "--profile", "web", "add", "github:owner/repo#sha"],
    "cwd": "exact-directory",
    "shell": false
  },
  "backup": "exact-backup-directory",
  "healthChecks": ["dump-config", "process/port", "official inventory/API", "visible UI"],
  "rollback": ["restore exact files", "restore dependencies", "recheck config/runtime"],
  "confirmation": "exact one-time phrase",
  "expiresAt": "ISO-8601",
  "used": false
}
```

Never execute a plan after any hash, source, target, phrase, expiry, or used state changes.

## 4. Verification report

```markdown
# Verification report

- Risk class:
- Hard blockers: none/list
- Static score: /80
- Runtime evidence: /20
- Total: /100

| Surface | State | Evidence level | Evidence |
| --- | --- | --- | --- |
| Host contract | verified/partial/blocked/unverified | E0-E5 | |
| Unit/contract tests | | | |
| Disposable Profile | | | |
| Real Profile install | | | |
| Runtime API/process | | | |
| Browser UI | | | |
| External account/device/public | | | |
| Rollback/recovery | | | |

- Exact source identity:
- Changed files:
- Profile changes:
- Remaining gate:
```

## 5. Release checklist

```markdown
- [ ] package version updated
- [ ] README version and install command updated
- [ ] catalog entry version/source updated
- [ ] install target pinned to full commit
- [ ] version consistency tests updated
- [ ] lifecycle/build scripts disclosed
- [ ] unit/contract/fault tests passed
- [ ] disposable official-CLI install passed
- [ ] dump-config and isolated startup passed
- [ ] pack dry-run contains required runtime files
- [ ] secrets/private paths scan clean
- [ ] remote commit/checks/public assets read back
- [ ] public artifact manifest, ZIP, SHA sidecar, file count, byte size, and embedded license agree
- [ ] direct-download page reads the manifest from the resolved fixed Release tag and fails closed on mismatch
- [ ] source link and license label remain visible; public ZIP hash was recomputed without authentication
- [ ] local Profile deliberately left unchanged or separately confirmed
- [ ] verification report distinguishes repository, Profile, UI, device, and rollback states
```

## 6. Decision record

Use one record for each consequential architecture, permission, mutation, release, or acceptance choice.

```markdown
# Decision: <short name>

- Objective:
- Why this is necessary in the inspected DSH/project:
- Chosen option:
- Benefits:
- Costs and disadvantages:
- Applies when:
- Does not apply when:
- Alternatives considered:
- Why alternatives were rejected:
- Procedure and owner:
- Required artifact/output:
- Evidence to pass:
- Stop/rollback condition:
- Reconsider when:
```

## 7. Stage-gate report

```markdown
# Phase <n>: <name>

- Objective:
- Rationale:
- Inputs:
- Actions performed:
- Benefits gained:
- Costs/limitations introduced:
- Output artifact:
- Evidence:
- Result: PASS/PARTIAL/BLOCKED
- Missing evidence:
- Allowed next action:
- Stop condition:
- Owner:
```

## 8. Permission matrix

```markdown
| Action/data | User outcome | Owner side | Allowed caller | Sensitive fields/redaction | Limits | Failure behavior | Test | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | Host/Client/bridge | | | size/rate/time | fail closed | | keep/remove/defer |
```

Remove any row that has no user outcome, bounded caller, failure behavior, and test.

## 9. Public distribution report

```markdown
# Public distribution report

- Artifact type: dsh-bundle/agent-skill/adapter/source
- Repository and owner authority:
- Release tag and commit:
- Manifest URL at fixed tag:
- ZIP URL:
- SHA-256 sidecar URL:
- Recomputed public SHA-256:
- Bytes / regular file count:
- License / copyright holder:
- License embedded in archive: yes/no
- Source link retained: yes/no
- README / INSTALL / manifest / SHA consistency: PASS/PARTIAL/BLOCKED
- Website dynamic metadata contract: PASS/PARTIAL/BLOCKED/not applicable
- Public visible readback: E5 evidence/not deployed
- DSH Profile state: unchanged/unverified/separately accepted
- Remaining gate:
```

## 10. DSH STORE listing report

```markdown
# DSH STORE listing report

- Requested outcome: assess/approved/blocked/unlisted
- Current Registry contract observed at:
- Route: direct/monorepo/adapter-required/blocked
- Public GitHub repository:
- Repository/change authority: verified/unverified/not required for read-only assessment
- Package / version / license:
- Manifest path / install path:
- Immutable Commit:
- Bundle Patch / entry IDs:
- Lifecycle scripts:
- Catalog ID / categories / intended status:
- Permissions / external dependencies / compatibility evidence:
- General plugin audit: PASS/PARTIAL/BLOCKED
- Marketplace preflight: READY_FOR_CATALOG_ENTRY/READY_FOR_PINNED_SOURCE_VERIFICATION/NEEDS_STANDARDIZATION/BLOCKED
- Fixed-Commit manifest/Patch readback: PASS/PARTIAL/BLOCKED/not run
- STORE validate:registry: PASS/PARTIAL/BLOCKED/not run
- STORE verify:registry-sources: PASS/PARTIAL/BLOCKED/not run
- Registry PR/CI: URL and state/not submitted
- Merged GitHub catalog readback: E5 evidence/not merged
- Public marketplace readback: visible/blocked/unlisted/not verified
- DSH Profile state: unchanged/unverified/separately accepted
- Smallest remediation / remaining gate:
```

Do not collapse catalog-candidate, pinned-source, CI, merged-catalog, public-page, and Profile states into one `published` or `verified` label.
