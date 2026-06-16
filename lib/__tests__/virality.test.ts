import { trackShare } from '../virality'
import { track } from '../analytics'

jest.mock('../analytics', () => ({
  track: jest.fn()
}))

describe('trackShare', () => {
  const originalWindow = global.window

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.window = originalWindow
  })

  it('generates share url and calls track with correct params', () => {
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          origin: 'https://mcphub.com'
        }
      },
      writable: true
    })

    const params = {
      contentType: 'mcp_config',
      contentId: '123',
      channel: 'twitter' as const,
      sharerId: 'user_456'
    }

    const shareUrl = trackShare(params)

    expect(shareUrl).toBe('https://mcphub.com/shared/123?ref=user_456')
    expect(track).toHaveBeenCalledWith('content_shared', {
      content_type: 'mcp_config',
      content_id: '123',
      share_channel: 'twitter',
      sharer_id: 'user_456',
      share_url: 'https://mcphub.com/shared/123?ref=user_456'
    })
  })

  it('returns empty string when window is undefined', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true
    })

    const params = {
      contentType: 'mcp_config',
      contentId: '123',
      channel: 'twitter' as const,
      sharerId: 'user_456'
    }

    const shareUrl = trackShare(params)

    expect(shareUrl).toBe('')
    expect(track).toHaveBeenCalledWith('content_shared', {
      content_type: 'mcp_config',
      content_id: '123',
      share_channel: 'twitter',
      sharer_id: 'user_456',
      share_url: ''
    })
  })
})
