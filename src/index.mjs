import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillDirectory = resolve(packageRoot, 'build-dsh-plugin')
const skillPath = resolve(skillDirectory, 'SKILL.md')
const skillSource = readFileSync(skillPath, 'utf8')
const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

if (frontmatter === null) throw new Error('build-dsh-plugin: SKILL.md must contain YAML frontmatter')

const scalar = (key) => {
  const match = frontmatter[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (match === null || match[1].trim().length === 0) {
    throw new Error(`build-dsh-plugin: SKILL.md is missing ${key}`)
  }
  return match[1].trim()
}

const skill = Object.freeze({
  name: scalar('name'),
  description: scalar('description'),
  source: 'bundled',
  provider: 'build-dsh-plugin',
  resourceBase: Object.freeze({ kind: 'directory', path: skillDirectory }),
  path: skillPath,
  content: frontmatter[2].trim(),
})

export const name = 'dsh-build-plugin'
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.register(skill)
}
