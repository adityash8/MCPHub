'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDownToLine, Check, Copy, ExternalLink, Search, X } from 'lucide-react'
import { mcps, searchMCPs } from '@/lib/mcps'
import { generateConfig, getConfigFileName, platforms } from '@/lib/config-generator'
import { MCP, MCPCategory, Platform, SavedConfig } from '@/lib/types'
import { PLATFORM_KEY, readSavedConfigs, saveConfig, SELECTION_KEY } from '@/lib/saved-configs'

const categories: (MCPCategory | 'All')[] = ['All', 'Developer', 'Productivity', 'Client workflows']
const safeLink = (url: string | null) => url && /^https:\/\//i.test(url) ? url : null

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<MCPCategory | 'All'>('All')
  const [sort, setSort] = useState<'name' | 'registry-update'>('name')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [platform, setPlatform] = useState<Platform>('cursor')
  const [detail, setDetail] = useState<MCP | null>(null)
  const [saved, setSaved] = useState<SavedConfig[]>([])
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const detailTrigger = useRef<HTMLElement | null>(null)
  function closeDetail() { setDetail(null); requestAnimationFrame(() => detailTrigger.current?.focus()) }
  const selected = useMemo(() => selectedIds.map(id => mcps.find(m => m.id === id)).filter((m): m is MCP => !!m), [selectedIds])
  const results = useMemo(() => searchMCPs(query, category === 'All' ? undefined : category).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt)), [query, category, sort])
  const output = useMemo(() => generateConfig(selected, platform), [selected, platform])
  const client = platforms.find(p => p.id === platform)!

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem(SELECTION_KEY) || '[]')
      if (Array.isArray(ids)) setSelectedIds(ids.filter((id): id is string => typeof id === 'string' && mcps.some(m => m.id === id)).slice(0, 3))
      const storedPlatform = localStorage.getItem(PLATFORM_KEY)
      if (platforms.some(p => p.id === storedPlatform)) setPlatform(storedPlatform as Platform)
      setSaved(readSavedConfigs(localStorage))
    } catch { setMessage('Saved selections could not be read. You can start a new config.') }
    setReady(true)
  }, [])
  useEffect(() => { if (ready) { try { localStorage.setItem(SELECTION_KEY, JSON.stringify(selectedIds)); localStorage.setItem(PLATFORM_KEY, platform) } catch { setMessage('Browser storage is unavailable. Your selection will last only until this tab closes.') } } }, [selectedIds, platform, ready])

  function toggle(mcp: MCP) {
    setMessage('')
    if (selectedIds.includes(mcp.id)) { setSelectedIds(selectedIds.filter(id => id !== mcp.id)); return }
    if (selectedIds.length >= 3) { setMessage('The free config holds up to three servers. Remove one to add another.'); return }
    setSelectedIds([...selectedIds, mcp.id])
  }
  function persist() {
    if (output.errors.length) { setMessage('Resolve the config issues before saving.'); return }
    try { setSaved(saveConfig(localStorage, platform, selectedIds, output.text, Object.fromEntries(selected.map(m => [m.id, m.version])))); setMessage('Version saved in this browser. It does not sync across devices.'); setShowSaved(true) }
    catch { setMessage('Could not save in this browser. Check storage permissions or available space.') }
  }
  function downloadSaved(item: SavedConfig) {
    const url = URL.createObjectURL(new Blob([item.content], { type: item.platform === 'continue' ? 'text/yaml' : 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = getConfigFileName(item.platform); link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Saved template downloaded. Check credentials and client settings before use.')
  }
  function restore(item: SavedConfig) {
    const ids = item.serverIds.filter(id => mcps.some(m => m.id === id))
    if (ids.length !== item.serverIds.length) { setMessage('This saved version contains a server no longer in the catalog.'); return }
    setSelectedIds(ids); setPlatform(item.platform); setShowPreview(true); setMessage('Selection restored. This preview uses current registry metadata; use Download saved for the exact saved version.')
  }
  async function copy() {
    if (output.errors.length || !output.text) return
    try { await navigator.clipboard.writeText(output.text); setMessage('Config copied. Replace any credential placeholders on your own device.') }
    catch { setMessage('Clipboard access failed. Select the preview text and copy it manually.') }
  }
  function download() {
    if (output.errors.length || !output.text) return
    const url = URL.createObjectURL(new Blob([output.text], { type: output.extension === 'yaml' ? 'text/yaml' : 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = getConfigFileName(platform); link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Template downloaded. Review the checklist before adding it to your client.')
  }

  return <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight focus-visible:outline-blue-600">MCPHub</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm"><Link href="/" className="hover:text-blue-600 focus-visible:outline-blue-600">Home</Link><a href="#config" className="font-medium text-blue-700 dark:text-blue-300">Your config</a></nav>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-7 max-w-3xl"><p className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">Official MCP Registry snapshot · 13 Oct 2026</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find a server. Build your config.</h1><p className="mt-3 text-gray-600 dark:text-gray-300">Browse {mcps.length} registry listings. Choose up to three, check what each needs, then export for your client. Registry metadata and generated config shape are checked. Connections, installation, package health, and security are untested.</p></div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Server directory" className="min-w-0">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <label htmlFor="search" className="mb-2 block text-sm font-medium">Search servers</label>
            <div className="relative"><Search aria-hidden="true" className="absolute left-3 top-3 h-5 w-5 text-gray-500"/><input id="search" type="search" maxLength={100} value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, description, publisher…" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-white"/></div>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">{categories.map(item => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${category === item ? 'border-blue-700 bg-blue-700 text-white' : 'border-gray-300 text-gray-700 hover:border-blue-500 dark:border-gray-600 dark:text-gray-200'}`}>{item}</button>)}</div><label htmlFor="sort" className="mt-4 block text-sm font-medium">Sort by</label><select id="sort" value={sort} onChange={event => setSort(event.target.value as typeof sort)} className="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-white"><option value="name">Name</option><option value="registry-update">Registry update</option></select>
          </div>
          <p className="my-4 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">{results.length} {results.length === 1 ? 'server' : 'servers'}{query ? ` for “${query}”` : ''}</p>
          {results.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600"><p className="font-medium">No servers match these filters.</p><button onClick={() => { setQuery(''); setCategory('All') }} className="mt-2 text-blue-700 underline dark:text-blue-300">Clear search and category</button></div> :
          <div className="grid gap-3 sm:grid-cols-2">{results.map(mcp => <article key={mcp.id} className={`min-w-0 rounded-xl border bg-white p-4 dark:bg-gray-800 ${selectedIds.includes(mcp.id) ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-start gap-3"><input id={`select-${mcp.id}`} type="checkbox" aria-label={`Select ${mcp.name}`} checked={selectedIds.includes(mcp.id)} onChange={() => toggle(mcp)} className="mt-1 h-5 w-5 shrink-0 accent-blue-600"/><div className="min-w-0 flex-1"><h2 className="break-words font-semibold leading-snug">{mcp.name}</h2><p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">{mcp.id}</p></div></div>
            <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm text-gray-600 dark:text-gray-300">{mcp.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs"><span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{mcp.category}</span><span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{mcp.packages.length ? 'stdio package' : 'remote URL'}</span><span className="text-gray-500 dark:text-gray-400">v{mcp.version}</span><span className="text-gray-500 dark:text-gray-400">Registry update {mcp.updatedAt.slice(0, 10)}</span></div>
            <button onClick={event => { detailTrigger.current = event.currentTarget; setDetail(mcp) }} className="mt-4 text-sm font-medium text-blue-700 hover:underline focus-visible:outline-blue-600 dark:text-blue-300">View setup details</button>
          </article>)}</div>}
        </section>
        <aside id="config" className="min-w-0 lg:sticky lg:top-5 lg:self-start" aria-label="Your config">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-2"><div><h2 className="text-lg font-semibold">Your config</h2><p className="text-sm text-gray-600 dark:text-gray-300">{selected.length}/3 selected · saved on this device</p></div><button onClick={() => setShowSaved(!showSaved)} className="text-sm text-blue-700 underline dark:text-blue-300">Saved versions ({saved.length})</button></div>
            {showSaved && <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">{saved.length ? <ul className="space-y-2">{saved.map(item => <li key={item.id} className="flex items-center justify-between gap-3 text-sm"><span>{item.label}<small className="block text-gray-500">{Object.values(item.serverVersions).join(", ")} · </small><small className="block text-gray-500">{new Date(item.createdAt).toLocaleString()}</small></span><span className="flex flex-col gap-1"><button onClick={() => restore(item)} className="text-blue-700 underline dark:text-blue-300">Restore selection</button><button onClick={() => downloadSaved(item)} className="text-blue-700 underline dark:text-blue-300">Download saved</button></span></li>)}</ul> : <p className="text-sm text-gray-600 dark:text-gray-300">No saved versions yet. Select servers and save a valid config.</p>}</div>}
            {selected.length ? <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">{selected.map(mcp => <li key={mcp.id} className="flex items-center justify-between gap-2 py-2 text-sm"><span className="min-w-0 break-words">{mcp.name}</span><button onClick={() => toggle(mcp)} aria-label={`Remove ${mcp.name}`} className="rounded p-2 hover:bg-gray-100 focus-visible:outline-blue-600 dark:hover:bg-gray-700"><X className="h-4 w-4"/></button></li>)}</ul> : <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">Select a server from the directory to begin.</p>}
            <label htmlFor="platform" className="mt-5 block text-sm font-medium">Client</label><select id="platform" value={platform} onChange={e => { setPlatform(e.target.value as Platform); setShowPreview(false) }} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-white">{platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            {selected.length > 0 && output.errors.length > 0 && <div role="alert" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"><strong>Export blocked</strong><ul className="mt-1 list-disc space-y-1 pl-5">{output.errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
            {selected.length > 0 && output.checklist.length > 0 && <div className="mt-4 text-sm"><h3 className="font-medium">Before installation</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300">{output.checklist.map(item => <li key={item}>{item}</li>)}</ul></div>}
            <button disabled={!!output.errors.length} onClick={() => setShowPreview(!showPreview)} className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400">{showPreview ? 'Hide config preview' : 'Preview config'}</button>
            {showPreview && !output.errors.length && <div className="mt-4"><p className="mb-2 text-xs text-gray-600 dark:text-gray-300">{client.file} · merge into your existing config</p><pre tabIndex={0} className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-3 text-xs leading-relaxed text-gray-100"><code>{output.text}</code></pre><div className="mt-3 grid grid-cols-3 gap-2"><button onClick={copy} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-2 py-2 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"><Copy className="h-4 w-4"/>Copy</button><button onClick={download} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-2 py-2 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"><ArrowDownToLine className="h-4 w-4"/>Download</button><button onClick={persist} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-2 py-2 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"><Check className="h-4 w-4"/>Save</button></div></div>}
            <div className="mt-5 border-t border-gray-200 pt-4 text-sm dark:border-gray-700"><h3 className="font-medium">Install in {client.name}</h3><p className="mt-1 text-gray-600 dark:text-gray-300">{client.instructions}</p><a href={client.docs} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-blue-700 underline dark:text-blue-300">Client documentation <ExternalLink className="h-3 w-3"/></a></div>
          </div>
          {message && <p role="status" className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800">{message}</p>}
        </aside>
      </div>
    </main>
    {detail && <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/70 p-3" onMouseDown={e => { if (e.target === e.currentTarget) closeDetail() }}><section role="dialog" aria-modal="true" aria-labelledby="detail-title" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closeDetail() } else if (event.key === 'Tab') { const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')); const first = controls[0], last = controls[controls.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() } } }} className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 text-gray-900 shadow-xl dark:bg-gray-800 dark:text-gray-100 sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 id="detail-title" className="break-words text-xl font-bold">{detail.name}</h2><p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">{detail.id}</p></div><button autoFocus onClick={closeDetail} aria-label="Close details" className="rounded p-2 hover:bg-gray-100 focus-visible:outline-blue-600 dark:hover:bg-gray-700"><X/></button></div><p className="mt-4 text-gray-700 dark:text-gray-200">{detail.description}</p><p className="mt-3 text-sm"><strong>Why included:</strong> {detail.reason}</p><dl className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-200 py-4 text-sm dark:border-gray-700"><div><dt className="text-gray-500 dark:text-gray-400">Registry version</dt><dd className="font-medium">{detail.version}</dd></div><div><dt className="text-gray-500 dark:text-gray-400">Transport</dt><dd className="font-medium">{detail.packages.length ? detail.packages.map(pkg => pkg.transport).join(', ') : detail.remotes.map(remote => remote.type).join(', ')}</dd></div></dl>{detail.packages.map(pkg => <div key={pkg.identifier} className="mt-4 text-sm"><h3 className="font-semibold">Package</h3><code className="mt-1 block break-all rounded bg-gray-100 p-2 dark:bg-gray-900">{pkg.identifier}@{pkg.version}</code>{pkg.environmentVariables.filter(v => v.required).length > 0 && <><h3 className="mt-3 font-semibold">Required environment variables</h3><ul className="mt-1 list-disc pl-5">{pkg.environmentVariables.filter(v => v.required).map(v => <li key={v.name}><code>{v.name}</code>: {v.description}</li>)}</ul></>}</div>)}{detail.remotes.map(remote => <div key={remote.url} className="mt-4 text-sm"><h3 className="font-semibold">Remote endpoint</h3><p className="break-all">{remote.url}</p>{remote.headers.filter(h => h.required).map(h => <p key={h.name} className="mt-1 text-amber-700 dark:text-amber-300">Requires {h.name} header. {h.description}</p>)}</div>)}<div className="mt-5 flex flex-wrap gap-4 text-sm">{safeLink(detail.repositoryUrl) && <a href={detail.repositoryUrl!} target="_blank" rel="noreferrer noopener" className="text-blue-700 underline dark:text-blue-300">Source repository</a>}{safeLink(detail.websiteUrl) && <a href={detail.websiteUrl!} target="_blank" rel="noreferrer noopener" className="text-blue-700 underline dark:text-blue-300">Publisher website</a>}{safeLink(detail.provenance.publisherReadmeUrl) && <a href={detail.provenance.publisherReadmeUrl!} target="_blank" rel="noreferrer noopener" className="text-blue-700 underline dark:text-blue-300">Publisher README</a>}<a href={detail.provenance.registryUrl} target="_blank" rel="noreferrer noopener" className="text-blue-700 underline dark:text-blue-300">Registry source</a></div><p className="mt-5 text-xs text-gray-500 dark:text-gray-400">{detail.provenance.scope}</p><button onClick={() => toggle(detail)} className="mt-5 rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white hover:bg-blue-800 focus-visible:outline-blue-600">{selectedIds.includes(detail.id) ? 'Remove from config' : 'Add to config'}</button></section></div>}
  </div>
}
