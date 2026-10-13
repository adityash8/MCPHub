import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const salt = process.env.MCPHUB_RATE_LIMIT_SECRET
  if (!url || !key || !salt) return NextResponse.json({ error: 'Email updates are not available yet. Please try later.' }, { status: 503 })
  let email: string
  try {
    if (Number(request.headers.get('content-length') || 0) > 2048) throw new Error()
    if (!request.body) throw new Error()
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 2048) { await reader.cancel(); throw new Error() }
      chunks.push(value)
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error()
  } catch { return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 }) }
  const ip = request.headers.get('x-vercel-forwarded-for')?.trim()
  if (!ip || !isIP(ip)) return NextResponse.json({ error: 'Email updates are temporarily unavailable. Please try later.' }, { status: 503 })
  const ipHash = createHmac('sha256', salt).update(ip).digest('hex')
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { error } = await supabase.rpc('mcphub_capture_email', { p_email: email, p_ip_hash: ipHash })
  if (error) {
    if (error.code === 'P0001') return NextResponse.json({ error: 'Too many requests. Try again tomorrow.' }, { status: 429 })
    return NextResponse.json({ error: 'Could not save your email. Please try later.' }, { status: 503 })
  }
  return NextResponse.json({ saved: true })
}
