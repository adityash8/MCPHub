# Analytics Implementation Guide

This document describes the analytics stack implementation for MCPHub.

## Architecture

```
Browser → dataLayer → GTM Web Container
    ↓
PostHog (direct)
    ↓
GTM Server (gtm.yourdomain.com)
    ↓
GA4 + Google Ads + Meta CAPI
```

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
# GTM
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GTM_SERVER_URL=https://gtm.yourdomain.com

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 2. Install Dependencies

```bash
npm install
```

PostHog packages are already in `package.json`.

### 3. GTM Server Container Setup

1. Create Server Container in Google Tag Manager
2. Deploy to Stape.io (or similar)
3. Configure custom domain: `gtm.yourdomain.com`
4. Set up tags for GA4, Google Ads, Meta CAPI

## Event Tracking

### Core Events

All events use `track(eventName, params)`:

```typescript
import { track } from '@/lib/analytics'

// Page view (automatic via AnalyticsProvider)
track('page_view', { page_path: '/directory' })

// User actions
track('mcp_selected', { mcp_id: 'github', mcp_name: 'GitHub' })
track('config_generated', { platform: 'cursor', mcp_count: 3 })
track('sign_up_started', { method: 'email_capture' })
```

### Activation Tracking

```typescript
import { trackActivationStep } from '@/lib/activation'


// On key actions
trackActivationStep('config_generated')
trackActivationStep('mcp_installed')
```

### Attribution

Attribution is automatically captured on page load. UTMs and click IDs are stored in localStorage and attached to all events.

## Current Tracking Points

### Landing Page
- `sign_up_started` - Email form submission

### Directory Page
- `mcp_search` - Search query entered
- `mcp_filter_applied` - Category filter selected
- `mcp_detail_viewed` - MCP card clicked
- `mcp_selected` - MCP added/removed from selection

### Selection Panel
- `config_generated` - Config downloaded
- `config_copied` - Config copied to clipboard
- `upgrade_modal_viewed` - Upgrade prompt shown

## Event Taxonomy

All events use `snake_case` naming:

- `page_view`
- `sign_up_started`
- `sign_up`
- `mcp_selected`
- `mcp_detail_viewed`
- `config_generated`
- `config_copied`
- `upgrade_modal_viewed`
- `activation_step_completed`
- `user_activated`

## Debugging

### Browser Console

```javascript
// Check dataLayer
console.table(window.dataLayer)

// Filter events
window.dataLayer.filter(e => e.event === 'app_event')

// Check PostHog
posthog.get_distinct_id()
```

### GTM Preview Mode

1. Go to tagmanager.google.com
2. Click Preview
3. Enter site URL
4. Check Tags Fired, Variables, Data Layer

### GA4 DebugView

1. GA4 → Admin → DebugView
2. Events appear in real-time
3. Check event parameters

## Next Steps

1. Set up GTM Server Container
2. Configure GA4 tags in GTM
3. Set up Google Ads conversion tracking
4. Configure Meta CAPI
5. Test all events in production
6. Set up PostHog dashboards

## PLG Funnel Events

### Discover → Start
- `page_view`
- `pricing_page_view`
- `sign_up_started`

### Start → Activate
- `sign_up`
- `config_generated`
- `mcp_installed`
- `user_activated`

### Activate → Convert
- `upgrade_modal_viewed`
- `checkout_started`
- `purchase`

### Scale
- `team_invite_sent`
- `content_shared`

