// Generate referral link for user
export function generateReferralLink(userId: string): string {
  if (typeof window === 'undefined') return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/signup?ref=${userId}`
}
