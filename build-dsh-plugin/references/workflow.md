# Reusable DSH plugin workflow

## Contents

1. Operating model
2. Phase 0 - outcome brief
3. Phase 1 - host contract
4. Phase 2 - risk and trust boundaries
5. Phase 3 - architecture decision
6. Phase 4 - interface and permission design
7. Phase 5 - implementation
8. Phase 6 - automated verification
9. Phase 7 - disposable runtime acceptance
10. Phase 8 - repository release
11. Phase 9 - real Profile acceptance
12. Phase 10 - external/device/public acceptance
13. Phase 11 - handoff and retrospective
14. Reusable metrics

## 1. Operating model

Run phases in order. Each phase creates one durable artifact and ends in a gate. A gate can be `PASS`, `PARTIAL`, or `BLOCKED`; only `PASS` advances automatically. `PARTIAL` must name the missing evidence and allowed next action. `BLOCKED` stops mutation/release.

Each phase report must state objective, rationale, benefits, costs, inputs, actions, output, evidence, stop condition, and owner. This prevents a checklist from hiding why the work exists.

## 2. Phase 0 - outcome brief

- **Objective**: turn a feature request into a testable user outcome.
- **Why**: implementation otherwise optimizes visible features rather than the requested result.
- **Benefits**: stable scope and measurable completion.
- **Costs**: exposes ambiguity and may require deferring attractive extras.
- **Inputs**: user request, current project state, constraints.
- **Actions**: write target user, job, trigger, expected result, non-goals, prohibited surfaces, acceptance surface, and authorization boundary.
- **Output**: one-page outcome brief.
- **Gate**: every requested outcome has at least one observable acceptance signal.
- **Stop**: conflicting outcomes or an unknown owner for affected state.

## 3. Phase 1 - host contract

- **Objective**: prove the work belongs in DSH and identify its supported extension seam.
- **Why**: similar features do not imply compatible hosts.
- **Benefits**: avoids wrong-host installs and reveals adapter options.
- **Costs**: reconnaissance time; may yield no implementation.
- **Inputs**: target repository/package, inspected DSH version/docs, one current standard example.
- **Actions**: inspect manifest/patch/entries, original host, public services, Client slots, external dependencies, and required mutations; compare standard Bundle, adapter, and native-host alternatives.
- **Output**: host-contract record plus architecture alternatives.
- **Gate**: `compatible` or explicitly approved `adapter-required`.
- **Stop**: `incompatible`, unknown contract, or required core modification.

## 4. Phase 2 - risk and trust boundaries

- **Objective**: choose controls and evidence proportional to harm.
- **Why**: permissions, remote control, credentials, and Profile writes have different failure impacts.
- **Benefits**: prevents under-control and needless process.
- **Costs**: threat modeling and more tests for high-risk work.
- **Inputs**: outcome brief and host contract.
- **Actions**: identify assets, actors, trust boundaries, entry points, mutations, external systems, maximum impact, recovery owner, and `R0–R3`.
- **Output**: risk register, trust-boundary diagram or table, minimum evidence target.
- **Gate**: every write/external boundary has prevention, detection, and recovery control.
- **Stop**: unbounded impact, missing recovery owner, or acceptance below class minimum.

## 5. Phase 3 - architecture decision

- **Objective**: choose the smallest standard pattern that meets the outcome.
- **Why**: architecture fixes permission, lifecycle, UI, and release costs early.
- **Benefits**: explicit trade-offs and fewer rewrites.
- **Costs**: comparison work; smallest pattern may omit convenience features.
- **Inputs**: host contract and risk register.
- **Actions**: compare Host-only, Host+Client, optional Web, Skill adapter, ApiProxy bridge, and lifecycle manager where applicable; score capability fit, privilege, DSH coupling, failure isolation, testability, UX, and operations.
- **Output**: decision record with chosen pattern, rejected alternatives, benefits, costs, and reconsideration triggers.
- **Gate**: chosen pattern uses only supported seams and covers every required outcome.
- **Stop**: no option satisfies both outcome and hard boundaries.

## 6. Phase 4 - interface and permission design

- **Objective**: make permissions, data, errors, and state transitions explicit before code.
- **Why**: accidental broad APIs are difficult to remove after clients depend on them.
- **Benefits**: least privilege, stable contracts, straightforward negative tests.
- **Costs**: schemas and error models slow the first implementation.
- **Inputs**: architecture decision.
- **Actions**: define entry IDs, services, routes/slots, request/response schemas, ownership, redaction, sizes, timeouts, rate limits, idempotency, error states, cleanup, and forbidden actions.
- **Output**: permission matrix and interface contract.
- **Gate**: each operation maps to one user outcome and one test; unknown operations fail closed.
- **Stop**: secret/full-file projection, Client Host imports, broad unbounded proxy, or ambiguous ownership.

## 7. Phase 5 - implementation

- **Objective**: implement the approved contract with minimal divergence.
- **Why**: undocumented scope expansion invalidates risk and test decisions.
- **Benefits**: reviewable diffs and traceable behavior.
- **Costs**: additional ideas must wait for a new decision record.
- **Inputs**: approved artifacts from phases 0–4.
- **Actions**: scaffold standard Bundle; implement Host first, narrow interface second, Client/bridge last; add validation, redaction, disposal, observability, and fail-closed behavior alongside each path.
- **Output**: source, package contract, tests, and updated decision records for deviations.
- **Gate**: source implements only declared permissions and contains no hard blocker.
- **Stop**: required core/official mutation, hidden shell string, secret exposure, or unreviewed scope increase.

## 8. Phase 6 - automated verification

- **Objective**: prove deterministic logic and failure handling before running DSH.
- **Why**: runtime debugging is expensive and real Profile fault injection is unsafe.
- **Benefits**: fast regression feedback and safe concurrency/rollback testing.
- **Costs**: fixture and fault-injection maintenance.
- **Inputs**: implementation and contracts.
- **Actions**: run syntax/type/lint, unit, contract, negative, security, transaction fault, source consistency, and pack-content checks in disposable paths; run static audit.
- **Output**: test matrix and static `/80` report.
- **Gate**: no blocker, all required tests pass, and score is at least 75 for isolated acceptance; lower scores return to implementation.
- **Stop**: any test touches real `~/.dsh`, missing dependencies make results partial, or artifacts contain secrets/private paths.

## 9. Phase 7 - disposable runtime acceptance

- **Objective**: prove DSH can compose and run the package without touching real Profile state.
- **Why**: source/tests cannot prove official CLI, patch composition, lifecycle, process, API, or Client loading.
- **Benefits**: high-value integration evidence with recoverable state.
- **Costs**: environment setup and possible differences from the real Profile.
- **Inputs**: passing automated verification and package artifact/source.
- **Actions**: create temp DSH home/Profile; install through official CLI; run `--dump-config`; check entries; cold start; smoke Host/API; inspect Client UI if applicable; inject start/stop/failure cases; clean up.
- **Output**: E3 evidence bundle and runtime points.
- **Gate**: expected config, stable startup, correct API/UI, failure behavior, and cleanup all pass.
- **Stop**: duplicate IDs, composition drift, crash, leakage, incomplete cleanup, or access to real home.

## 10. Phase 8 - repository release

- **Objective**: publish an immutable, internally consistent source/artifact.
- **Why**: Git source, build lifecycle, catalog data, documentation, and version assertions can drift independently.
- **Benefits**: reproducible installs and supportable rollback.
- **Costs**: coordinated versioning, checks, public verification, and immutable anchors.
- **Inputs**: E3-ready source and approved release scope.
- **Actions**: synchronize package/README/catalog/tests; pin full commit; disclose lifecycle/allowBuilds; run repository checks, source verification, pack dry-run, secret scan; merge/publish; read back remote commit, checks, catalog, and assets.
- **Output**: repository release report with immutable identity.
- **Gate**: public/remote source and metadata match; real Profile remains explicitly unchanged.
- **Stop**: mutable source, inconsistent version, missing artifact, failed checks, or unverifiable public data.

## 11. Phase 9 - real Profile acceptance

- **Objective**: install or upgrade the intended Profile under explicit, recoverable authority.
- **Why**: repository success does not describe local dependencies, patches, process owner, or UI state.
- **Benefits**: direct E4 proof and reliable rollback.
- **Costs**: user confirmation, possible downtime, backups, and operational observation.
- **Inputs**: immutable release, current read-only Profile snapshot, fresh R3 plan.
- **Actions**: present exact plan; confirm once; lock/recheck hashes; back up; run official CLI fixed argv; verify config; restart separately if approved; observe Boot ID/heartbeat/API/inventory/UI; roll back on failure.
- **Output**: Profile transaction and E4 acceptance report.
- **Gate**: resolved version/source, stable runtime, official inventory, requested UI, and rollback readiness verified.
- **Stop**: mismatch, expiry, reuse, concurrent change, health failure, or unapproved restart.

## 12. Phase 10 - external/device/public acceptance

- **Objective**: prove the real boundary where the user experiences the feature.
- **Why**: simulator, localhost, mock account, or server API cannot prove real device/network/account/public behavior.
- **Benefits**: E5 confidence for the claimed surface.
- **Costs**: devices, accounts, network variability, publication controls, and potentially disruptive failure tests.
- **Inputs**: E4 where relevant plus external acceptance plan.
- **Actions**: test authorized real device/account/public endpoint; cover foreground/background, reconnect, network switch, tamper/replay, failure recovery, and rollback as applicable; redact evidence.
- **Output**: per-surface E5 report.
- **Gate**: every public claim has direct readback and recovery evidence.
- **Stop**: missing authorization/credentials/device, unsafe exposure, or no recovery path; mark partial rather than simulate completion.

## 13. Phase 11 - handoff and retrospective

- **Objective**: preserve reusable reasoning, not merely final code.
- **Why**: future work otherwise repeats discovery and loses the cause of constraints.
- **Benefits**: faster subsequent plugins and auditable decisions.
- **Costs**: documentation effort and the need to separate stable lessons from project-specific facts.
- **Inputs**: all phase artifacts and actual failures.
- **Actions**: produce outcome status, decision table, score/evidence matrix, exact source, changed files, Profile state, rollback state, remaining gate, problems/root causes/fixes, and reconsideration triggers.
- **Output**: verification report and reusable decision/problem records.
- **Gate**: no “done” claim exceeds evidence and original user outcome is answered first.
- **Stop**: unresolved contradiction between report, code, runtime, or public state.

## 14. Reusable metrics

Track these across projects:

| Metric | Purpose | Good direction | Limitation |
| --- | --- | --- | --- |
| Hard blocker count | Detect non-negotiable boundary failures | `0` | Does not measure quality after blockers clear |
| Static readiness `/80` | Compare engineering completeness | Higher | Pattern scanner can miss semantic flaws |
| Runtime evidence `/20` | Reward current observed proof | Higher | Evidence text must still be independently verified |
| Evidence level per capability | Prevent cross-surface overclaim | Matches claim | Not one project-wide number |
| Permission count | Detect growing attack surface | Minimum needed | Fewer is not always better if outcome breaks |
| Forbidden-action tests | Prove least privilege | All pass | Tests cover only enumerated attacks |
| Fault cases covered | Measure recoverability | All credible faults | Cannot exhaust real-world failures |
| Rollback time/result | Measure operational recovery | Short and successful | Requires safe environment to test |
| Unpinned sources | Detect supply-chain ambiguity | `0` for releases | Dev links may remain intentionally mutable |
| Status contradictions | Detect reporting drift | `0` | Requires review across artifacts |
