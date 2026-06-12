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

test('root Vercel deployment rewrites /crm to the static platform shell', () => {
  const vercelConfig = join(root, '..', 'vercel.json')
  assert.equal(existsSync(vercelConfig), true, 'missing root vercel.json')
  const config = JSON.parse(readFileSync(vercelConfig, 'utf8'))
  assert.ok(Array.isArray(config.rewrites), 'vercel.json must define rewrites')
  assert.ok(
    config.rewrites.some((rewrite) => rewrite.source === '/crm' && rewrite.destination === '/'),
    'vercel.json must rewrite /crm to /',
  )
  assert.ok(
    config.rewrites.some((rewrite) => rewrite.source === '/crm/:path*' && rewrite.destination === '/'),
    'vercel.json must rewrite nested /crm paths to /',
  )
})

test('platform includes embedded Agente Aromaz assistant surface', () => {
  const staticPlatform = join(root, '..', 'index.html')
  assert.equal(existsSync(staticPlatform), true, 'missing root static platform')
  const staticSource = readFileSync(staticPlatform, 'utf8')
  assert.match(staticSource, /agent-assistant/, 'static platform must render assistant widget')
  assert.match(staticSource, /askAgent/, 'static platform must expose agent interaction handler')
  assert.match(staticSource, /Vendedores detectados/, 'assistant must answer salespeople/vendor list queries')

  const crmWidget = join(root, 'src/components/agent/AgentAssistantWidget.tsx')
  assert.equal(existsSync(crmWidget), true, 'missing CRM assistant widget')
  const widgetSource = readFileSync(crmWidget, 'utf8')
  assert.match(widgetSource, /Agente Aromaz/, 'CRM widget must identify Agente Aromaz')
  assert.match(widgetSource, /api\/agent\/chat/, 'CRM widget must call internal chat API')

  const chatRoute = join(root, 'src/app/api/agent/chat/route.ts')
  assert.equal(existsSync(chatRoute), true, 'missing CRM chat route')
  const chatSource = readFileSync(chatRoute, 'utf8')
  assert.match(chatSource, /createAdminClient/, 'chat route must run server-side with platform context')
  assert.match(chatSource, /salesmen|vendedores/i, 'chat route must support seller list questions')
})
