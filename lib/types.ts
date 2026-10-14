export type Platform = 'claude-desktop' | 'cursor' | 'continue' | 'cline'
export type MCPCategory = 'Developer' | 'Productivity' | 'Client workflows'
export interface Requirement { name: string; description: string; required: boolean; secret: boolean }
export interface MCP {
  id: string
  name: string
  description: string
  version: string
  websiteUrl: string | null
  repositoryUrl: string | null
  updatedAt: string
  category: MCPCategory
  reason: string
  provenance: { registryUrl: string; publisherSourceUrl: string | null; publisherReadmeUrl: string | null; publisherReadmeRetrieved: boolean; scope: string }
  packages: { registryType: string; identifier: string; version: string; binary: string | null; transport: string; environmentVariables: Requirement[]; npmMetadataUrl: string | null; npmMetadataChecked: boolean; launchVerified?: boolean; launchArgs?: string[] }[]
  remotes: { type: string; url: string; headers: Requirement[]; setupVerified?: boolean; setupSourceUrl?: string }[]
}
export interface SavedConfig { id: string; createdAt: string; platform: Platform; serverIds: string[]; label: string; content: string; serverVersions: Record<string, string> }
