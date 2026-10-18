import { DEFAULT_MODEL, getModelCandidates, getPreferredModel, isModelNotFoundError } from './modelConfig.js'

const MODEL = getPreferredModel(import.meta.env.VITE_AI_MODEL)

async function callChatCompletion(messages, systemPrompt, onLog) {
  const candidateModels = getModelCandidates(MODEL)

  for (const modelName of candidateModels) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          systemPrompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data?.error?.message || 'Failed to generate content')
        error.code = data?.error?.code

        if (isModelNotFoundError(error) && modelName !== DEFAULT_MODEL) {
          onLog?.(`→ model fallback: ${modelName} unavailable, retrying with ${DEFAULT_MODEL}`, 'warning')
          continue
        }

        throw error
      }

      return data
    } catch (error) {
      if (isModelNotFoundError(error) && modelName !== DEFAULT_MODEL) {
        onLog?.(`→ model fallback: ${modelName} unavailable, retrying with ${DEFAULT_MODEL}`, 'warning')
        continue
      }

      throw error
    }
  }

  throw new Error(`Failed to generate content with ${MODEL}`)
}

// Simulate x402 payment per API call
export async function simulateX402Payment(amount, purpose, onLog) {
  onLog(`→ x402: HTTP 402 Payment Required`, 'agent')
  await new Promise(r => setTimeout(r, 600))
  onLog(`→ x402: Paying ${amount} USDC for "${purpose}"`, 'agent')
  await new Promise(r => setTimeout(r, 800))
  onLog(`→ x402: Payment confirmed via 1Shot relay ✓`, 'success')
  await new Promise(r => setTimeout(r, 400))
}

export async function generateBrandContent(businessDescription, trends, onLog) {
  // x402 payment before API call
  await simulateX402Payment('0.002', 'social post generation', onLog)

  const textData = await callChatCompletion(
    [{
      role: 'user',
      content: `Business: ${businessDescription}\n\nTrending topics right now: ${trends}`,
    }],
    `You are a professional social media manager.
    Generate 3 social media posts for the business described.
    Use the provided trending topics to make posts relevant and timely.
    Respond ONLY with a JSON array, no markdown, no explanation.
    Format: [{"caption": "...", "hashtags": "...", "platform": "Instagram"}, ...]`,
    onLog,
  )

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

export async function generateTagline(businessDescription, onLog) {
  // x402 payment before API call
  await simulateX402Payment('0.001', 'tagline generation', onLog)

  const data = await callChatCompletion(
    [{
      role: 'user',
      content: `Business: ${businessDescription}`,
    }],
    'You are a branding expert. Generate a short, punchy tagline for the business. Respond with just the tagline, nothing else.',
    onLog,
  )

  return data.choices?.[0]?.message?.content || 'Your brand, your story.'
}