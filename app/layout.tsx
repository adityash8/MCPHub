import type { Metadata } from 'next'
import './globals.css'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'

export const metadata: Metadata = {
  title: 'MCPHub - Discover and Manage MCP Servers',
  description: 'The central directory and management platform for Model Context Protocol (MCP) servers. Discover, configure, and monitor MCPs for Claude Desktop, Cursor, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gtmServerUrl = process.env.NEXT_PUBLIC_GTM_SERVER_URL || 'https://www.googletagmanager.com'

  return (
    <html lang="en">
      <head>
        {/* GTM - Use custom domain if available */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                '${gtmServerUrl}/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased">
        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`${gtmServerUrl}/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  )
}

