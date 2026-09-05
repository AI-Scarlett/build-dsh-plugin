export function normalizeAuditPath(value) {
  return String(value).replace(/\\/g, '/')
}

export function isTestAuditPath(value) {
  const path = normalizeAuditPath(value)
  return /(^|\/)(?:test|tests|__tests__)(?:\/|$)/i.test(path)
    || /(^|\/)(?:test-[^/]+|[^/]+(?:\.test|-test))\.[cm]?[jt]sx?$/i.test(path)
}
