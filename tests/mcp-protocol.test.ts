import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import path from 'node:path'

test('a local fixture responds to MCP initialize and tools/list; it does not imply third-party health', async () => {
  const child = spawn(process.execPath, [path.join(process.cwd(), 'tests/fixtures/mcp-server.cjs')], { stdio: ['pipe', 'pipe', 'pipe'] })
  const lines = createInterface({ input: child.stdout })
  const iterator = lines[Symbol.asyncIterator]()
  try {
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1.0.0' } } }) + '\n')
    const initialized = JSON.parse((await iterator.next()).value)
    expect(initialized.result.serverInfo.name).toBe('local-fixture')
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n')
    const tools = JSON.parse((await iterator.next()).value)
    expect(tools.result.tools[0].name).toBe('ping')
  } finally { child.kill(); lines.close() }
}, 5000)
