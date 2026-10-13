'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Search, Download, Bookmark, ExternalLink } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  async function subscribe(event: FormEvent) {
    event.preventDefault(); setSending(true); setStatus('')
    try {
      const response = await fetch('/api/email-capture', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Could not save your email.') }
      setStatus('Email saved. We will contact you about MCPHub updates.'); setEmail('')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save your email. Please try again.') }
    finally { setSending(false) }
  }
  return <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><Link href="/" className="text-xl font-bold">MCPHub</Link><Link href="/directory" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">Browse servers</Link></div></header>
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"><div className="max-w-3xl"><p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-300">MCP directory and config builder</p><h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">From registry listing to client config.</h1><p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">Search 51 current entries from the official MCP Registry. Check package, transport, and credential requirements. Build a config for Claude Desktop, Cursor, Cline, or Continue.</p><Link href="/directory" className="mt-8 inline-flex rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">Browse the directory</Link></div>
      <section className="mt-20 border-t border-gray-200 pt-10 dark:border-gray-700" aria-labelledby="workflow"><h2 id="workflow" className="text-2xl font-semibold">How it works</h2><div className="mt-6 grid gap-6 md:grid-cols-3"><div><Search className="mb-3 h-6 w-6 text-blue-700 dark:text-blue-300"/><h3 className="font-semibold">Find a server</h3><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Search registry metadata and read the publisher’s setup details.</p></div><div><Download className="mb-3 h-6 w-6 text-blue-700 dark:text-blue-300"/><h3 className="font-semibold">Export a config</h3><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Select up to three servers. Unsupported client and auth combinations are blocked before export.</p></div><div><Bookmark className="mb-3 h-6 w-6 text-blue-700 dark:text-blue-300"/><h3 className="font-semibold">Keep a local version</h3><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Save selections in this browser and restore them later. Credentials stay on your device.</p></div></div></section>
      <section className="mt-20 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8" aria-labelledby="updates"><div className="grid gap-6 md:grid-cols-2"><div><h2 id="updates" className="text-2xl font-semibold">Get MCPHub updates</h2><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Leave your email for product updates. This does not create an account or turn on health alerts.</p></div><form onSubmit={subscribe}><label htmlFor="email" className="block text-sm font-medium">Email address</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="email" type="email" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-white"/><button disabled={sending} className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:bg-gray-400">{sending ? 'Saving…' : 'Get updates'}</button></div><p role="status" className="mt-2 min-h-5 text-sm text-gray-600 dark:text-gray-300">{status}</p></form></div></section>
    </main><footer className="border-t border-gray-200 py-7 dark:border-gray-700"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-gray-600 dark:text-gray-300 sm:px-6"><span>MCPHub · Registry snapshot dated 13 Oct 2026</span><a href="https://registry.modelcontextprotocol.io" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 underline">Official MCP Registry <ExternalLink className="h-3 w-3"/></a></div></footer>
  </div>
}
