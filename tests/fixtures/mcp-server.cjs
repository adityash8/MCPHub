const readline = require('node:readline')
const input = readline.createInterface({ input: process.stdin })
input.on('line', line => {
  const request = JSON.parse(line)
  const result = request.method === 'initialize'
    ? { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'local-fixture', version: '1.0.0' } }
    : request.method === 'tools/list' ? { tools: [{ name: 'ping', description: 'Returns pong', inputSchema: { type: 'object' } }] } : null
  if (request.id !== undefined) process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result }) + '\n')
})
