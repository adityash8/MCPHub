import { track } from './analytics'

// Track when someone arrives via viral loop
export function trackViralArrival() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const sharerId = params.get('ref') || params.get('sharer_id')
  const inviteId = params.get('invite')

  if (sharerId || inviteId) {
    track('viral_arrival', {
      arrival_type: inviteId ? 'invite' : 'share',
      sharer_id: sharerId,
      invite_id: inviteId,
      landing_url: window.location.pathname,
    })

    // Store for attribution on signup
    try {
      if (sharerId) {
        localStorage.setItem('referrer_id', sharerId)
      }
      if (inviteId) {
        localStorage.setItem('invite_id', inviteId)
      }
    } catch {
      // localStorage not available
    }
  }
}
