import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { POST } from './route'

const mockRpc = jest.fn().mockResolvedValue({ error: null })
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => ({ rpc: mockRpc })) }))

const originalEnv = { ...process.env }

beforeEach(() => {
  process.env.SUPABASE_URL = 'https://example.invalid'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-placeholder'
  process.env.MCPHUB_RATE_LIMIT_SECRET = 'test-only-placeholder'
  mockRpc.mockClear()
  jest.mocked(createClient).mockClear()
})

afterAll(() => { process.env = originalEnv })

function request(ip?: string, forwardedFor?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (ip !== undefined) headers['x-vercel-forwarded-for'] = ip
  if (forwardedFor !== undefined) headers['x-forwarded-for'] = forwardedFor
  return new NextRequest('https://example.invalid/api/email-capture', {
    method: 'POST', headers, body: JSON.stringify({ email: 'person@example.com' }),
  })
}

test('trusted client IPs get distinct quota keys and repeated IPs keep the same key', async () => {
  for (const ip of ['192.0.2.10', '2001:db8::10', '192.0.2.10']) {
    expect((await POST(request(ip))).status).toBe(200)
  }
  const hashes = mockRpc.mock.calls.map(([, args]) => args.p_ip_hash)
  expect(hashes[0]).not.toBe(hashes[1])
  expect(hashes[0]).toBe(hashes[2])
  expect(hashes[0]).toMatch(/^[a-f0-9]{64}$/)
  expect(mockRpc).toHaveBeenCalledTimes(3)
})

test.each([
  ['missing Vercel header', undefined, '198.51.100.8'],
  ['empty Vercel header', '', undefined],
  ['invalid Vercel header', 'unknown', undefined],
  ['comma-separated Vercel header', '192.0.2.10, 198.51.100.8', undefined],
])('%s fails closed before database access', async (_case, ip, forwardedFor) => {
  const response = await POST(request(ip, forwardedFor))
  expect(response.status).toBe(503)
  expect(await response.json()).toEqual({ error: 'Email updates are temporarily unavailable. Please try later.' })
  expect(createClient).not.toHaveBeenCalled()
  expect(mockRpc).not.toHaveBeenCalled()
})
