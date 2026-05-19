import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * Sanitizes a URL to prevent javascript: URI Cross-Site Scripting (XSS) payloads.
 * Explicitly validates that the protocol is either http: or https:.
 * Returns a safe fallback URL ('#') if validation fails.
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '#'
  try {
    const parsed = new URL(url, 'https://example.com') // Base URL handles relative paths
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return '#'
  } catch (e) {
    // If URL parsing fails, return safe fallback
    return '#'
  }
}
