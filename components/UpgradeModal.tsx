'use client'

import { X, Zap, Shield, RefreshCw, Headphones } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentCount: number
  maxFree: number
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentCount,
  maxFree,
}: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  You've hit the {maxFree} MCP limit
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Loss Aversion framing */}
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Upgrade to Pro to add unlimited MCPs.{' '}
            <strong className="text-gray-900 dark:text-white">
              Don't lose your momentum
            </strong>
          </p>

          {/* Feature list with Anchoring */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Unlimited MCPs
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  You wanted to add {currentCount - maxFree} more
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Health monitoring
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Saves 4hrs/month debugging
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="font-semibold text-gray-900 dark:text-white">
                Sync across devices
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Headphones className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="font-semibold text-gray-900 dark:text-white">
                Priority support
              </div>
            </div>
          </div>

          {/* Hyperbolic Discounting - Free trial */}
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
              Unlock for $12/mo
            </button>
            <button className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold">
              Start 7-day free trial →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

