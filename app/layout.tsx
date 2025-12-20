import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MCPHub - Discover and Manage MCP Servers',
  description: 'The central directory and management platform for Model Context Protocol (MCP) servers. Discover, configure, and monitor MCPs for Claude Desktop, Cursor, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

