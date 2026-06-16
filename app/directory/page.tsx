'use client'

import { useState, useMemo, useEffect } from 'react'
import { MCP, MCPCategory } from '@/lib/types'
import { mcps, getMCPsByCategory, searchMCPs } from '@/lib/mcps'
import MCPCard from '@/components/MCPCard'
import MCPDetailModal from '@/components/MCPDetailModal'
import SelectionPanel from '@/components/SelectionPanel'
import { Search, Filter } from 'lucide-react'
import { track } from '@/lib/analytics'

const categories: { value: MCPCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'dev-tools', label: 'Dev Tools' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'data', label: 'Data' },
  { value: 'communication', label: 'Communication' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'content', label: 'Content' },
  { value: 'utilities', label: 'Utilities' },
]

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MCPCategory | ''>('')
  const [selectedMCPs, setSelectedMCPs] = useState<MCP[]>([])
  const [selectedMCPDetail, setSelectedMCPDetail] = useState<MCP | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredMCPs = useMemo(() => {
    let result = mcps

    if (selectedCategory) {
      result = getMCPsByCategory(selectedCategory as MCPCategory)
    }

    if (searchQuery.trim()) {
      result = searchMCPs(searchQuery)
    }

    return result
  }, [searchQuery, selectedCategory])

  // Track search and filter actions
  useEffect(() => {
    if (searchQuery.trim()) {
      track('mcp_search', {
        search_query: searchQuery,
        results_count: filteredMCPs.length,
      })
    }
  }, [searchQuery, filteredMCPs.length])

  useEffect(() => {
    if (selectedCategory) {
      track('mcp_filter_applied', {
        category: selectedCategory,
        results_count: filteredMCPs.length,
      })
    }
  }, [selectedCategory, filteredMCPs.length])

  const handleToggleMCP = (mcp: MCP) => {
    setSelectedMCPs((prev) => {
      const isSelected = prev.some((m) => m.id === mcp.id)
      if (isSelected) {
        return prev.filter((m) => m.id !== mcp.id)
      } else {
        if (prev.length >= 5) {
          // Free tier limit
          return prev
        }
        return [...prev, mcp]
      }
    })
  }

  const handleRemoveMCP = (mcp: MCP) => {
    setSelectedMCPs((prev) => prev.filter((m) => m.id !== mcp.id))
  }

  const handleClearSelection = () => {
    setSelectedMCPs([])
  }

  const handleViewDetails = (mcp: MCP) => {
    setSelectedMCPDetail(mcp)
    setIsModalOpen(true)
  }

  const selectedMCPIds = useMemo(() => {
    return new Set(selectedMCPs.map((m) => m.id))
  }, [selectedMCPs])

  const isMCPSelected = (mcp: MCP) => {
    return selectedMCPIds.has(mcp.id)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              MCPHub
            </a>
            <nav className="flex items-center gap-6">
              <a
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Home
              </a>
              <a
                href="/directory"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Free
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search MCPs by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as MCPCategory | '')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredMCPs.length} MCP{filteredMCPs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* MCP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMCPs.map((mcp) => (
            <MCPCard
              key={mcp.id}
              mcp={mcp}
              isSelected={isMCPSelected(mcp)}
              onToggle={handleToggleMCP}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredMCPs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No MCPs found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* Selection Panel */}
      <SelectionPanel
        selectedMCPs={selectedMCPs}
        onRemove={handleRemoveMCP}
        onClear={handleClearSelection}
        maxFree={5}
      />

      {/* Detail Modal */}
      {selectedMCPDetail && (
        <MCPDetailModal
          mcp={selectedMCPDetail}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMCPDetail(null)
          }}
          isSelected={isMCPSelected(selectedMCPDetail)}
          onToggle={handleToggleMCP}
        />
      )}
    </div>
  )
}

