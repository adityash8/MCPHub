import { track } from './analytics'

interface ActivationConfig {
  requiredActions: string[]
  windowDays: number
}

// Define YOUR activation criteria
const DEFAULT_CONFIG: ActivationConfig = {
  requiredActions: [
    'config_generated',
    'mcp_installed',
    'first_mcp_used',
  ],
  windowDays: 7,
}

export function trackActivationStep(
  action: string,
  config = DEFAULT_CONFIG
) {
  // Track the step
  track('activation_step_completed', {
    action,
    required_actions: config.requiredActions.join(','),
    window_days: config.windowDays,
  })

  // Get completed actions
  const completedActions = getCompletedActions()

  // Add this action if not already tracked
  if (!completedActions.includes(action)) {
    completedActions.push(action)
    saveCompletedActions(completedActions)
  }

  // Check if fully activated
  const isActivated = config.requiredActions.every((a) =>
    completedActions.includes(a)
  )

  if (isActivated) {
    track('user_activated', {
      days_to_activate: getDaysSinceSignup(),
      activation_path: completedActions.join(' → '),
      actions_completed: completedActions.length,
    })
  }

  return isActivated
}

function getCompletedActions(): string[] {
  try {
    const stored = localStorage.getItem('activation_actions')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCompletedActions(actions: string[]) {
  try {
    localStorage.setItem('activation_actions', JSON.stringify(actions))
  } catch {
    // localStorage not available
  }
}

function getDaysSinceSignup(): number {
  try {
    const signupDate = localStorage.getItem('signup_date')
    if (!signupDate) return 0

    const diff = Date.now() - new Date(signupDate).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

// Call on signup to set the date
export function recordSignupDate() {
  try {
    localStorage.setItem('signup_date', new Date().toISOString())
  } catch {
    // localStorage not available
  }
}

