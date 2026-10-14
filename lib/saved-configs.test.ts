import { readSavedConfigs, saveConfig, STORAGE_KEY } from './saved-configs'

function memory() {
  const data = new Map<string, string>()
  return { getItem: (key: string) => data.get(key) || null, setItem: (key: string, value: string) => { data.set(key, value) } }
}
test('saves and restores version order without credentials', () => {
  const storage = memory()
  saveConfig(storage, 'cursor', ['ac.snag/snag'], '{"mcpServers":{}}', {'ac.snag/snag':'1.0.0'}, new Date('2026-10-13T12:00:00Z'))
  saveConfig(storage, 'continue', ['ai.2kw/mcp-server'], 'mcpServers:\n', {'ai.2kw/mcp-server':'6.3.0'}, new Date('2026-10-13T12:01:00Z'))
  expect(readSavedConfigs(storage).map(v => v.platform)).toEqual(['continue', 'cursor'])
  expect(storage.getItem(STORAGE_KEY)).not.toMatch(/API_KEY|secret|token/i)
})
test('rejects invalid free selections and corrupted local state', () => {
  const storage = memory()
  expect(() => saveConfig(storage, 'cursor', ['a', 'b', 'c', 'd'], 'config', {})).toThrow()
  expect(() => saveConfig(storage, 'cursor', ['a', 'a'], 'config', {})).toThrow()
  storage.setItem(STORAGE_KEY, '{broken')
  expect(readSavedConfigs(storage)).toEqual([])
})
