'use client'

import { useState, useEffect } from 'react'

export default function SocialProofBanner() {
  const [count, setCount] = useState(2847)

  useEffect(() => {
    // Simulate updating count every 5 minutes
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 10) + 1)
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 sticky top-0 z-50 animate-pulse">
      <div className="max-w-7xl mx-auto text-center text-sm font-medium">
        🔥 <strong>{count.toLocaleString()} developers</strong> generated configs this week
      </div>
    </div>
  )
}

