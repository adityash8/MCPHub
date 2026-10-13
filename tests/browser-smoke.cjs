// Run against the local app with a separately installed Playwright and Chrome:
// npm run start -- --hostname 127.0.0.1 --port 3107
// node tests/browser-smoke.cjs [absolute path to Playwright if not locally installed]
const assert = require('node:assert/strict')
const registry = require('../lib/registry.json')

const { chromium } = require(process.argv[2] || 'playwright')

const base = 'http://127.0.0.1:3107'
const stdio = registry.servers.find(server => server.id === 'io.github.vercel/next-devtools-mcp')
assert.ok(stdio, 'Catalog needs a verified npm stdio entry for client export checks')
const packageMetadata = stdio.packages.find(pkg => pkg.registryType === 'npm' && pkg.transport === 'stdio' && pkg.binary && pkg.launchVerified)
assert.ok(packageMetadata, 'Publisher setup and exact npm binary must both be verified')

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 }, permissions: ['clipboard-read', 'clipboard-write'], acceptDownloads: true })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await page.goto(`${base}/directory`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Developer', exact: true }).click()
    assert.ok(await page.locator('article').count() > 0, 'Category filter has results')
    assert.equal(await page.locator('article').filter({ hasNotText: 'Developer' }).count(), 0, 'Category filter excludes other cards')
    await page.getByRole('button', { name: 'All', exact: true }).click()
    await page.getByLabel('Search servers').fill(stdio.id)
    assert.equal(await page.locator('article').count(), 1, 'Search finds selected catalog record')
    await page.getByRole('button', { name: 'View setup details' }).click()
    await page.getByRole('dialog').getByText(stdio.version, { exact: true }).waitFor()
    await page.getByRole('button', { name: 'Close details' }).click()
    await page.getByLabel(`Select ${stdio.name}`).check()
    await page.getByLabel('Search servers').fill('')

    for (const client of ['claude-desktop', 'cursor', 'cline', 'continue']) {
      await page.getByLabel('Client').selectOption(client)
      const blocked = await page.locator('#config [role="alert"]').allTextContents()
      assert.deepEqual(blocked, [], `Verified stdio export must be available for ${client}: ${blocked.join(' ')}`)
      await page.getByRole('button', { name: 'Preview config' }).click()
      const preview = await page.locator('pre').innerText()
      if (client === 'continue') {
        assert.match(preview, /^mcpServers:\n  - name:/)
        assert.match(preview, /    command: "npx"/)
      } else {
        const entry = Object.values(JSON.parse(preview).mcpServers)[0]
        assert.equal(entry.command, 'npx')
        assert.ok(entry.args.includes(`${packageMetadata.identifier}@${packageMetadata.version}`))
        assert.ok(entry.args.includes(packageMetadata.binary))
      }
      await page.getByRole('button', { name: 'Copy' }).click()
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), preview, `Copy returns ${client} config`)
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download', exact: true }).click(),
      ])
      assert.equal(download.suggestedFilename(), client === 'continue' ? 'config.yaml' : client === 'cursor' ? 'mcp.json' : client === 'cline' ? 'cline_mcp_settings.json' : 'claude_desktop_config.json')
      await page.getByRole('button', { name: 'Hide config preview' }).click()
    }

    await page.getByLabel('Client').selectOption('cursor')
    await page.getByRole('button', { name: 'Preview config' }).click()
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('1/3 selected').waitFor()
    await page.getByRole('button', { name: 'Saved versions (1)' }).click()
    await page.getByRole('button', { name: 'Restore selection' }).click()
    await page.getByRole('button', { name: 'Download saved' }).waitFor()

    const unchecked = page.locator('article input[type=checkbox]:not(:checked)')
    await unchecked.nth(0).check()
    await unchecked.nth(0).check()
    await unchecked.nth(0).click()
    await page.getByText('The free config holds up to three servers.').waitFor()
    assert.equal(await page.locator('article input[type=checkbox]:checked').count(), 3, 'Fourth server is rejected')

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    mobile.on('pageerror', error => errors.push(error.message))
    await mobile.goto(`${base}/directory`, { waitUntil: 'networkidle' })
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No mobile horizontal overflow')
    assert.deepEqual(errors, [], 'No browser runtime errors')
    console.log('PASS search/filter/detail, four client exports, copy/download, save/reload, free limit, mobile width, runtime errors')
  } finally { await browser.close() }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
