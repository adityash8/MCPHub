import { MCP, Platform } from './types'

export const platforms: { id: Platform; name: string; file: string; instructions: string; docs: string }[] = [
  { id: 'claude-desktop', name: 'Claude Desktop', file: 'claude_desktop_config.json', instructions: 'Open Claude Desktop → Settings → Developer → Edit Config. Merge the mcpServers entries with your existing config, replace credential placeholders locally, then restart Claude Desktop.', docs: 'https://modelcontextprotocol.io/docs/develop/connect-local-servers' },
  { id: 'cursor', name: 'Cursor', file: '.cursor/mcp.json', instructions: 'In Cursor, open Settings → Tools & Integrations → New MCP Server. Merge the mcpServers entries into your global or project .cursor/mcp.json. Replace credential placeholders locally.', docs: 'https://docs.cursor.com/context/mcp' },
  { id: 'continue', name: 'Continue', file: 'config.yaml', instructions: 'Open your Continue config.yaml and merge these mcpServers list items under the existing mcpServers key. Replace credential placeholders locally.', docs: 'https://docs.continue.dev/customize/deep-dives/mcp' },
  { id: 'cline', name: 'Cline', file: 'cline_mcp_settings.json', instructions: 'In Cline, open MCP Servers → Configure MCP Servers. Merge the mcpServers entries with your existing settings and replace credential placeholders locally.', docs: 'https://docs.cline.bot/mcp/configuring-mcp-servers' },
]
export interface ConfigResult { text: string; errors: string[]; checklist: string[]; extension: 'json' | 'yaml' }
const safeKey = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '_')
const yamlScalar = (value: string) => JSON.stringify(value)
export function generateConfig(servers: MCP[], platform: Platform): ConfigResult {
  const errors: string[] = []
  const checklist: string[] = []
  if (!platforms.some(p => p.id === platform)) errors.push('Choose a supported client.')
  if (servers.length === 0 || servers.length > 3) errors.push('Select one to three servers.')
  if (new Set(servers.map(s => s.id)).size !== servers.length) errors.push('Remove duplicate servers.')
  const entries: { name: string; command?: string; args?: string[]; env?: Record<string, string>; url?: string }[] = []
  for (const server of servers) {
    const pkg = server.packages.find(p => p.registryType === 'npm' && p.transport === 'stdio' && p.launchVerified)
    const remote = server.remotes.find(r => r.type === 'streamable-http' && r.setupVerified)
    const name = safeKey(server.id)
    if (pkg) {
      if (!pkg.npmMetadataChecked || !/^(@[a-z0-9_.-]+\/)?[a-z0-9_.-]+$/i.test(pkg.identifier) || !/^[a-z0-9_.-]+$/i.test(pkg.binary || '') || !/^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][\w.-]+)?$/.test(pkg.version) || pkg.environmentVariables.some(v => v.required && !/^[A-Z_][A-Z0-9_]*$/.test(v.name)) || (pkg.launchArgs || []).some(arg => !/^[a-z0-9_-]+$/i.test(arg))) {
        errors.push(`${server.name}: invalid package metadata.`); continue
      }
      const env = Object.fromEntries(pkg.environmentVariables.filter(v => v.required).map(v => [v.name, `<${v.name}>`]))
      pkg.environmentVariables.filter(v => v.required).forEach(v => checklist.push(`${server.name}: set ${v.name} locally. ${v.description}`))
      entries.push({ name, command: 'npx', args: ['-y', '--package', `${pkg.identifier}@${pkg.version}`, pkg.binary!, ...(pkg.launchArgs || [])], ...(Object.keys(env).length ? { env } : {}) })
    } else if (remote) {
      try { if (new URL(remote.url).protocol !== 'https:') throw new Error() } catch { errors.push(`${server.name}: invalid remote URL.`); continue }
      if (remote.headers.some(h => h.required)) { errors.push(`${server.name}: requires an auth header that this export cannot safely configure. Use its documentation.`); continue }
      if (platform !== 'cursor') { errors.push(`${server.name}: remote URL export is supported here only for Cursor. Configure this server in ${platforms.find(p => p.id === platform)?.name || 'your client'} using its own remote connector flow.`); continue }
      checklist.push(`${server.name}: remote server may ask you to sign in or grant access in Cursor.`)
      entries.push({ name, url: remote.url })
    } else errors.push(`${server.name}: publisher setup for this launch or remote URL has not been verified for export.`)
  }
  if (errors.length) return { text: '', errors, checklist, extension: platform === 'continue' ? 'yaml' : 'json' }
  const text = platform === 'continue'
    ? 'mcpServers:\n' + entries.map(entry => [
      `  - name: ${yamlScalar(entry.name)}`,
      `    command: ${yamlScalar(entry.command!)}`,
      `    args: [${entry.args!.map(yamlScalar).join(', ')}]`,
      ...(entry.env ? ['    env:', ...Object.entries(entry.env).map(([key, value]) => `      ${key}: ${yamlScalar(value)}`)] : []),
    ].join('\n')).join('\n') + '\n'
    : JSON.stringify({ mcpServers: Object.fromEntries(entries.map(({ name, ...config }) => [name, config])) }, null, 2) + '\n'
  return { text, errors, checklist, extension: platform === 'continue' ? 'yaml' : 'json' }
}
export function getConfigFileName(platform: Platform): string { return platforms.find(p => p.id === platform)?.file.split('/').pop() || 'mcp-config.json' }
export function getConfigInstructions(platform: Platform): string { return platforms.find(p => p.id === platform)?.instructions || 'Choose a supported client.' }
