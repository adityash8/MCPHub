'use client'

import { CheckCircle, Circle, Mail } from 'lucide-react'
import { useState } from 'react'

interface PostDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  onEmailCapture: () => void
}

export default function PostDownloadModal({
  isOpen,
  onClose,
  onEmailCapture,
}: PostDownloadModalProps) {
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onEmailCapture()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Almost There! 🎉
          </h2>

          {/* Zeigarnik Effect - Incomplete checklist creates tension */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">Config generated</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">Downloaded JSON</span>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Install in Cursor</span>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Enable health monitoring</span>
            </div>
          </div>

          {/* Foot-in-the-Door - Small ask first */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Get setup reminders (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                We'll send you installation steps in 5 minutes
              </p>
            </div>
          </form>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                onEmailCapture()
                onClose()
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign up to track installation →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

