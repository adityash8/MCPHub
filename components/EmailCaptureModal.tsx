'use client'

import { useState } from 'react'
import { Mail, X } from 'lucide-react'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onSubmit(email)
      setEmail('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Get Setup Reminders
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We'll send you installation steps in 5 minutes. No spam, just helpful reminders.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Send Me the Guide
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

