#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const skillRoot = resolve(scriptDir, '..')
const normalizer = join(scriptDir, 'normalize-brief.mjs')

function run(path) {
  const result = spawnSync(process.execPath, [normalizer, path, '--json'], {
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
  })
  assert.equal(result.stderr, '')
  return { status: result.status, body: JSON.parse(result.stdout) }
}

const readonly = run(join(skillRoot, 'assets', 'plugin-brief.readonly-example.json'))
assert.equal(readonly.status, 0)
assert.equal(readonly.body.analysis.status, 'READY')
assert.equal(readonly.body.analysis.riskClass, 'R0')
assert.ok(readonly.body.analysis.architectureCandidates.includes('host-client'))
assert.equal(readonly.body.analysis.realOperationBlocked, false)

const lifecycle = run(join(skillRoot, 'assets', 'plugin-brief.r3-example.json'))
assert.equal(lifecycle.status, 0)
assert.equal(lifecycle.body.analysis.status, 'READY')
assert.equal(lifecycle.body.analysis.riskClass, 'R3')
assert.ok(lifecycle.body.analysis.architectureCandidates.includes('lifecycle-manager'))
assert.equal(lifecycle.body.analysis.realOperationBlocked, true)
assert.ok(lifecycle.body.analysis.realOperationBlockers.some(item => item.includes('target Profile')))

const tempRoot = await mkdtemp(join(tmpdir(), 'dsh-brief-test-'))
try {
  const minimalPath = join(tempRoot, 'minimal.json')
  await writeFile(minimalPath, JSON.stringify({
    problem: 'Users cannot see which tasks failed.',
    outcome: {
      expectedResult: 'Show a read-only failure summary.',
      acceptanceCriteria: ['Failure fixtures are classified correctly.'],
    },
  }))
  const minimal = run(minimalPath)
  assert.equal(minimal.status, 0)
  assert.equal(minimal.body.analysis.status, 'READY_WITH_ASSUMPTIONS')
  assert.equal(minimal.body.analysis.generationReady, true)
  assert.equal(minimal.body.analysis.riskClass, 'R0')
  assert.ok(minimal.body.analysis.assumptions.length >= 5)

  const incompletePath = join(tempRoot, 'incomplete.json')
  await writeFile(incompletePath, JSON.stringify({
    problem: 'Users cannot see which tasks failed.',
    outcome: { acceptanceCriteria: [] },
  }))
  const incomplete = run(incompletePath)
  assert.equal(incomplete.status, 1)
  assert.equal(incomplete.body.analysis.status, 'NEEDS_INPUT')
  assert.equal(incomplete.body.analysis.generationReady, false)
  assert.ok(incomplete.body.analysis.generationBlockers.length >= 2)

  const secretPath = join(tempRoot, 'secret.json')
  await writeFile(secretPath, JSON.stringify({
    problem: 'Users cannot inspect a service.',
    outcome: {
      expectedResult: 'Show a read-only service summary.',
      acceptanceCriteria: ['The summary renders in a disposable Profile.'],
    },
    ['to' + 'ken']: 'must-not-be-echoed',
  }))
  const secret = run(secretPath)
  assert.equal(secret.status, 1)
  assert.equal(secret.body.analysis.generationReady, false)
  assert.ok(secret.body.analysis.schemaErrors.some(item => item.includes('secret-like fields')))
  assert.equal(JSON.stringify(secret.body).includes('must-not-be-echoed'), false)
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}

process.stdout.write('BRIEF_TEST_OK\n')
