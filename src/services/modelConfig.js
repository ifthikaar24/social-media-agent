export const DEFAULT_MODEL = 'openai/gpt-oss-120b'

const FALLBACK_MODELS = [
  'openai/gpt-oss-120b',
  'llama-3.1-70b-versatile',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
]

const LEGACY_MODEL_NAMES = new Set([
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile'
])

export function getPreferredModel(rawModel) {
  const modelName = (rawModel ?? '').trim().replace(/^['"]|['"]$/g, '')

  if (!modelName) {
    return DEFAULT_MODEL
  }

  if (LEGACY_MODEL_NAMES.has(modelName)) {
    return DEFAULT_MODEL
  }

  return modelName
}

export function getModelCandidates(rawModel) {
  const preferred = getPreferredModel(rawModel)
  return Array.from(new Set([preferred, ...FALLBACK_MODELS]))
}

export function isModelNotFoundError(error) {
  const message = error?.message ?? ''
  return error?.code === 'model_not_found' || /does not exist|do not have access/i.test(message)
}
