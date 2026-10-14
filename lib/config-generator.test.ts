import { generateConfig, getConfigFileName } from './config-generator'
import { mcps } from './mcps'
import { MCP } from './types'
import registry from './registry.json'

const stdio = mcps.find(m => m.id === 'io.github.brave/brave-search-mcp-server')!
const remote = mcps.find(m => m.id === 'com.vercel/vercel-mcp')!
const headerRemote = mcps.find(m => m.id === 'ai.vexa/vexa')!

describe('official registry import', () => {
  it('keeps 50+ unique current entries with source transports and versions', () => {
    expect(mcps.length).toBeGreaterThanOrEqual(50)
    expect(new Set(mcps.map(m => m.id)).size).toBe(mcps.length)
    expect(mcps.map(m => [m.id, m.version, m.packages, m.remotes])).toEqual(registry.servers.map(m => [m.id, m.version, m.packages, m.remotes]))
    expect(mcps.every(m => m.packages.length || m.remotes.length)).toBe(true)
  })
  it('records exact npm metadata and publisher source scope', () => {
    expect(stdio.packages[0]).toMatchObject({ identifier: '@brave/brave-search-mcp-server', version: '2.1.3', binary: 'brave-search-mcp-server', npmMetadataChecked: true, launchVerified: true })
    expect(stdio.provenance.publisherReadmeUrl).toContain('github.com')
    expect(mcps.every(m => m.reason && m.provenance.registryUrl.startsWith('https://registry.modelcontextprotocol.io/'))).toBe(true)
  })
  it('does not carry unproven popularity, ratings, or status', () => {
    expect(mcps.every(m => !['githubStars', 'rating', 'healthStatus', 'upvotes'].some(key => key in m))).toBe(true)
  })
})

describe('client exports', () => {
  it.each(['claude-desktop', 'cursor', 'cline'] as const)('%s uses the exact pinned npm package and credential placeholder', platform => {
    const result = generateConfig([stdio], platform)
    expect(result.errors).toEqual([])
    const entry = Object.values(JSON.parse(result.text).mcpServers)[0] as any
    expect(entry).toEqual({ command: 'npx', args: ['-y', '--package', '@brave/brave-search-mcp-server@2.1.3', 'brave-search-mcp-server', '--transport', 'stdio'], env: { BRAVE_API_KEY: '<BRAVE_API_KEY>' } })
    expect(result.checklist.join(' ')).toContain('BRAVE_API_KEY')
  })
  it('writes Continue YAML list entries, not mcpServers JSON', () => {
    const result = generateConfig([stdio], 'continue')
    expect(result.errors).toEqual([])
    expect(getConfigFileName('continue')).toBe('config.yaml')
    expect(result.text).toMatch(/^mcpServers:\n  - name:/)
    expect(result.text).toContain('    command: "npx"')
    expect(result.text).toContain('    args: ["-y", "--package", "@brave/brave-search-mcp-server@2.1.3", "brave-search-mcp-server", "--transport", "stdio"]')
    expect(() => JSON.parse(result.text)).toThrow()
  })
  it('uses publisher documented Figma stdio and Firecrawl cloud requirements', () => {
    const figma = mcps.find(m => m.id === 'io.github.GLips/Figma-Context-MCP')!
    const firecrawl = mcps.find(m => m.id === 'io.github.firecrawl/firecrawl-mcp-server')!
    const figmaEntry = Object.values(JSON.parse(generateConfig([figma], 'cursor').text).mcpServers)[0] as any
    expect(figmaEntry.args).toContain('--stdio')
    const firecrawlEntry = Object.values(JSON.parse(generateConfig([firecrawl], 'cursor').text).mcpServers)[0] as any
    expect(firecrawlEntry.env).toEqual({ FIRECRAWL_API_KEY: '<FIRECRAWL_API_KEY>' })
  })
  it('allows an HTTPS remote URL in Cursor without inventing a package', () => {
    const result = generateConfig([remote], 'cursor')
    expect(result.errors).toEqual([])
    expect(Object.values(JSON.parse(result.text).mcpServers)[0]).toEqual({ url: remote.remotes[0].url })
  })
  it('blocks a Registry remote whose publisher setup is not yet checked', () => {
    const linear = mcps.find(m => m.id === 'app.linear/linear')!
    expect(generateConfig([linear], 'cursor').errors[0]).toContain('publisher setup')
  })
  it.each(['claude-desktop', 'continue', 'cline'] as const)('blocks unsupported remote export for %s', platform => {
    const result = generateConfig([remote], platform)
    expect(result.text).toBe('')
    expect(result.errors[0]).toContain('remote URL')
  })
  it('blocks a required remote authorization header', () => {
    const result = generateConfig([{ ...headerRemote, remotes: headerRemote.remotes.map(r => ({ ...r, setupVerified: true })) }], 'cursor')
    expect(result.text).toBe('')
    expect(result.errors[0]).toContain('auth header')
  })
  it('rejects unsafe registry metadata and more than three selections', () => {
    const bad: MCP = { ...remote, id: 'evil', remotes: [{ type: 'streamable-http', url: 'http://localhost/private', headers: [], setupVerified: true }] }
    expect(generateConfig([bad], 'cursor').errors[0]).toContain('invalid remote URL')
    expect(generateConfig([remote, stdio, headerRemote, bad], 'cursor').errors).toContain('Select one to three servers.')
    expect(generateConfig([stdio, stdio], 'cursor').errors).toContain('Remove duplicate servers.')
  })
  it('blocks unknown transports and unresolved package launch metadata', () => {
    const unsupported: MCP = { ...stdio, id: 'unsupported', packages: [{ ...stdio.packages[0], transport: 'sse' }], remotes: [] }
    const noVersion: MCP = { ...stdio, id: 'no-version', packages: [{ ...stdio.packages[0], version: '' }], remotes: [] }
    const noBinary: MCP = { ...stdio, id: 'no-binary', packages: [{ ...stdio.packages[0], binary: null }], remotes: [] }
    expect(generateConfig([unsupported], 'cursor').errors[0]).toContain('publisher setup')
    expect(generateConfig([noVersion], 'cursor').errors[0]).toContain('invalid package metadata')
    expect(generateConfig([noBinary], 'cursor').errors[0]).toContain('invalid package metadata')
    expect(generateConfig([{ ...stdio, packages: [{ ...stdio.packages[0], launchVerified: false }] }], 'cursor').errors[0]).toContain('publisher setup')
  })
  it('blocks malformed required environment names before writing YAML or JSON', () => {
    const unsafe: MCP = { ...stdio, packages: [{ ...stdio.packages[0], environmentVariables: [{ name: 'TOKEN\n  extra: injected', description: '', required: true, secret: true }] }] }
    for (const platform of ['continue', 'cursor'] as const) {
      const result = generateConfig([unsafe], platform)
      expect(result.text).toBe('')
      expect(result.errors[0]).toContain('invalid package metadata')
    }
  })
})
