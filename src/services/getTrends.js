export async function getTrendingTopics(businessDescription) {
  const response = await fetch('/api/trends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessDescription,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch trending topics')
  }

  console.log('🔍 Tavily Real Trends Response:', JSON.stringify(data, null, 2))

  const answer = data.answer || ''
  const snippets = data.results
    ?.slice(0, 3)
    .map(r => r.content?.slice(0, 200))
    .join(' ') || ''

  return `${answer} ${snippets}`.trim().slice(0, 1000)
}