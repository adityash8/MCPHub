'use client'

import Link from 'next/link'
import { Search, Zap, Shield, Download } from 'lucide-react'
import { track } from '@/lib/analytics'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MCPHub
              </h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/directory"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Browse MCPs
              </Link>
              <Link
                href="/directory"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The MCP Marketplace
            <br />
            <span className="text-blue-600">+ Health Monitoring</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover, configure, and monitor Model Context Protocol servers in under 2 minutes.
            Stop hunting GitHub repos and editing JSON files manually.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/directory"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Browse MCPs
            </Link>
            <Link
              href="/directory"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-lg font-semibold"
            >
              Try Free
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Curated Directory
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              50+ verified MCPs, categorized and searchable. No more GitHub hunting.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              One-Click Configs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generate working configs for Claude Desktop, Cursor, and more in seconds.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Health Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get alerts when MCPs break before they impact your workflow.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Weekly digests and notifications keep you current with the ecosystem.
            </p>
          </div>
        </div>

        {/* Email Capture Section */}
        <div className="mt-32 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to streamline your MCP workflow?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join developers who've saved hours of setup time
          </p>
          <form
            action="/api/email-capture"
            method="post"
            className="max-w-md mx-auto mb-6"
            onSubmit={(e) => {
              const form = e.currentTarget
              const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]')
              if (emailInput?.value) {
                track('sign_up_started', {
                  method: 'email_capture',
                })
              }
            }}
          >
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Get Started
              </button>
            </div>
          </form>
          <Link
            href="/directory"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Or browse MCPs directly →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 MCPHub. Built for the AI development community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

