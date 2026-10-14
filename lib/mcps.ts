import registry from './registry.json'
import { MCP, MCPCategory } from './types'

export const mcps: MCP[] = registry.servers as MCP[]
export function searchMCPs(query: string, category?: MCPCategory): MCP[] {
  const term = query.trim().toLocaleLowerCase()
  return mcps.filter(mcp => (!category || mcp.category === category) &&
    (!term || [mcp.name, mcp.id, mcp.description, mcp.category].some(value => value.toLocaleLowerCase().includes(term))))
}
export function getMCPById(id: string): MCP | undefined { return mcps.find(mcp => mcp.id === id) }
