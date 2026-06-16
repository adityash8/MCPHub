import { generateConfig, getConfigFileName, getConfigInstructions } from './config-generator'
import { MCP } from './types'

const mockMCPs: MCP[] = [
  {
    id: 'test-server',
    name: 'Test Server',
    description: 'A test server',
    githubUrl: 'https://github.com/test/server',
    category: 'utilities',
    platforms: ['claude-desktop', 'cursor']
  },
  {
    id: 'another-server-123',
    name: 'Another Server',
    description: 'Another test server',
    githubUrl: 'https://github.com/test/another',
    category: 'dev-tools',
    platforms: ['continue']
  }
]

describe('generateConfig', () => {
  it('generates correct config for claude-desktop', () => {
    const configStr = generateConfig(mockMCPs, 'claude-desktop')
    const config = JSON.parse(configStr)

    expect(config.mcpServers).toBeDefined()
    expect(config.mcpServers['test_server']).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-test-server']
    })
    expect(config.mcpServers['another_server_123']).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-another-server-123']
    })
  })

  it('generates correct config for cursor', () => {
    const configStr = generateConfig(mockMCPs, 'cursor')
    const config = JSON.parse(configStr)

    expect(config.mcpServers['test_server']).toBeDefined()
    expect(config.mcpServers['test_server'].command).toBe('npx')
  })

  it('generates correct config for continue', () => {
    const configStr = generateConfig(mockMCPs, 'continue')
    const config = JSON.parse(configStr)

    expect(config.mcpServers['test_server']).toBeDefined()
    expect(config.mcpServers['test_server'].command).toBe('npx')
  })

  it('generates correct config for unknown platform', () => {
    // Need to cast to any to test fallback behavior
    const configStr = generateConfig(mockMCPs, 'unknown' as any)
    const config = JSON.parse(configStr)

    expect(config.mcpServers['test_server']).toBeDefined()
    expect(config.mcpServers['test_server'].command).toBe('npx')
  })

  it('handles empty MCP list', () => {
    const configStr = generateConfig([], 'cursor')
    const config = JSON.parse(configStr)

    expect(config.mcpServers).toEqual({})
  })

  it('replaces all hyphens with underscores in server names', () => {
    const mcp: MCP = {
      id: 'a-b-c-d',
      name: 'A B C D',
      description: 'Test',
      githubUrl: 'https://github.com/test',
      category: 'utilities',
      platforms: ['claude-desktop']
    }

    const configStr = generateConfig([mcp], 'cline')
    const config = JSON.parse(configStr)

    expect(config.mcpServers['a_b_c_d']).toBeDefined()
    expect(config.mcpServers['a_b_c_d'].args).toContain('@modelcontextprotocol/server-a-b-c-d')
  })
})

describe('getConfigFileName', () => {
  it('returns correct filename for each platform', () => {
    expect(getConfigFileName('claude-desktop')).toBe('claude_desktop_config.json')
    expect(getConfigFileName('cursor')).toBe('cursor_mcp_config.json')
    expect(getConfigFileName('continue')).toBe('continue_config.json')
    expect(getConfigFileName('cline')).toBe('cline_config.json')
  })

  it('returns default filename for unknown platform', () => {
    expect(getConfigFileName('unknown' as any)).toBe('mcp_config.json')
  })
})

describe('getConfigInstructions', () => {
  it('returns instructions for specific platforms', () => {
    expect(getConfigInstructions('claude-desktop')).toContain('Claude Desktop')
    expect(getConfigInstructions('cursor')).toContain('Cursor')
    expect(getConfigInstructions('continue')).toContain('Continue')
    expect(getConfigInstructions('cline')).toContain('Cline')
  })

  it('returns default instructions for unknown platform', () => {
    expect(getConfigInstructions('unknown' as any)).toContain('documentation')
  })
})
