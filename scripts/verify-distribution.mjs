import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const read = path => readFile(resolve(root, path))

async function countFiles(directory) {
  let count = 0
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = resolve(directory, entry.name)
    if (entry.isDirectory()) count += await countFiles(target)
    else if (entry.isFile()) count += 1
  }
  return count
}

function requireText(text, expected, owner) {
  if (!text.includes(expected)) throw new Error(`${owner} is missing ${expected}`)
}

const manifest = JSON.parse(await read('dist/manifest.json'))
const artifactPath = resolve(root, 'dist', manifest.artifact.file)
const artifact = await readFile(artifactPath)
const artifactSha = createHash('sha256').update(artifact).digest('hex')
const artifactStat = await stat(artifactPath)
const shaFile = (await read(`dist/${manifest.artifact.sha256File}`)).toString('utf8').trim()
const expectedShaLine = `${manifest.artifact.sha256}  ${manifest.artifact.file}`
const rootLicense = await read('LICENSE')
const skillLicense = await read(manifest.license.file)
const sourceFileCount = await countFiles(resolve(root, 'build-dsh-plugin'))
const archivedFiles = execFileSync('unzip', ['-Z1', artifactPath], { encoding: 'utf8' })
  .split('\n')
  .filter(entry => entry && !entry.endsWith('/'))
const readme = (await read('README.md')).toString('utf8')
const install = (await read('dist/INSTALL.md')).toString('utf8')

if (artifactSha !== manifest.artifact.sha256) throw new Error('manifest SHA-256 does not match ZIP')
if (artifactStat.size !== manifest.artifact.bytes) throw new Error('manifest byte size does not match ZIP')
if (shaFile !== expectedShaLine) throw new Error('SHA file does not match manifest and artifact name')
if (!rootLicense.equals(skillLicense)) throw new Error('repository and distributed licenses differ')
if (manifest.license.spdxId !== 'MIT') throw new Error('distribution license must be MIT')
if (sourceFileCount !== manifest.artifact.regularFileCount) throw new Error('source file count does not match manifest')
if (archivedFiles.length !== manifest.artifact.regularFileCount) throw new Error('ZIP file count does not match manifest')
if (!archivedFiles.includes(manifest.license.file)) throw new Error('ZIP does not contain the declared license')
if (!manifest.release.tag || !manifest.artifact.downloadUrl.includes(`/${manifest.release.tag}/`)) {
  throw new Error('artifact download URL is not bound to the declared release tag')
}

for (const [owner, text] of [['README', readme], ['INSTALL', install]]) {
  requireText(text, manifest.distributionVersion, owner)
  requireText(text, manifest.artifact.sha256, owner)
  requireText(text, manifest.release.tag, owner)
  requireText(text, 'MIT', owner)
}

console.log(`DISTRIBUTION_OK ${manifest.distributionVersion} ${artifactSha} ${archivedFiles.length} MIT`)
