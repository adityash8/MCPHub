import { describe, it, expect } from 'vitest';
import { generateConfig, getConfigFileName, getConfigInstructions } from '../../lib/config-generator';
import type { MCP, Platform } from '../../lib/types';

describe('config-generator', () => {
  const mockMCPs: MCP[] = [
    {
      id: 'test-mcp-1',
      name: 'Test MCP 1',
      description: 'A test MCP',
      githubUrl: 'https://github.com/test/mcp1',
      category: 'dev-tools',
      platforms: ['claude-desktop', 'cursor', 'continue', 'cline']
    },
    {
      id: 'test-mcp-2',
      name: 'Test MCP 2',
      description: 'Another test MCP',
      githubUrl: 'https://github.com/test/mcp2',
      category: 'productivity',
      platforms: ['claude-desktop']
    }
  ];

  describe('generateConfig', () => {
    it('should generate config for claude-desktop', () => {
      const result = generateConfig(mockMCPs, 'claude-desktop');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        mcpServers: {
          'test_mcp_1': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-test-mcp-1']
          },
          'test_mcp_2': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-test-mcp-2']
          }
        }
      });
    });

    it('should generate config for cursor', () => {
      const result = generateConfig([mockMCPs[0]], 'cursor');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        mcpServers: {
          'test_mcp_1': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-test-mcp-1']
          }
        }
      });
    });

    it('should generate config for continue', () => {
      const result = generateConfig([mockMCPs[0]], 'continue');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        mcpServers: {
          'test_mcp_1': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-test-mcp-1']
          }
        }
      });
    });

    it('should generate config for default platform (cline or missing)', () => {
      const result = generateConfig([mockMCPs[0]], 'cline');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        mcpServers: {
          'test_mcp_1': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-test-mcp-1']
          }
        }
      });
    });

    it('should return empty mcpServers object when no mcps are provided', () => {
      const result = generateConfig([], 'claude-desktop');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        mcpServers: {}
      });
    });
  });

  describe('getConfigFileName', () => {
    it('should return correct filename for claude-desktop', () => {
      expect(getConfigFileName('claude-desktop')).toBe('claude_desktop_config.json');
    });

    it('should return correct filename for cursor', () => {
      expect(getConfigFileName('cursor')).toBe('cursor_mcp_config.json');
    });

    it('should return correct filename for continue', () => {
      expect(getConfigFileName('continue')).toBe('continue_config.json');
    });

    it('should return correct filename for cline', () => {
      expect(getConfigFileName('cline')).toBe('cline_config.json');
    });

    it('should return fallback filename for unknown platform', () => {
      expect(getConfigFileName('unknown' as Platform)).toBe('mcp_config.json');
    });
  });

  describe('getConfigInstructions', () => {
    it('should return instructions for claude-desktop', () => {
      expect(getConfigInstructions('claude-desktop')).toContain('Claude Desktop');
    });

    it('should return instructions for cursor', () => {
      expect(getConfigInstructions('cursor')).toContain('Cursor');
    });

    it('should return instructions for continue', () => {
      expect(getConfigInstructions('continue')).toContain('Continue');
    });

    it('should return instructions for cline', () => {
      expect(getConfigInstructions('cline')).toContain('Cline');
    });

    it('should return default instructions for unknown platform', () => {
      expect(getConfigInstructions('unknown' as Platform)).toContain('Follow your tool');
    });
  });
});
