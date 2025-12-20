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

export function getHealthStatus(mcpId: string): 'healthy' | 'degraded' | 'down' | 'unknown' {
  // Simulate health status - in production, this would check real health
  const statuses: Record<string, 'healthy' | 'degraded' | 'down' | 'unknown'> = {
    'github': 'healthy',
    'filesystem': 'healthy',
    'slack': 'degraded',
    'gmail': 'healthy',
    'notion': 'healthy',
  }
  return statuses[mcpId] || 'unknown'
}

export function calculateTrendingScore(mcp: { upvotes?: number; rating?: number; githubStars?: number; lastUpdated?: string }): number {
  let score = 0
  if (mcp.upvotes) score += mcp.upvotes * 2
  if (mcp.rating) score += mcp.rating * 100
  if (mcp.githubStars) score += mcp.githubStars * 0.1
  if (mcp.lastUpdated) {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(mcp.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceUpdate < 7) score += 500
    else if (daysSinceUpdate < 30) score += 200
  }
  return score
}

export function triggerConfetti() {
  // Simple confetti effect using CSS animations
  if (typeof window === 'undefined') return
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.position = 'fixed'
    confetti.style.left = Math.random() * 100 + '%'
    confetti.style.top = '-10px'
    confetti.style.width = '10px'
    confetti.style.height = '10px'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = '50%'
    confetti.style.pointerEvents = 'none'
    confetti.style.zIndex = '9999'
    confetti.style.animation = `confetti-fall ${1 + Math.random() * 2}s linear forwards`
    
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 3000)
  }
  
  // Add animation if not exists
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style')
    style.id = 'confetti-styles'
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

export function getUserInitials(email?: string): string {
  if (!email) return 'U'
  const parts = email.split('@')[0].split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email[0].toUpperCase()
}

