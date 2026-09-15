#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
export function auditLifecycle({ code = '', tests = '', profileMutation = false, hasWebRegistration = false, evidence = null } = {}) {
  const applicable = profileMutation && hasWebRegistration
  if (!applicable) return { applicable: false, status: 'not-applicable', blockers: [] }
  const checks = {
    hostAuthentication: /requestRejection\s*\(/.test(code),
    durableOperations: /journal|operation.*record/i.test(code) && /recovery-required/.test(code),
    authenticationTests: /401/.test(tests) && /403/.test(tests),
    recoveryTests: /rollback|rolled-back/.test(tests) && /recovery-required/.test(tests),
  }
  const blockers = Object.entries(checks).filter(([, pass]) => !pass).map(([key]) => `lifecycle review missing ${key}`)
  // Source markers are review leads only. Runtime proof must be supplied with
  // traceable identity; no source scan grants compatibility or installation.
  const runtime = evidence?.schemaVersion === 1 && /^[a-f0-9]{40}$/.test(evidence.commit ?? '') && Array.isArray(evidence.matrix) ? 'provided-unverified' : 'unknown'
  return { applicable: true, status: blockers.length ? 'BLOCKED' : 'source-review-required', checks, blockers, runtime, note: 'Markers require code review; they do not prove authentication coverage, durable execution or E3.' }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const input = JSON.parse(await readFile(resolve(process.argv[2]), 'utf8'))
  console.log(JSON.stringify(auditLifecycle(input), null, 2))
}
