'use client'

import { MCP, Platform } from '@/lib/types'
import { X, Download, ChevronDown, Check } from 'lucide-react'
import { generateConfig, getConfigFileName } from '@/lib/config-generator'
import { useState } from 'react'
import ConfigGenerationModal from './ConfigGenerationModal'
import PostDownloadModal from './PostDownloadModal'
import EmailCaptureModal from './EmailCaptureModal'
import UpgradeModal from './UpgradeModal'

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
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  const isFreeTier = selectedMCPs.length <= maxFree
  const canAddMore = isFreeTier
  const isAtLimit = selectedMCPs.length >= maxFree

  const handleGenerateConfig = (platform: Platform) => {
    if (!isFreeTier) {
      setShowUpgradeModal(true)
      return
    }
    setSelectedPlatform(platform)
    setShowConfigModal(true)
    setShowPlatformMenu(false)
  }

  const handleConfigComplete = () => {
    // This will be called after download
    setShowConfigModal(false)
    setShowPostDownloadModal(true)
  }

  const handleEmailCapture = (email: string) => {
    setUserEmail(email)
    // In production, send to API
    console.log('Email captured:', email)
  }

  if (selectedMCPs.length === 0) {
    return null
  }

  return (
    <>
      {/* IKEA Effect - "Your Custom Stack" creates ownership */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Custom Stack
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMCPs.length}/{maxFree} selected
                </div>
                {isAtLimit && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Upgrade for unlimited →
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowPlatformMenu(!showPlatformMenu)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  <Download className="w-5 h-5" />
                  Generate Config
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showPlatformMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <button
                      onClick={() => handleGenerateConfig('cursor')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      Cursor
                    </button>
                    <button
                      onClick={() => handleGenerateConfig('claude-desktop')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Claude Desktop
                    </button>
                    <button
                      onClick={() => handleGenerateConfig('continue')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => handleGenerateConfig('cline')}
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

          {/* Selected MCPs with checkmarks (ownership signal) */}
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {selectedMCPs.map((mcp) => (
              <div
                key={mcp.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                <span>{mcp.name}</span>
                <button
                  onClick={() => onRemove(mcp)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Config Generation Modal - Peak-End Rule */}
      {selectedPlatform && (
        <ConfigGenerationModal
          isOpen={showConfigModal}
          onClose={() => {
            setShowConfigModal(false)
            setSelectedPlatform(null)
          }}
          selectedMCPs={selectedMCPs}
          platform={selectedPlatform}
          userName={userEmail ? userEmail.split('@')[0] : undefined}
          onEmailCapture={() => {
            setShowConfigModal(false)
            setShowEmailModal(true)
          }}
          onDownload={handleConfigComplete}
        />
      )}

      {/* Post Download Modal - Zeigarnik Effect */}
      <PostDownloadModal
        isOpen={showPostDownloadModal}
        onClose={() => setShowPostDownloadModal(false)}
        onEmailCapture={() => setShowEmailModal(true)}
      />

      {/* Email Capture Modal - Foot-in-the-Door */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailCapture}
      />

      {/* Upgrade Modal - Scarcity + Loss Aversion */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentCount={selectedMCPs.length}
        maxFree={maxFree}
      />
    </>
  )
}

