'use client'

export default function PricingCards() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* FREE - Deliberately limited (Contrast Effect) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">FREE</h3>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">$0</div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✓</span>
            <span className="text-gray-600 dark:text-gray-400">3 MCPs max</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✓</span>
            <span className="text-gray-600 dark:text-gray-400">Manual checks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✗</span>
            <span className="text-gray-400 line-through">Health monitoring</span>
          </li>
        </ul>
        <button className="w-full py-2 px-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
          Get Started
        </button>
      </div>

      {/* BASIC - Decoy tier (Decoy Effect) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 opacity-60">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">BASIC</h3>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">$8<span className="text-lg">/mo</span></div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✓</span>
            <span className="text-gray-600 dark:text-gray-400">10 MCPs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✓</span>
            <span className="text-gray-600 dark:text-gray-400">Weekly checks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">✗</span>
            <span className="text-gray-400 line-through">Auto sync</span>
          </li>
        </ul>
        <button className="w-full py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed">
          Limited
        </button>
      </div>

      {/* PRO - Target tier (obviously better) */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl border-2 border-blue-500 p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
          POPULAR
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
        <div className="text-4xl font-bold text-white mb-4">
          $12<span className="text-lg">/mo</span>
        </div>
        <ul className="space-y-3 mb-6 text-white/90">
          <li className="flex items-start gap-2">
            <span className="text-white">✓</span>
            <span>Unlimited MCPs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">✓</span>
            <span>Real-time monitoring</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">✓</span>
            <span>Auto sync</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white">✓</span>
            <span>Priority support</span>
          </li>
        </ul>
        <button className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Start Free Trial
        </button>
      </div>
    </div>
  )
}

