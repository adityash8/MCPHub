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
 * Sanitizes a URL to ensure it uses a safe protocol (http or https).
 * Returns '#' if the URL uses an unsafe protocol (e.g., javascript:).
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#'

  try {
    const parsedUrl = new URL(url, 'http://localhost')
    const protocol = parsedUrl.protocol.toLowerCase()

    if (protocol === 'http:' || protocol === 'https:') {
      return url
    }

    // Log the attempted unsafe URL for monitoring
    console.warn('Attempted to use unsafe URL protocol:', protocol)
    return '#'
  } catch (error) {
    // If URL parsing fails, fail safe and return '#'
    return '#'
  }
}
