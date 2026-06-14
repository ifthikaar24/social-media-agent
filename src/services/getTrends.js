const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY

export async function getTrendingTopics(businessDescription) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: `trending topics and hashtags for ${businessDescription} social media ${new Date().getFullYear()}`,
      search_depth: 'basic',
      max_results: 5,
      include_answer: true,
    }),
  })

  const data = await response.json()
  console.log('🔍 Tavily Real Trends Response:', JSON.stringify(data, null, 2))

  // Combine answer + top 3 result snippets for richer context
  const answer = data.answer || ''
  const snippets = data.results
    ?.slice(0, 3)
    .map(r => r.content?.slice(0, 200))
    .join(' ') || ''

  return `${answer} ${snippets}`.trim().slice(0, 1000)
}