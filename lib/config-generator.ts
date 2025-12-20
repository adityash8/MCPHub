import { MCP, Platform, MCPConfig } from './types'

export function generateConfig(
  mcps: MCP[],
  platform: Platform
): string {
  const config: MCPConfig = {
    mcpServers: {},
  }

  for (const mcp of mcps) {
    const serverName = mcp.id.replace(/-/g, '_')
    
    if (platform === 'claude-desktop') {
      // Claude Desktop uses npm package format
      config.mcpServers[serverName] = {
        command: 'npx',
        args: ['-y', `@modelcontextprotocol/server-${mcp.id}`],
      }
    } else if (platform === 'cursor') {
      // Cursor uses similar format but may need different paths
      config.mcpServers[serverName] = {
        command: 'npx',
        args: ['-y', `@modelcontextprotocol/server-${mcp.id}`],
      }
    } else if (platform === 'continue') {
      // Continue uses similar format
      config.mcpServers[serverName] = {
        command: 'npx',
        args: ['-y', `@modelcontextprotocol/server-${mcp.id}`],
      }
    } else {
      // Default format
      config.mcpServers[serverName] = {
        command: 'npx',
        args: ['-y', `@modelcontextprotocol/server-${mcp.id}`],
      }
    }
  }

  return JSON.stringify(config, null, 2)
}

export function getConfigFileName(platform: Platform): string {
  const names: Record<Platform, string> = {
    'claude-desktop': 'claude_desktop_config.json',
    cursor: 'cursor_mcp_config.json',
    continue: 'continue_config.json',
    cline: 'cline_config.json',
  }
  return names[platform] || 'mcp_config.json'
}

export function getConfigInstructions(platform: Platform): string {
  const instructions: Record<Platform, string> = {
    'claude-desktop': `1. Open Claude Desktop
2. Go to Settings → Developer
3. Click "Open Config File"
4. Replace the contents with the downloaded config
5. Restart Claude Desktop`,
    cursor: `1. Open Cursor Settings
2. Navigate to MCP Settings
3. Open the config file
4. Replace the contents with the downloaded config
5. Reload Cursor`,
    continue: `1. Open Continue Settings
2. Navigate to MCP Configuration
3. Open the config file
4. Replace the contents with the downloaded config
5. Restart Continue`,
    cline: `1. Open Cline Settings
2. Navigate to MCP Configuration
3. Open the config file
4. Replace the contents with the downloaded config
5. Restart Cline`,
  }
  return instructions[platform] || 'Follow your tool\'s documentation to add the MCP configuration.'
}

