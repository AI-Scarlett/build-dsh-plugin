import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { resolveDshUpgradeMatrix } from '../scripts/resolve-dsh-upgrade-matrix.mjs'

const root = new URL('../', import.meta.url)

test('repository root is a lifecycle-free DSH Skill adapter', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(pkg.name, 'dsh-build-plugin')
  assert.equal(pkg.version, '0.5.0')
  assert.equal(pkg.main, './src/index.mjs')
  assert.ok(pkg.files.includes('src'))
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(pkg.dsh.compatibility.dsh, '>=0.1.0-rc.8 <0.2.0 || 0.1.5-alpha.1 || 0.1.5-alpha.2 || 0.1.5-rc.1 || 0.1.5-rc.2')
  for (const release of ['0.1.2-alpha.5', '0.1.2-rc.1', '0.1.3-alpha.1', '0.1.5-alpha.1', '0.1.5-alpha.2']) {
    assert.equal(pkg.dsh.compatibility.dshReleases[release], 'compatible')
  }
  assert.equal(pkg.dependencies, undefined)
  assert.equal(pkg.peerDependencies, undefined)
  for (const name of ['preinstall', 'install', 'postinstall', 'prepare']) {
    assert.equal(pkg.scripts[name], undefined)
  }
})

test('CI compatibility matrix consumes the ordered official latest-three resolver', async () => {
  const result = await resolveDshUpgradeMatrix(async options => {
    assert.equal(options.releaseCount, 3)
    return {
      authority: 'official-github-releases-and-npm-published-versions',
      releaseCount: 3,
      latestVersion: '0.1.7-rc.1',
      releases: ['0.1.7-alpha.1', '0.1.7-alpha.2', '0.1.7-rc.1'],
    }
  })
  assert.deepEqual(result, {
    latestVersion: '0.1.7-rc.1',
    releases: ['0.1.7-alpha.1', '0.1.7-alpha.2', '0.1.7-rc.1'],
  })
  const workflow = await readFile(new URL('.github/workflows/verify-distribution.yml', root), 'utf8')
  assert.match(workflow, /fromJSON\(needs\.resolve-dsh-window\.outputs\.releases\)/)
  assert.match(workflow, /scripts\/test-disposable-dsh-bundle\.mjs/)
  assert.doesNotMatch(workflow, /test-disposable-dsh-bundle\.mjs[^\n]*\$PWD/)
  assert.doesNotMatch(workflow, /@deepseek-ai\/dsh@0\.1\.5-rc\.2/)
})

test('latest-three resolver fails closed when the official window is incomplete', async () => {
  await assert.rejects(resolveDshUpgradeMatrix(async () => ({
    authority: 'official-github-releases-and-npm-published-versions',
    releaseCount: 3,
    latestVersion: '0.1.7-rc.1',
    releases: ['0.1.7-alpha.1', '0.1.7-rc.1'],
  })), /complete ordered latest-three window/)
})

test('disposable DSH bundle test scopes Profile and CLI operations to its temporary home', async () => {
  const source = await readFile(new URL('scripts/test-disposable-dsh-bundle.mjs', root), 'utf8')
  assert.match(source, /DSH_HOME:\s*resolve\(root, 'home'\)/)
  assert.match(source, /execFileAsync\(process\.execPath, \[cli, \.\.\.args\]/)
  assert.match(source, /plugin', '--profile', 'web', 'add'/)
  assert.match(source, /plugin', '--profile', 'web', 'remove'/)
  assert.doesNotMatch(source, /shell:\s*true/)
  assert.match(source, /await rm\(root, \{ recursive: true, force: true \}\)/)
})

test('bundle inserts only its own Host adapter', async () => {
  const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8')
  assert.match(patch, /id:\s*dsh-build-plugin-skill-provider/)
  assert.match(patch, /name:\s*dsh-build-plugin/)
  assert.doesNotMatch(patch, /name:\s*['"]?@deepseek-ai\//)
  assert.doesNotMatch(patch, /disabled:\s*true/)
  assert.doesNotMatch(patch, /(?:remove|patch):/)
})

test('Host adapter registers the packaged Skill through the public alpha.4, alpha.5, and rc.1 service seam', async () => {
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

test('Host adapter emits the rc.1 SkillRegistration shape without private imports', async () => {
  const module = await import(new URL('../src/index.mjs?rc1-contract', import.meta.url))
  const registrations = []
  module.apply({ skills: { register: value => { registrations.push(value); return () => {} } } })
  assert.equal(registrations.length, 1)
  const registration = registrations[0]
  assert.deepEqual(Object.keys(registration).sort(), ['content', 'description', 'name', 'path', 'provider', 'resourceBase', 'source'])
  assert.equal(registration.name, 'build-dsh-plugin')
  assert.equal(registration.provider, 'build-dsh-plugin')
  assert.equal(registration.source, 'bundled')
  assert.equal(registration.resourceBase.kind, 'directory')
  assert.equal(registration.resourceBase.path.endsWith('/build-dsh-plugin'), true)
  assert.equal(registration.path.endsWith('/build-dsh-plugin/SKILL.md'), true)
  assert.ok(registration.content.includes('DSH'))
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
  assert.match(skill, /official-dsh-releases\.mjs/)
  assert.match(skill, /0\.1\.2-rc\.1/)
  assert.match(skill, /registry\/candidates\.json/)
  assert.deepEqual(Object.keys(catalog.assurance), ['discovery', 'installability', 'runtime', 'securityReview'])
  assert.deepEqual(Object.keys(catalog.compatibility.dshOperations), ['0.1.3-alpha.2', '0.1.5-alpha.1', '0.1.5-alpha.2'])
  for (const release of Object.values(catalog.compatibility.dshOperations)) {
    assert.deepEqual(Object.keys(release), ['install', 'start', 'uninstall', 'rollback'])
  }
  for (const forbidden of ['packageName', 'manifestPath', 'entryIds', 'compatibility', 'installable', 'allowedActions']) {
    assert.equal(Object.hasOwn(candidate, forbidden), false)
  }
})
