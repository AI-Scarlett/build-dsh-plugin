#!/usr/bin/env node

import { appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compareDshVersions, fetchOfficialDshReleaseWindow } from '../build-dsh-plugin/scripts/official-dsh-releases.mjs'

export async function resolveDshUpgradeMatrix(fetchWindow = fetchOfficialDshReleaseWindow) {
  const window = await fetchWindow({ releaseCount: 3 })
  if (window?.authority !== 'official-github-releases-and-npm-published-versions'
    || window?.releaseCount !== 3
    || !Array.isArray(window.releases)
    || window.releases.length !== 3
    || window.latestVersion !== window.releases[2]
    || !Array.isArray(window.channels)) {
    throw new Error('official DSH authority did not return a complete ordered latest-three window')
  }
  const nextChannels = window.channels.filter(channel => channel?.tag === 'next')
  if (nextChannels.length > 1) throw new Error('official DSH authority returned duplicate next channels')
  let nextVersion = null
  if (nextChannels.length === 1) {
    const channel = nextChannels[0]
    const order = typeof channel.version === 'string' ? compareDshVersions(channel.version, window.latestVersion) : null
    if (channel.kind !== 'preview' || order === null) throw new Error('official DSH next channel is malformed')
    if (order > 0) nextVersion = channel.version
  }
  return { latestVersion: window.latestVersion, releases: [...window.releases], nextVersion }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const matrix = await resolveDshUpgradeMatrix()
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `releases=${JSON.stringify(matrix.releases)}\nnext_version=${matrix.nextVersion ?? ''}\n`)
  }
  process.stdout.write(`${JSON.stringify(matrix)}\n`)
}
