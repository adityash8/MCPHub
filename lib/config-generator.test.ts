import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { generateConfig } from './config-generator.ts';

// Helper to create mock MCP objects that satisfy the MCP type but only have the fields needed for generating config.
// Type casting is generally unsafe, but acceptable for this specific test case.
const createMockMCP = (id: string) => ({ id } as any);

describe('config-generator', () => {
  describe('generateConfig', () => {
    test('generates empty config for empty mcps array', () => {
      const result = generateConfig([], 'claude-desktop');
      const parsed = JSON.parse(result);
      assert.deepStrictEqual(parsed, { mcpServers: {} });
    });

    test('generates config for a single MCP', () => {
      const mcps = [createMockMCP('sqlite')];
      const result = generateConfig(mcps, 'claude-desktop');
      const parsed = JSON.parse(result);
      assert.deepStrictEqual(parsed, {
        mcpServers: {
          sqlite: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-sqlite']
          }
        }
      });
    });

    test('replaces hyphens with underscores in server names', () => {
      const mcps = [createMockMCP('github-repo-manager')];
      const result = generateConfig(mcps, 'claude-desktop');
      const parsed = JSON.parse(result);
      assert.ok('github_repo_manager' in parsed.mcpServers);
      assert.deepStrictEqual(parsed.mcpServers['github_repo_manager'], {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github-repo-manager']
      });
    });

    test('generates config for multiple MCPs', () => {
      const mcps = [createMockMCP('sqlite'), createMockMCP('postgres-db')];
      const result = generateConfig(mcps, 'cursor');
      const parsed = JSON.parse(result);
      assert.deepStrictEqual(parsed, {
        mcpServers: {
          sqlite: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-sqlite']
          },
          postgres_db: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres-db']
          }
        }
      });
    });

    test('handles different platforms returning correct format', () => {
      const mcps = [createMockMCP('test-mcp')];
      const platforms: Array<'claude-desktop' | 'cursor' | 'continue' | 'cline'> = ['claude-desktop', 'cursor', 'continue', 'cline'];

      for (const platform of platforms) {
        const result = generateConfig(mcps, platform);
        const parsed = JSON.parse(result);

        // As per current implementation, all platforms return the exact same config logic.
        // If this changes in the future, this test will need to be updated.
        assert.deepStrictEqual(parsed, {
          mcpServers: {
            test_mcp: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-test-mcp']
            }
          }
        }, `Failed for platform: ${platform}`);
      }
    });
  });
});
