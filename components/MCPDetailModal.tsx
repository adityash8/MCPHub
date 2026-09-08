'use client'

import { MCP, Platform } from '@/lib/types'
import { X, Star, ExternalLink, Calendar, ThumbsUp, Tag } from 'lucide-react'
import { formatDate, formatNumber, sanitizeUrl } from '@/lib/utils'

interface MCPDetailModalProps {
  mcp: MCP
  isOpen: boolean
  onClose: () => void
  isSelected: boolean
  onToggle: (mcp: MCP) => void
}

export default function MCPDetailModal({
  mcp,
  isOpen,
  onClose,
  isSelected,
  onToggle,
}: MCPDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mcp.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {mcp.longDescription || mcp.description}
            </p>
            <a
              href={sanitizeUrl(mcp.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mcp.githubStars && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatNumber(mcp.githubStars)} stars
                </span>
              </div>
            )}
            {mcp.lastUpdated && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Updated {formatDate(mcp.lastUpdated)}
                </span>
              </div>
            )}
            {mcp.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {mcp.rating.toFixed(1)} rating
                </span>
              </div>
            )}
            {mcp.upvotes !== undefined && (
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {mcp.upvotes} upvotes
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Supported Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {mcp.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                >
                  {platform.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          {mcp.tags && mcp.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {mcp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {mcp.requiredScopes && mcp.requiredScopes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Required Scopes
              </h3>
              <div className="flex flex-wrap gap-2">
                {mcp.requiredScopes.map((scope) => (
                  <span
                    key={scope}
                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                onToggle(mcp)
              }}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isSelected
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSelected ? 'Remove from Selection' : 'Add to Selection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

