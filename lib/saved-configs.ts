import { SavedConfig, Platform } from './types'

export const STORAGE_KEY = 'mcphub-configs-v1'
export const SELECTION_KEY = 'mcphub-selection-v1'
export const PLATFORM_KEY = 'mcphub-platform-v1'
export function readSavedConfigs(storage: Pick<Storage, 'getItem'>): SavedConfig[] {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter(item => item && typeof item.id === 'string' && typeof item.createdAt === 'string' && typeof item.label === 'string' && typeof item.content === 'string' && item.content.length < 20000 && item.serverVersions && typeof item.serverVersions === 'object' &&
      ['claude-desktop', 'cursor', 'continue', 'cline'].includes(item.platform) && Array.isArray(item.serverIds) && item.serverIds.length <= 3 && item.serverIds.every((id: unknown) => typeof id === 'string')).slice(0, 10)
  } catch { return [] }
}
export function saveConfig(storage: Pick<Storage, 'setItem' | 'getItem'>, platform: Platform, serverIds: string[], content: string, serverVersions: Record<string, string>, now = new Date()): SavedConfig[] {
  if (!content || content.length > 20000) throw new Error('Invalid config content.')
  if (serverIds.length < 1 || serverIds.length > 3 || new Set(serverIds).size !== serverIds.length) throw new Error('Select one to three different servers.')
  const item: SavedConfig = { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now.toISOString(), platform, serverIds, content, serverVersions, label: `${platform} · ${serverIds.length} server${serverIds.length === 1 ? '' : 's'}` }
  const next = [item, ...readSavedConfigs(storage)].slice(0, 10)
  storage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
