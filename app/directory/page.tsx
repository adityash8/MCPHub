'use client'

import { useState, useMemo } from 'react'
import { MCP, MCPCategory } from '@/lib/types'
import { mcps, getMCPsByCategory, searchMCPs } from '@/lib/mcps'
import MCPCard from '@/components/MCPCard'
import MCPDetailModal from '@/components/MCPDetailModal'
import SelectionPanel from '@/components/SelectionPanel'
import { Search, Filter, Flame } from 'lucide-react'
import { calculateTrendingScore, getHealthStatus } from '@/lib/utils'

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

type SortOption = 'trending' | 'popular' | 'recent' | 'alphabetical'

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MCPCategory | ''>('')
  const [selectedMCPs, setSelectedMCPs] = useState<MCP[]>([])
  const [selectedMCPDetail, setSelectedMCPDetail] = useState<MCP | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>('trending')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7 // Serial Position Effect - 7±2 items

  const filteredMCPs = useMemo(() => {
    let result = mcps.map((mcp) => ({
      ...mcp,
      healthStatus: mcp.healthStatus || getHealthStatus(mcp.id),
      trendingScore: mcp.trendingScore || calculateTrendingScore(mcp),
      isFeatured: mcp.isFeatured || (mcp.id === 'github' || mcp.id === 'filesystem'),
    }))

    if (selectedCategory) {
      const categoryMCPs = getMCPsByCategory(selectedCategory as MCPCategory)
      result = result.filter((mcp) => categoryMCPs.some((cm) => cm.id === mcp.id))
    }

    if (searchQuery.trim()) {
      const searchResults = searchMCPs(searchQuery)
      result = result.filter((mcp) => searchResults.some((sm) => sm.id === mcp.id))
    }

    // Sort by selected option (Availability Heuristic - Trending first)
    result.sort((a, b) => {
      switch (sortOption) {
        case 'trending':
          return (b.trendingScore || 0) - (a.trendingScore || 0)
        case 'popular':
          return (b.upvotes || 0) - (a.upvotes || 0)
        case 'recent':
          if (!a.lastUpdated || !b.lastUpdated) return 0
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    // Serial Position Effect - Ensure best MCPs at positions 1 and 7
    if (sortOption === 'trending' && result.length >= 7) {
      const best = result[0]
      const seventh = result[6]
      // Already sorted by trending, so positions 1 and 7 are optimal
    }

    return result
  }, [searchQuery, selectedCategory, sortOption])

  // Pagination for Serial Position Effect
  const paginatedMCPs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMCPs.slice(start, start + itemsPerPage)
  }, [filteredMCPs, currentPage])

  const totalPages = Math.ceil(filteredMCPs.length / itemsPerPage)

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

  const isMCPSelected = (mcp: MCP) => {
    return selectedMCPs.some((m) => m.id === mcp.id)
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {/* Availability Heuristic - Trending first (default) */}
            <button
              onClick={() => {
                setSortOption('trending')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                sortOption === 'trending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Flame className="w-4 h-4" />
              Trending This Week
            </button>
            <button
              onClick={() => {
                setSortOption('popular')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortOption === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => {
                setSortOption('recent')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortOption === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Recently Updated
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setSelectedCategory(category.value as MCPCategory | '')
                  setCurrentPage(1)
                }}
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
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {paginatedMCPs.length} of {filteredMCPs.length} MCP{filteredMCPs.length !== 1 ? 's' : ''}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* MCP Grid - Serial Position Effect (7 items per page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMCPs.map((mcp) => (
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

      {/* Selection Panel - IKEA Effect ("Your Custom Stack") */}
      <SelectionPanel
        selectedMCPs={selectedMCPs}
        onRemove={handleRemoveMCP}
        onClear={handleClearSelection}
        maxFree={3}
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

