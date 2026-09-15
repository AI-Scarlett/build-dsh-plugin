import assert from 'node:assert/strict'
import test from 'node:test'
import { auditLifecycle } from '../build-dsh-plugin/scripts/audit-lifecycle.mjs'
test('ordinary read-only plugins do not inherit manager requirements', () => {
  assert.equal(auditLifecycle({ hasWebRegistration: true }).status, 'not-applicable')
})
test('management without authentication and recovery evidence is blocked', () => {
  const result = auditLifecycle({ profileMutation: true, hasWebRegistration: true, code: 'assertSameOrigin(req)' })
  assert.equal(result.status, 'BLOCKED'); assert.equal(result.blockers.length, 4)
})
test('markers never grant runtime compatibility', () => {
  const result = auditLifecycle({ profileMutation: true, hasWebRegistration: true, code: "connection.requestRejection(req); journal('recovery-required')", tests: "401 403 rolled-back recovery-required" })
  assert.equal(result.status, 'source-review-required'); assert.equal(result.runtime, 'unknown')
})
