import { getConfigFileName } from '../config-generator'
import { Platform } from '../types'

describe('getConfigFileName', () => {
  it('should return the correct filename for claude-desktop', () => {
    expect(getConfigFileName('claude-desktop')).toBe('claude_desktop_config.json')
  })

  it('should return the correct filename for cursor', () => {
    expect(getConfigFileName('cursor')).toBe('cursor_mcp_config.json')
  })

  it('should return the correct filename for continue', () => {
    expect(getConfigFileName('continue')).toBe('continue_config.json')
  })

  it('should return the correct filename for cline', () => {
    expect(getConfigFileName('cline')).toBe('cline_config.json')
  })

  it('should return the default filename for an unknown platform', () => {
    expect(getConfigFileName('unknown-platform' as Platform)).toBe('mcp_config.json')
  })
})
