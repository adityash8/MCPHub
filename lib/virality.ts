import { track } from './analytics'

type ShareChannel = 'email' | 'twitter' | 'linkedin' | 'slack' | 'link_copy'
type InviteType = 'team' | 'referral' | 'collaboration'

// Track when user shares content
export function trackShare(params: {
  contentType: string
  contentId: string
  channel: ShareChannel
  sharerId: string
}) {
  const shareUrl = generateShareUrl(params.contentId, params.sharerId)

  track('content_shared', {
    content_type: params.contentType,
    content_id: params.contentId,
    share_channel: params.channel,
    sharer_id: params.sharerId,
    share_url: shareUrl,
  })

  return shareUrl
}

// Track team/referral invites
export function trackInvite(params: {
  inviteType: InviteType
  inviterId: string
  inviteCount: number
  channel: 'email' | 'link'
}) {
  track('invite_sent', {
    invite_type: params.inviteType,
    inviter_id: params.inviterId,
    invite_count: params.inviteCount,
    invite_channel: params.channel,
  })
}

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

// Generate trackable share URLs
function generateShareUrl(contentId: string, sharerId: string): string {
  if (typeof window === 'undefined') return ''
  const base = `${window.location.origin}/shared/${contentId}`
  return `${base}?ref=${sharerId}`
}

