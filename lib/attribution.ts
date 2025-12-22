const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

const CLICK_IDS = [
  'gclid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
] as const

interface Attribution {
  firstTouch: Record<string, string>
  lastTouch: Record<string, string>
  touchCount: number
}

// Capture attribution on page load
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return { firstTouch: {}, lastTouch: {}, touchCount: 0 }
  }

  const params = new URLSearchParams(window.location.search)
  const currentTouch: Record<string, string> = {}

  // Capture UTMs
  UTM_PARAMS.forEach((param) => {
    const value = params.get(param)
    if (value) currentTouch[param] = value
  })

  // Capture click IDs
  CLICK_IDS.forEach((param) => {
    const value = params.get(param)
    if (value) currentTouch[param] = value
  })

  // Skip if no attribution params
  if (Object.keys(currentTouch).length === 0) {
    return getStoredAttribution()
  }

  // Get existing attribution
  const stored = getStoredAttribution()

  // First touch: only set once (never overwrite)
  if (Object.keys(stored.firstTouch).length === 0) {
    stored.firstTouch = {
      ...currentTouch,
      timestamp: new Date().toISOString(),
    }
  }

  // Last touch: always update
  stored.lastTouch = {
    ...currentTouch,
    timestamp: new Date().toISOString(),
  }
  stored.touchCount += 1

  // Persist to localStorage
  try {
    localStorage.setItem('attribution', JSON.stringify(stored))
  } catch (e) {
    // localStorage not available
  }

  return stored
}

function getStoredAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return { firstTouch: {}, lastTouch: {}, touchCount: 0 }
  }

  try {
    const stored = localStorage.getItem('attribution')
    return stored
      ? JSON.parse(stored)
      : { firstTouch: {}, lastTouch: {}, touchCount: 0 }
  } catch {
    return { firstTouch: {}, lastTouch: {}, touchCount: 0 }
  }
}

// Get attribution params for conversion events
export function getAttributionForEvent() {
  const { firstTouch, lastTouch, touchCount } = getStoredAttribution()

  return {
    // First touch
    first_touch_source: firstTouch.utm_source,
    first_touch_medium: firstTouch.utm_medium,
    first_touch_campaign: firstTouch.utm_campaign,
    first_touch_content: firstTouch.utm_content,
    first_touch_term: firstTouch.utm_term,

    // Last touch
    last_touch_source: lastTouch.utm_source,
    last_touch_medium: lastTouch.utm_medium,
    last_touch_campaign: lastTouch.utm_campaign,
    last_touch_content: lastTouch.utm_content,
    last_touch_term: lastTouch.utm_term,

    // Touch count
    touch_count: touchCount,

    // Click IDs for platform matching
    first_gclid: firstTouch.gclid,
    last_gclid: lastTouch.gclid,
    first_fbclid: firstTouch.fbclid,
    last_fbclid: lastTouch.fbclid,
  }
}

// Extract Meta cookies for CAPI
export function getMetaCookies() {
  if (typeof document === 'undefined') return {}

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return {
    fbc: cookies._fbc,
    fbp: cookies._fbp,
  }
}

