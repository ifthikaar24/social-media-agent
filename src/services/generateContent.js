const API_KEY = import.meta.env.VITE_AI_API_KEY
const BASE_URL = import.meta.env.VITE_AI_BASE_URL
const MODEL = import.meta.env.VITE_AI_MODEL

export async function generateBrandContent(businessDescription) {
  // Step 1 — Generate captions and hashtags
  const textResponse = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a professional social media manager. 
          Generate 3 social media posts for the business described. 
          Respond ONLY with a JSON array, no markdown, no explanation.
          Format: [{"caption": "...", "hashtags": "...", "platform": "Instagram"}, ...]`,
        },
        {
          role: 'user',
          content: `Business: ${businessDescription}`,
        },
      ],
    }),
  })

  const textData = await textResponse.json()
  
  if (!textData.choices?.[0]?.message?.content) {
    throw new Error('Failed to generate captions')
  }

  let posts
  try {
    const raw = textData.choices[0].message.content
    const clean = raw.replace(/```json|```/g, '').trim()
    posts = JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse AI response')
  }

  return posts
}

export async function generateTagline(businessDescription) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a branding expert. Generate a short, punchy tagline for the business. Respond with just the tagline, nothing else.',
        },
        {
          role: 'user',
          content: `Business: ${businessDescription}`,
        },
      ],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'Your brand, your story.'
}