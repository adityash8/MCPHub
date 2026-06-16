import { track } from './analytics'

export const REFERRAL_EVENTS = {
  // Referrer actions
  referral_link_generated: 'referral_link_generated',
  referral_link_copied: 'referral_link_copied',
  referral_link_shared: 'referral_link_shared',

  // Referee journey
  referral_link_clicked: 'referral_link_clicked',
  referral_signup: 'referral_signup',
  referral_activated: 'referral_activated',
  referral_converted: 'referral_converted',

  // Reward fulfillment
  referral_reward_earned: 'referral_reward_earned',
  referral_reward_claimed: 'referral_reward_claimed',
} as const

type ReferralEvent = keyof typeof REFERRAL_EVENTS

export function trackReferral(
  event: ReferralEvent,
  params: {
    referrerId?: string
    refereeId?: string
    rewardType?: string
    rewardValue?: number
  } = {}
) {
  track(REFERRAL_EVENTS[event], {
    ...params,
    referral_program_version: 'v1', // useful for A/B tests
  })
}

