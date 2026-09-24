#!/usr/bin/env node

import assert from 'node:assert/strict'
import { execFile, spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createServer } from 'node:net'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const cli = resolve(process.argv[2] ?? '')
const packageRoot = resolve(process.argv[3] ?? '.')
if (!process.argv[2]) throw new Error('pass the fixed DSH CLI path as argv[2]')
const pluginSpec = process.env.DSH_TEST_PLUGIN_SPEC ?? `file:${packageRoot}`

const root = await mkdtemp(join(tmpdir(), 'build-dsh-plugin-e3-'))
const env = Object.fromEntries(Object.entries(process.env)
  .filter(([key]) => !/(TOKEN|SECRET|PASSWORD|API_KEY|AUTH|CREDENTIAL)/i.test(key)))
Object.assign(env, {
  DSH_HOME: resolve(root, 'home'),
  DSH_AGENTS_HOME: resolve(root, 'agents'),
  DSH_TELEMETRY_DISABLED: '1',
  npm_config_cache: resolve(root, 'npm-cache'),
  npm_config_userconfig: join(root, '.npmrc'),
  npm_config_registry: 'https://registry.npmjs.org/',
  CI: 'true',
})

let child
let stage = 'prepare'
async function run(args) {
  try {
    const result = await execFileAsync(process.execPath, [cli, ...args], {
      cwd: root, env, timeout: 180_000, maxBuffer: 6 * 1024 * 1024,
    })
    return result.stdout
  } catch (error) {
    const codes = [...new Set(`${error.stdout ?? ''}${error.stderr ?? ''}`
      .match(/\b(?:ERR_[A-Z0-9_]+|ENOENT|EPERM|EACCES|EBUSY|ENOSPC|EINVAL)\b/g) ?? [])]
    throw Object.assign(new Error('official DSH CLI operation failed'), { codes })
  }
}

async function unusedPort() {
  const server = createServer()
  await new Promise((done, reject) => server.once('error', reject).listen(0, '127.0.0.1', done))
  const port = server.address().port
  await new Promise((done, reject) => server.close(error => error ? reject(error) : done()))
  return port
}

try {
  await mkdir(env.DSH_HOME, { recursive: true })
  await writeFile(env.npm_config_userconfig, '', { mode: 0o600 })
  stage = 'initial-profile'
  await run(['--profile', 'web', '--dump-config'])

  stage = 'install'
  await run(['plugin', '--profile', 'web', 'add', '--ignore-scripts', '--config.auto-install-peers=false', pluginSpec])
  const installedConfig = await run(['--profile', 'web', '--dump-config'])
  assert.ok(installedConfig.includes('dsh-build-plugin-skill-provider'))

  stage = 'cold-start'
  const port = await unusedPort()
  child = spawn(process.execPath, [cli, 'web', '--no-open', '--port', String(port)], {
    cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'],
  })
  const launchUrl = await new Promise((done, reject) => {
    let buffer = ''
    const timer = setTimeout(() => reject(new Error('startup-timeout')), 90_000)
    const append = chunk => {
      buffer = `${buffer}${chunk.toString()}`.slice(-65_536)
      const match = /dsh web: (http:\/\/[^\s]+)/.exec(buffer)
      if (!match) return
      clearTimeout(timer)
      done(match[1])
      buffer = ''
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)
    child.once('error', () => { clearTimeout(timer); reject(new Error('startup-spawn-failed')) })
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`startup-exited-${code}`)) })
  })

  stage = 'authenticated-host-probe'
  const login = await fetch(launchUrl, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
  assert.ok([302, 303].includes(login.status))
  const cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
  assert.ok(cookie)
  let hostReady = false
  const base = new URL(launchUrl).origin
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${base}/`, { headers: { cookie }, signal: AbortSignal.timeout(10_000) })
    if (response.status === 200) { hostReady = true; break }
    await new Promise(done => setTimeout(done, 500))
  }
  assert.equal(hostReady, true)

  stage = 'stop-host'
  child.kill('SIGTERM')
  await new Promise((done, reject) => {
    const timer = setTimeout(() => reject(new Error('shutdown-timeout')), 10_000)
    child.once('exit', () => { clearTimeout(timer); done() })
  })
  child = null

  stage = 'uninstall'
  await run(['plugin', '--profile', 'web', 'remove', 'dsh-build-plugin'])
  const removedConfig = await run(['--profile', 'web', '--dump-config'])
  assert.equal(removedConfig.includes('dsh-build-plugin-skill-provider'), false)
  console.log(JSON.stringify({ status: 'passed', dshVersion: (await run(['--version'])).trim(), install: true, composition: true, coldStart: true, authenticatedHostHttp: 200, uninstall: true, disposableProfile: true }))
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', stage, codes: error.codes ?? [], reason: error.message.startsWith('official DSH CLI') ? error.message : error.message.slice(0, 100) }))
  process.exitCode = 1
} finally {
  if (child && child.exitCode === null) {
    child.kill('SIGKILL')
    await new Promise(done => child.once('exit', done))
  }
  await rm(root, { recursive: true, force: true })
}
