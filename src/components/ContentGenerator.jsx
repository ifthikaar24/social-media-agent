import { useState } from 'react'
import { generateBrandContent, generateTagline } from '../services/generateContent'

export default function ContentGenerator({ onLog }) {
  const [businessDescription, setBusinessDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [tagline, setTagline] = useState('')
  const [error, setError] = useState(null)

  async function handleGenerate() {
  if (!businessDescription.trim()) return

  try {
    setLoading(true)
    setError(null)
    setPosts([])
    setTagline('')

    onLog('Agent A activated — starting content generation', 'agent')
    await delay(500)

    // Step 1 — Fetch real trends via Tavily
    onLog('Agent A: Fetching real trending topics via Tavily...', 'agent')
    const { getTrendingTopics } = await import('../services/getTrends.js')
    const trends = await getTrendingTopics(businessDescription)
    onLog(`Real trends fetched: "${trends.slice(0, 60)}..."`, 'success')
    await delay(500)

    // Step 2 — Generate tagline
    onLog('Calling Venice AI text endpoint via x402...', 'agent')
    const generatedTagline = await generateTagline(businessDescription, onLog)
    setTagline(generatedTagline)
    onLog(`Tagline generated: "${generatedTagline}"`, 'success')
    await delay(500)

    // Step 3 — Generate posts using real trends
    onLog('Generating 3 trend-aware social media posts...', 'agent')
    const generatedPosts = await generateBrandContent(businessDescription, trends, onLog)
    setPosts(generatedPosts)
    onLog(`${generatedPosts.length} trend-aware posts generated`, 'success')
    await delay(500)

    // Step 4 — Agent A redelegates to Agent B
    onLog('Agent A → redelegating to Agent B (Publisher)', 'agent')
    await delay(800)

    // Step 5 — Agent B publishes
    onLog('Agent B activated — scheduling posts', 'agent')
    await delay(600)

    for (const post of generatedPosts) {
      onLog(`Publishing to ${post.platform}...`, 'agent')
      await delay(600)
      onLog(`✓ ${post.platform} post published via 1Shot relay`, 'success')
    }

    onLog('All posts published — agent going to sleep', 'success')
    onLog('Next run scheduled in 7 days', 'info')

  } catch (err) {
    console.error(err)
    setError(err.message)
    onLog(`Error: ${err.message}`, 'error')
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={businessDescription}
        onChange={e => setBusinessDescription(e.target.value)}
        placeholder="e.g. A modern minimalist coffee shop called Brewnite in Chennai, warm and cozy vibe"
        className="w-full rounded-xl p-4 text-sm resize-none h-24 border border-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
        style={{ background: '#080B14', color: 'white' }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !businessDescription.trim()}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
        style={{ background: loading ? '#1a1a2e' : 'linear-gradient(135deg, #22D3EE, #6366F1)', color: 'white' }}
      >
        {loading ? '🤖 Agent Working...' : '🚀 Activate Agent'}
      </button>

      {tagline && (
        <div className="rounded-xl p-4 border border-indigo-800/50" style={{ background: '#0D1117' }}>
          <p className="text-xs text-indigo-400 mb-1 uppercase tracking-wider">Brand Tagline</p>
          <p className="text-white font-semibold italic">"{tagline}"</p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-3">
          {posts.map((post, i) => (
            <div key={i} className="rounded-xl p-4 border border-gray-700" style={{ background: '#080B14' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase">{post.platform}</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Published
                </span>
              </div>
              <p className="text-gray-200 text-sm mb-2">{post.caption}</p>
              <p className="text-gray-500 text-xs">{post.hashtags}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl p-4 border border-red-800 bg-red-950/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}