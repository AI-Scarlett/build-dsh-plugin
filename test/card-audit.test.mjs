import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const repoRoot = new URL('../', import.meta.url)
const audit = fileURLToPath(new URL('build-dsh-plugin/scripts/audit-plugin.mjs', repoRoot))

async function fixture(root, source, tests) {
  await mkdir(join(root, 'test'), { recursive: true })
  await writeFile(join(root, 'package.json'), JSON.stringify({
    name: 'dsh-card-fixture',
    version: '0.1.0',
    type: 'module',
    main: 'index.mjs',
    files: ['index.mjs', 'cordis.patch.yml'],
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    scripts: { test: 'node --test' },
    repository: 'https://github.com/example/dsh-card-fixture',
    license: 'MIT',
  }))
  await writeFile(join(root, 'cordis.patch.yml'), '- insert:\n    - id: dsh-card-fixture\n      name: dsh-card-fixture\n')
  await writeFile(join(root, 'index.mjs'), source)
  await writeFile(join(root, 'test', 'card.test.mjs'), tests)
  await writeFile(join(root, 'README.md'), 'Verified and unverified states remain distinct. Security boundaries and the next verification gate are documented. Source anchor: 0123456789abcdef0123456789abcdef01234567.\n')
}

function run(root) {
  const result = spawnSync(process.execPath, [audit, root, '--json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('audit accepts a bounded replay-tested provider-neutral card contract', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-card-valid-'))
  try {
    await fixture(root, `
export const tool = {
  output: { presentationMeta: (_args, value) => ({ total: value.total, truncated: value.truncated }) },
  presentCall: args => ({ card: 'generic', title: String(args.query), kind: 'search' }),
  presentResult: (_args, result) => result.isError ? undefined : ({ card: 'search', shape: 'paths', paths: [], total: result.meta.total, truncated: result.meta.truncated }),
}
`, `
// presentCall and presentResult are deterministic across live and replay.
// Malformed metadata returns undefined generic fallback; JSON serialization,
// byte limit, truncation, fail closed, and secret redaction cases are covered.
`)
    const report = run(root)
    assert.equal(report.cardContract.detected, true)
    assert.equal(report.cardContract.testCoverage, true)
    assert.deepEqual(report.cardContract.discriminants, ['generic', 'search'])
    assert.equal(report.blockers.some(item => item.includes('card')), false)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('audit blocks an unsupported card without replay and fallback tests', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-card-invalid-'))
  try {
    await fixture(root, `
export const tool = {
  presentCall: args => ({ card: 'chart', title: String(args.query) }),
  presentResult: () => ({ card: 'chart' }),
}
`, '// fail closed safety test only\n')
    const report = run(root)
    assert.equal(report.status, 'BLOCKED')
    assert.ok(report.blockers.some(item => item.includes('unsupported DSH Tool card')))
    assert.ok(report.blockers.some(item => item.includes('replay/fallback/bounds')))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
