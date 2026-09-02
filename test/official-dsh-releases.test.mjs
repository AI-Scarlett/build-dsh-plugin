import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DSH_RELEASE_WINDOW_AUTHORITY,
  officialDshReleaseWindow,
} from '../build-dsh-plugin/scripts/official-dsh-releases.mjs'

function metadata(overrides = {}) {
  return {
    name: '@deepseek-ai/dsh',
    'dist-tags': { latest: '0.1.1-rc.2', next: '0.1.3-next.1', alpha: '0.1.2-alpha.5' },
    versions: {
      '0.1.0-rc.8': {}, '0.1.1-rc.1': {}, '0.1.1-rc.2': {},
      '0.1.2-alpha.2': {}, '0.1.2-alpha.3': {}, '0.1.2-alpha.4': {}, '0.1.2-alpha.5': {}, '0.1.3-next.1': {},
    },
    ...overrides,
  }
}

test('official release window follows the highest supported channel and excludes next-only versions', () => {
  const window = officialDshReleaseWindow(metadata())
  assert.equal(window.authority, DSH_RELEASE_WINDOW_AUTHORITY)
  assert.equal(window.stableVersion, '0.1.1-rc.2')
  assert.equal(window.latestVersion, '0.1.2-alpha.5')
  assert.equal(window.releaseTag, 'alpha')
  assert.deepEqual(window.releases, ['0.1.2-alpha.3', '0.1.2-alpha.4', '0.1.2-alpha.5'])
  assert.ok(!window.releases.includes('0.1.3-next.1'))
})

test('deprecated releases cannot satisfy the latest-three window', () => {
  const value = metadata()
  value.versions['0.1.2-alpha.3'] = { deprecated: 'withdrawn' }
  assert.deepEqual(officialDshReleaseWindow(value).releases, ['0.1.2-alpha.2', '0.1.2-alpha.4', '0.1.2-alpha.5'])
})


test('future alpha releases move the live window forward without code changes', () => {
  const value = metadata()
  value['dist-tags'].alpha = '0.1.2-alpha.7'
  value.versions['0.1.2-alpha.6'] = {}
  value.versions['0.1.2-alpha.7'] = {}
  assert.deepEqual(officialDshReleaseWindow(value).releases, [
    '0.1.2-alpha.5', '0.1.2-alpha.6', '0.1.2-alpha.7',
  ])
})

test('invalid official package identity fails closed', () => {
  assert.throws(() => officialDshReleaseWindow(metadata({ name: 'not-dsh' })), /unexpected package name/)
})
