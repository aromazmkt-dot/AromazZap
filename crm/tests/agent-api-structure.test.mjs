import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const endpoints = [
  'health',
  'reports/dashboard',
  'products',
  'leads',
  'invoices',
]

test('agent API exposes only bearer-protected read-only GET endpoints', () => {
  const authHelper = join(root, 'src/lib/agent/auth.ts')
  assert.equal(existsSync(authHelper), true, 'missing src/lib/agent/auth.ts')
  const authSource = readFileSync(authHelper, 'utf8')
  assert.match(authSource, /AROMAZ_AGENT_API_KEY/, 'auth helper must use AROMAZ_AGENT_API_KEY')
  assert.match(authSource, /Bearer/, 'auth helper must validate Bearer tokens')

  for (const endpoint of endpoints) {
    const route = join(root, 'src/app/api/agent', endpoint, 'route.ts')
    assert.equal(existsSync(route), true, `missing route ${endpoint}`)
    const source = readFileSync(route, 'utf8')
    assert.match(source, /export\s+async\s+function\s+GET/, `${endpoint} must export GET`)
    assert.doesNotMatch(source, /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)/, `${endpoint} must be read-only`)
    assert.match(source, /requireAgentAuth/, `${endpoint} must require agent auth`)
  }
})
