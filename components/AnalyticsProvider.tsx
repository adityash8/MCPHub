'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { pageView } from '@/lib/analytics'
import { captureAttribution } from '@/lib/attribution'
import { trackViralArrival } from '@/lib/virality'

// Initialize PostHog
if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (posthogKey && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: false, // We handle manually
      capture_pageleave: true,
      autocapture: false, // Explicit tracking only
      session_recording: {
        maskAllInputs: true,
      },
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[PostHog] Initialized')
        }
      },
    })
  }
}

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Capture attribution params on every page
    captureAttribution()

    // Check for viral arrivals
    trackViralArrival()

    // Track page view
    pageView(pathname)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  )
}

