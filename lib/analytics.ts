import posthog from 'posthog-js'
import { getAttributionForEvent } from './attribution'

// Event params interface
interface TrackParams {
  [key: string]: string | number | boolean | undefined | null
}

// User data for Enhanced Conversions
interface UserData {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  country?: string
}

// Generate UUID for event deduplication
function generateEventId(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Main track function - sends to both dataLayer and PostHog
export function track(eventName: string, params: TrackParams = {}) {
  if (typeof window === 'undefined') return

  const eventId = generateEventId()
  const timestamp = new Date().toISOString()

  // Get attribution data
  const attribution = getAttributionForEvent()

  // Build payload
  const payload = {
    event: 'app_event',
    event_name: eventName,
    event_id: eventId,
    event_timestamp: timestamp,
    ...params,
    ...attribution,
  }

  // Push to GTM dataLayer
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)

  // Send to PostHog
  if (posthog.__loaded) {
    posthog.capture(eventName, {
      ...params,
      event_id: eventId,
      ...attribution,
    })
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, payload)
  }
}

// Identify user after auth
export function identify(userId: string, traits: TrackParams = {}) {
  if (typeof window === 'undefined') return

  // PostHog identify
  if (posthog.__loaded) {
    posthog.identify(userId, traits)
  }

  // Push to dataLayer for GTM
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'user_identified',
    user_id: userId,
    ...traits,
  })
}

// Set user data for Enhanced Conversions
export function setUserData(userData: UserData) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'user_data_set',
    user_data: {
      email: userData.email,
      phone_number: userData.phone_number,
      address: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        country: userData.country,
      },
    },
  })
}

// Track page views
export function pageView(path?: string) {
  if (typeof window === 'undefined') return

  const pagePath = path || window.location.pathname
  const pageTitle = document.title

  track('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    referrer: document.referrer,
  })
}

// TypeScript: Extend window
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

