# DSH Desktop guidance and latest-three refresh

## Objective

Update build-dsh-plugin to current official DSH releases and give users version-specific guidance for plugins that target the official DSH Desktop application.

## Changes

- Sync the Agent Skill and references from the current local Skill, including the official Desktop host contract.
- Add Desktop guidance to the ZIP entrypoint and tests.
- Prepare v0.6.0 package metadata, docs, and fixed ZIP/SHA/manifest.
- Record the latest-three compatibility only after the exact version and platform matrix passed.

## Current official window

- Latest three: 0.2.1-rc.4, 0.2.1-rc.5, 0.2.2-alpha.2.
- macOS and Windows Desktop feeds: 0.2.1-rc.5.
- The exact versions were independently resolved again in CI and matched this plan.

## Desktop rules added

- Treat Web and official Desktop as separate hosts and Profile targets.
- Use documented Host services and slots; declare Client module dependencies in the static inject list.
- Use only the version-reviewed official Desktop plugin-manager API.
- Require Desktop-specific install/runtime evidence before declaring Desktop catalog support.
- Keep real Desktop UI/Profile acceptance separate from CLI matrix results.

## Evidence state

- Local npm run check: passed (25 tests, Skill self-tests, ZIP/manifest/checksum verification).
- npm pack --dry-run: passed.
- Latest-three × Linux/macOS/Windows disposable Profile matrix: passed in [GitHub Actions run 41040198423](https://github.com/AI-Scarlett/build-dsh-plugin/actions/runs/41040198423), including install, cold start, authenticated Host response, uninstall, and exact restoration of the baseline Profile composition.
- The final metadata-promoted pull-request head must pass the same live-resolved matrix before merge.
- Real DSH Desktop Profile/UI: unchanged and unverified by this source change.
- Public GitHub Release and website: pending separate fixed-release plan and public readback.

## Recovery

Revert only the reviewed source PR through a new CI-checked PR. Preserve all existing releases and tags.
