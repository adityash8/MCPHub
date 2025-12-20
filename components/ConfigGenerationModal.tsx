'use client'

import { useState, useEffect } from 'react'
import { MCP, Platform } from '@/lib/types'
import { generateConfig } from '@/lib/config-generator'
import { triggerConfetti } from '@/lib/utils'
import { X, Copy, Check, Download } from 'lucide-react'

interface ConfigGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedMCPs: MCP[]
  platform: Platform
  userName?: string
  onEmailCapture?: () => void
  onDownload?: () => void
}

const progressMessages = [
  'Searching 32 MCP servers...',
  'Validating compatibility...',
  'Optimizing for Cursor...',
  'Finalizing your config...',
]

export default function ConfigGenerationModal({
  isOpen,
  onClose,
  selectedMCPs,
  platform,
  userName,
  onEmailCapture,
  onDownload,
}: ConfigGenerationModalProps) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setStep(0)
      setConfig('')
      setCopied(false)
      setShowSuccess(false)
      return
    }

    // Simulate progress (Peak-End Rule - Labor Illusion)
    const progressInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < progressMessages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 800)

    // Generate config after progress
    const generateTimeout = setTimeout(() => {
      const generatedConfig = generateConfig(selectedMCPs, platform)
      setConfig(generatedConfig)
      setShowSuccess(true)
      triggerConfetti()
    }, progressMessages.length * 800 + 500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(generateTimeout)
    }
  }, [isOpen, selectedMCPs, platform])

  const handleCopy = () => {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!config) return
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cursor_mcp_config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    if (onDownload) {
      setTimeout(() => {
        onDownload()
      }, 300)
    }
  }

  if (!isOpen) return null

  const displayName = userName || 'Your'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showSuccess ? '✓ Config Ready!' : 'Generating Your Config'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {!showSuccess ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {progressMessages[step]}
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / progressMessages.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Endowment Effect - Make it feel like THEIRS */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                      {displayName}'s Cursor Config
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Built just now with your {selectedMCPs.length} selection{selectedMCPs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Syntax-highlighted config preview */}
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{config}</code>
                </pre>
              </div>

              {/* Peak moment - Big CTA (Fitts's Law) */}
              <div className="space-y-3">
                <button
                  onClick={handleCopy}
                  className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download JSON
                </button>
              </div>

              {onEmailCapture && (
                <div className="text-center pt-2">
                  <button
                    onClick={onEmailCapture}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Get setup reminders →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

