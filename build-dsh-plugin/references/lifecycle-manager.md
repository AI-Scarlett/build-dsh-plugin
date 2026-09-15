# Lifecycle manager contract (Store 0.9)

Read this for management HTTP routes, Profile lifecycle operations, or external discovery integrations. Do not impose R3 requirements on ordinary read-only tools.

## Authentication

The DSH `webServer.register` exact route bypasses Connection's `/api` prefix. Before parsing a body or loading Profile state, delegate to the inspected public `connection.requestRejection(req)`. Only `undefined` permits dispatch; 401/403 reject and a missing/throwing/unknown authority returns 503. Inject `webServer` and `connection` together. A Host/Origin/intent header is not authentication. Never fall back to a local-looking Host, forwarded IP, query token or unsigned cookie. Test every registered route, including diagnostics and progress, without login and with a forged Origin.

A Guardian must use the official launch-token exchange from the child it owns. Accept the official 302/303 redirect, keep the returned cookie in memory only, validate the exact loopback host and port before exchange, and never publish the launch URL/cookie. Old Guardian migration must precede installing a manager that authenticates runtime probes. Authentication failure is not evidence that a foreign process should be killed.

## Operations and recovery

Every mutation consumes a fresh typed plan with immutable repository, Commit, manifestPath and installPath; file preconditions; fixed official CLI argv; backup; health and rollback. Reserve a durable bounded operation ID before dispatch. Journal only declared non-secret fields. Poll status via GET. Never retry mutation POST on timeout, page refresh, or restart.

Use queued, running, succeeded, failed, rolled-back, recovery-required. Only verified Profile AND dependency restoration permits rolled-back. A changed precondition before mutation is failed. Windows locks or uncertain interruption require recovery and prohibit automatic restart. A new process may display an interrupted journal but must not execute it. Use atomic mode-0600 files, corruption rejection, capacity limits, and protection against competing operations.

## Activation and diagnostics

Distinguish installed package, configured Bundle and running Loader rows. Read public Loader entry state only; never mutate Loader/Fiber. Pin the inspected enum contract. Return unknown on missing/ambiguous entries or unknown state. Bind live/restart evidence to package identity and current Boot ID. A changed version/specifier requires restart evidence; missing files, failed rows, no Bundle and explicit managed disable produce missing, broken, inert and disabled.

pnpm 10/11/12 and Windows locking differ. Capture bounded error codes and controlled explanations; arbitrary stderr can contain credentials or full user content. Never silently disable release-age protections, rebuild a whole Profile, change pnpm globally, or fall back to another install source. Package identity includes canonical GitHub repository, full Commit AND normalized monorepo subpath; npm name alone is insufficient.

## Discovery and release

External directories are untrusted discovery inputs. Read a bounded fixed-Commit snapshot without running their code. Store source URL, Commit, content SHA-256, observed time and verified owner user ID. First import creates non-installable Candidates. A later Catalog policy review must independently inspect complete runtime, manifest, license, Patch, entries, dependencies and permissions. Never inherit install URLs or approval claims. All author contact remains behind Store's central immutable-person reservation ledger; discovery is not permission to send messages.

Resolve official releases from GitHub and npm. Preserve missing/unpublished/deprecated/contradictory evidence as unknown or blocked. A range declaration is not an E3 runtime result. Run disposable install, dump-config, boot, authenticated/unauthenticated smoke and uninstall on each advertised host version. Record unsupported matrix cells truthfully. Screenshots require a catalog-declared fixed source and SHA-256; do not embed arbitrary README images or remote scripts.

## Tradeoffs and evidence

Official authentication avoids a second credential implementation but delays routes until Connection loads. Journals enable progress recovery but introduce persistent state requiring fault tests. Candidate-only feeds broaden discovery but do not promise immediate listing. Reconsider those choices only when official public APIs or the Store policy change, and regenerate the evidence before publishing.
