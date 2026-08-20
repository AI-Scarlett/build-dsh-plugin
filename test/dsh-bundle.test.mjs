import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('repository root is a lifecycle-free DSH Skill adapter', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(pkg.name, 'dsh-build-plugin')
  assert.equal(pkg.version, '0.1.0')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(pkg.peerDependencies['@deepseek-ai/dsh-skill-filesystem'], '>=0.1.0-rc.8 <0.2.0')
  for (const name of ['preinstall', 'install', 'postinstall', 'prepare']) {
    assert.equal(pkg.scripts[name], undefined)
  }
})

test('bundle mounts only the repository Skill root and preserves official providers', async () => {
  const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8')
  assert.match(patch, /id:\s*dsh-build-plugin-skill-provider/)
  assert.match(patch, /name:\s*'@deepseek-ai\/dsh-skill-filesystem'/)
  assert.match(patch, /providerName:\s*build-dsh-plugin/)
  assert.match(patch, /includeDefaultRoots:\s*false/)
  assert.match(patch, /createRequire\(baseUrl\)/)
  assert.match(patch, /resolve\('dsh-build-plugin\/package\.json'\)/)
  assert.match(patch, /watch:\s*false/)
  assert.doesNotMatch(patch, /disabled:\s*true/)
  assert.doesNotMatch(patch, /(?:remove|patch):/)
})

test('mounted Skill declares DSH and card-contract workflows', async () => {
  const skill = await readFile(new URL('build-dsh-plugin/SKILL.md', root), 'utf8')
  const cards = await readFile(new URL('build-dsh-plugin/references/card-contract.md', root), 'utf8')
  assert.match(skill, /^---\nname: build-dsh-plugin\n/)
  assert.match(skill, /card-contract\.md/)
  assert.match(cards, /presentCall/)
  assert.match(cards, /presentResult/)
  assert.match(cards, /presentationMeta/)
  assert.match(cards, /live and replay/i)
  assert.match(cards, /generic.*terminal.*diff/s)
  assert.match(cards, /search.*read.*web/s)
  assert.match(skill, /rc\.8|rc8/i)
})
