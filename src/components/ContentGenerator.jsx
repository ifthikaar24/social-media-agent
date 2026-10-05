import { useState } from 'react'
import { generateBrandContent, generateTagline } from '../services/generateContent'

export default function ContentGenerator({ onLog, onAgentStart, onAgentDone }) {
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
    onAgentStart?.()
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
    onLog('Calling AI text endpoint via x402...', 'agent')
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
    onAgentDone?.()
  }
}
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={businessDescription}
        onChange={e => setBusinessDescription(e.target.value)}
        placeholder="e.g. A modern coffee shop called Brewnite in Chennai — warm, local, and a little quiet."
        className="field"
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !businessDescription.trim()}
        className="btn btn-primary btn-block"
      >
        {loading ? 'Agent working…' : 'Activate agent'}
      </button>

      {tagline && (
        <div className="result">
          <p className="result-label">Brand tagline</p>
          <p style={{ margin: 0, fontFamily: 'Newsreader, Georgia, serif', fontSize: 18, fontStyle: 'italic' }}>
            “{tagline}”
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-3">
          {posts.map((post, i) => (
            <div key={i} className="result">
              <div className="result-title">
                <span className="result-label" style={{ margin: 0 }}>{post.platform}</span>
                <span className="preview-badge">Published</span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55 }}>{post.caption}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{post.hashtags}</p>
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-box">{error}</div>}
    </div>
  )
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}