import { useState } from 'react'
import { generateBrandContent, generateTagline } from '../services/generateContent'

export default function ContentGenerator() {
  const [businessDescription, setBusinessDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [tagline, setTagline] = useState('')
  const [error, setError] = useState(null)
  const [step, setStep] = useState('')

  async function handleGenerate() {
    if (!businessDescription.trim()) return

    try {
      setLoading(true)
      setError(null)
      setPosts([])
      setTagline('')

      // Agent A — generate tagline
      setStep('🤖 Agent A: Generating brand tagline...')
      const generatedTagline = await generateTagline(businessDescription)
      setTagline(generatedTagline)

      // Agent A — generate social posts
      setStep('🤖 Agent A: Generating social media posts...')
      const generatedPosts = await generateBrandContent(businessDescription)
      setPosts(generatedPosts)

      // Agent B — publisher takes over
      setStep('🤖 Agent B: Scheduling and publishing posts...')
      await new Promise(r => setTimeout(r, 1500)) // simulate Agent B working

      setStep('✅ Done — Agent B published all posts')
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">

      {/* Business Input */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
          Step 4 — Describe Your Business
        </p>
        <textarea
          value={businessDescription}
          onChange={e => setBusinessDescription(e.target.value)}
          placeholder="e.g. A modern minimalist coffee shop called Brewnite in Chennai, warm and cozy vibe"
          className="w-full bg-gray-800 text-white rounded-xl p-4 text-sm resize-none h-24 border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !businessDescription.trim()}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
        >
          {loading ? 'Agent Working...' : '🚀 Generate Content'}
        </button>
      </div>

      {/* Agent Status */}
      {step && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <p className="text-yellow-400 text-sm">{step}</p>
        </div>
      )}

      {/* Tagline */}
      {tagline && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Brand Tagline</p>
          <p className="text-white text-xl font-semibold italic">"{tagline}"</p>
        </div>
      )}

      {/* Generated Posts */}
      {posts.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider">
            Generated Posts — Agent B Published ✅
          </p>
          <div className="flex flex-col gap-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-400 font-semibold uppercase">
                    {post.platform}
                  </span>
                  <span className="text-xs text-green-400">✅ Published</span>
                </div>
                <p className="text-white text-sm mb-2">{post.caption}</p>
                <p className="text-gray-400 text-xs">{post.hashtags}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-500 rounded-2xl p-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}