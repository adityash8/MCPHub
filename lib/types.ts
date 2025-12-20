export type Platform = 'claude-desktop' | 'cursor' | 'continue' | 'cline'

export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown'

export interface MCP {
  id: string
  name: string
  description: string
  longDescription?: string
  githubUrl: string
  githubStars?: number
  lastUpdated?: string
  category: MCPCategory
  platforms: Platform[]
  requiredScopes?: string[]
  author?: string
  version?: string
  rating?: number
  reviewCount?: number
  upvotes?: number
  tags?: string[]
  healthStatus?: HealthStatus
  isFeatured?: boolean
  trendingScore?: number
}

export type MCPCategory =
  | 'dev-tools'
  | 'productivity'
  | 'data'
  | 'communication'
  | 'analytics'
  | 'content'
  | 'utilities'

export interface MCPConfig {
  mcpServers: {
    [key: string]: {
      command: string
      args?: string[]
      env?: { [key: string]: string }
    }
  }
}

export interface SelectedMCP {
  mcp: MCP
  platform: Platform
}

