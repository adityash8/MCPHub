import test from 'node:test';
import assert from 'node:assert';
import { generateConfig } from './config-generator';
import { MCP } from './types';

test('generateConfig - empty list', () => {
  const result = generateConfig([], 'claude-desktop');
  const parsed = JSON.parse(result);
  assert.deepStrictEqual(parsed, { mcpServers: {} });
});

test('generateConfig - single MCP', () => {
  const mcps = [
    { id: 'test-server', name: 'Test Server', description: 'desc', githubUrl: 'url', category: 'dev-tools', platforms: [] } as MCP
  ];
  const result = generateConfig(mcps, 'claude-desktop');
  const parsed = JSON.parse(result);

  assert.deepStrictEqual(parsed.mcpServers.test_server, {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-test-server']
  });
});

test('generateConfig - multiple MCPs and hyphenated ids', () => {
  const mcps = [
    { id: 'foo-bar', name: 'Foo Bar', description: 'desc', githubUrl: 'url', category: 'dev-tools', platforms: [] } as MCP,
    { id: 'baz', name: 'Baz', description: 'desc', githubUrl: 'url', category: 'dev-tools', platforms: [] } as MCP
  ];
  const result = generateConfig(mcps, 'cursor');
  const parsed = JSON.parse(result);

  assert.deepStrictEqual(parsed.mcpServers.foo_bar, {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-foo-bar']
  });

  assert.deepStrictEqual(parsed.mcpServers.baz, {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-baz']
  });
});
