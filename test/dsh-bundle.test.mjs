import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('repository root is a lifecycle-free DSH Skill adapter', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(pkg.name, 'dsh-build-plugin')
  assert.equal(pkg.version, '0.3.0')
  assert.equal(pkg.main, './src/index.mjs')
  assert.ok(pkg.files.includes('src'))
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(pkg.dependencies, undefined)
  assert.equal(pkg.peerDependencies, undefined)
  for (const name of ['preinstall', 'install', 'postinstall', 'prepare']) {
    assert.equal(pkg.scripts[name], undefined)
  }
})

test('bundle inserts only its own Host adapter', async () => {
  const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8')
  assert.match(patch, /id:\s*dsh-build-plugin-skill-provider/)
  assert.match(patch, /name:\s*dsh-build-plugin/)
  assert.doesNotMatch(patch, /name:\s*['"]?@deepseek-ai\//)
  assert.doesNotMatch(patch, /disabled:\s*true/)
  assert.doesNotMatch(patch, /(?:remove|patch):/)
})

test('Host adapter registers the packaged Skill through the public rc.8 and rc.1 service seam', async () => {
  const source = await readFile(new URL('src/index.mjs', root), 'utf8')
  assert.match(source, /export const name = 'dsh-build-plugin'/)
  assert.match(source, /export const inject = \['skills'\]/)
  assert.match(source, /ctx\.skills\.register\(skill\)/)
  assert.match(source, /source: 'bundled'/)
  assert.match(source, /provider: 'build-dsh-plugin'/)
  assert.match(source, /resourceBase: Object\.freeze\(\{ kind: 'directory', path: skillDirectory \}\)/)
  assert.match(source, /content: frontmatter\[2\]\.trim\(\)/)
  assert.doesNotMatch(source, /@deepseek-ai\//)
  assert.doesNotMatch(source, /(?:writeFile|appendFile|rename|unlink|rm|copyFile)\s*\(/)
})

test('mounted Skill declares DSH and card-contract workflows', async () => {
  const skill = await readFile(new URL('build-dsh-plugin/SKILL.md', root), 'utf8')
  const cards = await readFile(new URL('build-dsh-plugin/references/card-contract.md', root), 'utf8')
  const catalog = JSON.parse(await readFile(new URL('build-dsh-plugin/assets/catalog-entry.template.json', root), 'utf8'))
  const candidate = JSON.parse(await readFile(new URL('build-dsh-plugin/assets/candidate-entry.template.json', root), 'utf8'))
  assert.match(skill, /^---\nname: build-dsh-plugin\n/)
  assert.match(skill, /card-contract\.md/)
  assert.match(cards, /presentCall/)
  assert.match(cards, /presentResult/)
  assert.match(cards, /presentationMeta/)
  assert.match(cards, /live and replay/i)
  assert.match(cards, /generic.*terminal.*diff/s)
  assert.match(cards, /search.*read.*web/s)
  assert.match(skill, /0\.1\.1-rc\.1/)
  assert.match(skill, /registry\/candidates\.json/)
  assert.deepEqual(Object.keys(catalog.assurance), ['discovery', 'installability', 'runtime', 'securityReview'])
  assert.deepEqual(Object.keys(catalog.compatibility.dshOperations), ['rc.5', 'rc.6', 'rc.7', 'rc.8', '0.1.1-rc.1'])
  for (const release of Object.values(catalog.compatibility.dshOperations)) {
    assert.deepEqual(Object.keys(release), ['install', 'start', 'uninstall', 'rollback'])
  }
  for (const forbidden of ['packageName', 'manifestPath', 'entryIds', 'compatibility', 'installable', 'allowedActions']) {
    assert.equal(Object.hasOwn(candidate, forbidden), false)
  }
})
