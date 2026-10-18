import test from 'node:test'
import assert from 'node:assert/strict'

import { getPreferredModel } from './modelConfig.js'

test('Legacy Groq model falls back to the selected default', () => {
  assert.equal(getPreferredModel('llama-3.3-70b-versatile'), 'openai/gpt-oss-120b')
})

test('Explicit default model is preserved', () => {
  assert.equal(getPreferredModel('openai/gpt-oss-120b'), 'openai/gpt-oss-120b')
})
