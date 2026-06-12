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

test('root Vercel deployment exposes matching protected read-only functions', () => {
  const helper = join(root, '..', 'api/_lib/agent.js')
  assert.equal(existsSync(helper), true, 'missing root api/_lib/agent.js')
  const helperSource = readFileSync(helper, 'utf8')
  assert.match(helperSource, /AROMAZ_AGENT_API_KEY/, 'root helper must use AROMAZ_AGENT_API_KEY')
  assert.match(helperSource, /Bearer/, 'root helper must validate Bearer tokens')

  for (const endpoint of endpoints) {
    const route = join(root, '..', 'api/agent', `${endpoint}.js`)
    assert.equal(existsSync(route), true, `missing root Vercel function ${endpoint}`)
    const source = readFileSync(route, 'utf8')
    assert.match(source, /requireAgentAuth/, `${endpoint} must require agent auth`)
    assert.doesNotMatch(source, /req\.method\s*===\s*['"](POST|PUT|PATCH|DELETE)['"]/, `${endpoint} must not expose mutations`)
  }
})
