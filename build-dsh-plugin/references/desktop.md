# Official DSH Desktop compatibility

Use this reference when a plugin must run in the official DSH Desktop application, when a Catalog entry claims Desktop support, or when a plugin integrates with Desktop's built-in plugin manager. Desktop and Web are separate host/Profile targets. A successful Web install or Web UI test does not establish Desktop support.

## Establish the current contract

- Read the current official DSH release and Client/Host API contract before implementation. Run `node scripts/official-dsh-releases.mjs` before a compatibility review; use its live latest-three release window and do not carry a previous window forward.
- Inspect public types/source for each exact DSH version being claimed. An API present in one preview release is not automatically available in another. Keep unsupported, untested, and unknown results explicit.
- Confirm which side owns each capability: DSH Host services run with the bundle; Client code renders in the application's UI. Keep Node/Host imports out of browser Client code.
- Keep the standard DSH Bundle manifest, `dsh.bundle.patch`, unique entry IDs, package files, license, and lifecycle metadata valid. Desktop is a supported DSH host target, not a separate app or an alternate package format.

## Build against public Desktop seams

- Use public Host services and documented Client slots. Do not reach into Desktop internals, private package managers, application filesystem paths, or undocumented IPC.
- Declare every Client module dependency in its static `inject` list. A later `ctx.inject()` request cannot supply a module dependency omitted from the Client declaration. For example, a Client that uses Settings slots and the official plugin-manager Remote service declares `slots`, `remote`, and `remote.pluginManager`; include only dependencies the module actually uses.
- Register optional UI through the documented slot for the target DSH release. For a Settings section, confirm that `settings.section` exists on each claimed version and keep the package's internal identity separate from its display title/localization metadata.
- Do not assume the Desktop Profile is the default Web Profile. Read installed state and the exact runtime version from the documented Desktop API when available; do not query `~/.dsh` or a Web Profile to infer Desktop state.
- If a plugin exposes its own marketplace or installation UI, use the official Desktop plugin-manager API only after inspecting the exact version's public contract. In DSH `0.2.2-alpha.2`, the reviewed contract included `listBundles`, `inspect`, `installBundle`, and `waitForInstall`; re-check before relying on these names or behavior in another release. `listBundles` provides Desktop installed state and official runtime metadata, `inspect` performs preflight, `installBundle` owns the install transaction, and `waitForInstall` reconciles an existing request. Do not retry a timed-out install request blindly.
- Gate install actions on a trusted fixed-source Catalog entry, explicit Desktop profile support, exact compatibility with the running Desktop DSH version, and a per-install user confirmation. Let DSH own package/Profile mutations; do not route Desktop operations through Web Profile endpoints, custom filesystem writes, Loader/Fiber mutation APIs, or an unreviewed CLI command.

## State Desktop support honestly

- `compatibility.profiles` may include `desktop` only after tests cover the official Desktop host. Keep `web` and `desktop` claims distinct.
- For an approved entry that declares `desktop`, the installability and runtime assurance records must each be `verified`, include `desktop` in their `profiles`, and point to the same exact DSH release in the live compatibility window. Their evidence URLs must identify the fixed-source test/review record.
- That exact DSH release must be `compatible` in `compatibility.dshReleases`; its `install`, `start`, `uninstall`, and `rollback` results in `compatibility.dshOperations` must all be `passed`. Never turn version-range matching, package load, or Web-only evidence into a Desktop compatibility result.
- The evidence report should retain a profile-by-release matrix for every release marked `compatible`, identify the Desktop app/runtime version, test the standard Bundle and Client loader, and distinguish local/disposable evidence from real Desktop UI acceptance. The current Catalog schema has a shared release matrix, so do not claim per-profile results that the linked evidence does not actually prove.
- If Desktop evidence is missing, keep the record's Desktop assurance `unknown`, omit `desktop` from `compatibility.profiles`, and leave the Desktop install path unavailable. A plugin can remain a Web-supported entry.

## Verify in separate stages

1. **Source and contract review**: inspect the exact DSH release docs/types, package manifest, Bundle Patch, Client module dependency list, permissions, and all profile-specific code paths.
2. **Disposable automated checks**: run bundle/static checks and a Desktop Client harness that models the official loader's static dependency rule. Cover Settings/slot registration where used, Catalog or feature rendering, installed state, exact-version gating, malformed/oversized input, generic fallback, user confirmation, official API calls, and failure/recovery behavior. Fixtures must not touch `~/.dsh` or a real Profile.
3. **Disposable DSH acceptance**: use the official supported DSH path and a temporary home/Profile to prove install, config composition, cold start, UI/API behavior, uninstall, and rollback for each claimed release. Desktop checks must bind to the Desktop target and exact app/runtime version rather than relabeling a Web Profile run.
4. **Real Desktop acceptance**: only after any separate Profile mutation plan and authorization, read back the installed fixed Commit, the visible Desktop UI, installed-state display, and operation outcome. Report this separately from E2/E3 and from public Catalog publication.

Keep evidence levels separate. A passing Client harness proves only the covered contract; it does not prove the packaged app loaded the UI. A visible page does not prove install, rollback, or public marketplace publication.
