'use client'

import { MCP, Platform } from '@/lib/types'
import { X, Download, ChevronDown } from 'lucide-react'
import { generateConfig, getConfigFileName, getConfigInstructions } from '@/lib/config-generator'
import { useState } from 'react'
import { track } from '@/lib/analytics'
import { trackActivationStep } from '@/lib/activation'

interface SelectionPanelProps {
  selectedMCPs: MCP[]
  onRemove: (mcp: MCP) => void
  onClear: () => void
  maxFree: number
}

export default function SelectionPanel({
  selectedMCPs,
  onRemove,
  onClear,
  maxFree,
}: SelectionPanelProps) {
  const [showPlatformMenu, setShowPlatformMenu] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)

  const isFreeTier = selectedMCPs.length <= maxFree
  const canAddMore = isFreeTier

  const handleDownload = (platform: Platform) => {
    const config = generateConfig(selectedMCPs, platform)
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = getConfigFileName(platform)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // Track config generation
    track('config_generated', {
      platform,
      mcp_count: selectedMCPs.length,
      mcp_ids: selectedMCPs.map((m) => m.id).join(','),
    })
    
    // Track activation step
    trackActivationStep('config_generated')
    
    setSelectedPlatform(platform)
    setShowInstructions(true)
    setShowPlatformMenu(false)
  }

  const handleCopyToClipboard = (platform: Platform) => {
    const config = generateConfig(selectedMCPs, platform)
    navigator.clipboard.writeText(config)
    
    // Track copy action
    track('config_copied', {
      platform,
      mcp_count: selectedMCPs.length,
    })
    
    setSelectedPlatform(platform)
    setShowInstructions(true)
    setShowPlatformMenu(false)
  }

  if (selectedMCPs.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedMCPs.length} MCP{selectedMCPs.length !== 1 ? 's' : ''} Selected
            </h3>
            {!canAddMore && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Free tier limit reached ({maxFree} MCPs). Upgrade to Pro for unlimited.
              </p>
            )}
            {selectedMCPs.length >= maxFree && (
              <button
                onClick={() => {
                  track('upgrade_modal_viewed', {
                    trigger: 'mcp_limit_reached',
                    current_plan: 'free',
                    mcp_count: selectedMCPs.length,
                  })
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                Upgrade for unlimited →
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowPlatformMenu(!showPlatformMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Generate Config
                <ChevronDown className="w-4 h-4" />
              </button>
              {showPlatformMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <button
                    onClick={() => handleDownload('claude-desktop')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                  >
                    Claude Desktop
                  </button>
                  <button
                    onClick={() => handleDownload('cursor')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cursor
                  </button>
                  <button
                    onClick={() => handleDownload('continue')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => handleDownload('cline')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    Cline
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClear}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {showInstructions && selectedPlatform && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Setup Instructions
            </h4>
            <pre className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line mb-2">
              {getConfigInstructions(selectedPlatform)}
            </pre>
            <button
              onClick={() => {
                const config = generateConfig(selectedMCPs, selectedPlatform)
                navigator.clipboard.writeText(config)
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy config to clipboard
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              className="ml-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {selectedMCPs.map((mcp) => (
            <div
              key={mcp.id}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm"
            >
              <span>{mcp.name}</span>
              <button
                onClick={() => onRemove(mcp)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

