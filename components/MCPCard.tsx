'use client'

import { MCP } from '@/lib/types'
import { Star, GitBranch, Calendar, ThumbsUp } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import { track } from '@/lib/analytics'

interface MCPCardProps {
  mcp: MCP
  isSelected: boolean
  onToggle: (mcp: MCP) => void
  onViewDetails: (mcp: MCP) => void
}

export default function MCPCard({ mcp, isSelected, onToggle, onViewDetails }: MCPCardProps) {
  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => {
        track('mcp_detail_viewed', {
          mcp_id: mcp.id,
          mcp_name: mcp.name,
          mcp_category: mcp.category,
        })
        onViewDetails(mcp)
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {mcp.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {mcp.description}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            track('mcp_selected', {
              mcp_id: mcp.id,
              mcp_name: mcp.name,
              action: isSelected ? 'removed' : 'added',
            })
            onToggle(mcp)
          }}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-4">
        {mcp.githubStars && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{formatNumber(mcp.githubStars)}</span>
          </div>
        )}
        {mcp.lastUpdated && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(mcp.lastUpdated)}</span>
          </div>
        )}
        {mcp.upvotes !== undefined && (
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{mcp.upvotes}</span>
          </div>
        )}
        {mcp.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{mcp.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {mcp.platforms.slice(0, 3).map((platform) => (
          <span
            key={platform}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            {platform.replace('-', ' ')}
          </span>
        ))}
        {mcp.platforms.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            +{mcp.platforms.length - 3}
          </span>
        )}
      </div>
    </div>
  )
}

