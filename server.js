import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DEFAULT_MODEL } from './src/services/modelConfig.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function getGroqKey() {
  return process.env.GROQ_API_KEY || process.env.VITE_AI_API_KEY
}

function getGroqModel(modelName) {
  return modelName || process.env.GROQ_MODEL || process.env.VITE_AI_MODEL || DEFAULT_MODEL
}

async function callGroq({ model, messages, systemPrompt }) {
  const apiKey = getGroqKey()
  if (!apiKey) {
    throw new Error('Groq API key is missing on the server.')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getGroqModel(model),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data?.error?.message || 'Groq request failed')
    error.code = data?.error?.code
    throw error
  }

  return data
}

app.get('/health', (_, res) => {
  res.json({ ok: true })
})

app.post('/api/trends', async (req, res) => {
  try {
    const { businessDescription = '' } = req.body || {}
    const apiKey = process.env.TAVILY_API_KEY || process.env.VITE_TAVILY_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: 'Tavily API key is missing on the server.' })
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `trending topics and hashtags for ${businessDescription} social media ${new Date().getFullYear()}`,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || 'Tavily request failed',
      })
    }

    return res.json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

app.post('/api/generate', async (req, res) => {
  try {
    const { model, messages = [], systemPrompt = '' } = req.body || {}
    const data = await callGroq({ model, messages, systemPrompt })
    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message,
        code: error.code,
      },
    })
  }
})

app.listen(PORT, () => {
  console.log(`Secure API server running on http://localhost:${PORT}`)
})
