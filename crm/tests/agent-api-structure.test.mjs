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

const actions = [
  'lead.updateStatus',
  'lead.assignOwner',
  'product.updatePricing',
  'product.updateVisibility',
  'expiration.updateStatus',
  'customer.updateStatus',
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

test('operational action API is explicit, allowlisted, and approval gated', () => {
  const rootAction = join(root, '..', 'api/agent/actions.js')
  assert.equal(existsSync(rootAction), true, 'missing root action API')
  const rootSource = readFileSync(rootAction, 'utf8')
  assert.match(rootSource, /requireAgentAuth/, 'root action API must require auth')
  assert.match(rootSource, /requireActionApproval/, 'root action API must require explicit action approval')
  assert.match(rootSource, /dryRun/, 'root action API must support dryRun')
  assert.doesNotMatch(rootSource, /delete\(/i, 'root action API must not expose deletes')
  for (const action of actions) assert.match(rootSource, new RegExp(action.replace('.', '\\.')), `missing action ${action}`)

  const crmAction = join(root, 'src/app/api/agent/actions/route.ts')
  assert.equal(existsSync(crmAction), true, 'missing CRM action API')
  const crmSource = readFileSync(crmAction, 'utf8')
  assert.match(crmSource, /export\s+async\s+function\s+POST/, 'CRM action API must expose POST')
  assert.match(crmSource, /requireAgentAuth/, 'CRM action API must require auth')
  assert.match(crmSource, /requireActionApproval/, 'CRM action API must require explicit action approval')
  assert.match(crmSource, /dryRun/, 'CRM action API must support dryRun')
  assert.doesNotMatch(crmSource, /\.delete\(/i, 'CRM action API must not expose deletes')
})
