import type { LocationResponse } from '../../shared/types/location'
import type { DaDataSuggestion } from '../utils/dadata'
import { addressSearchBody, mapAddressSuggestions } from '../utils/dadata'

// A small per-process limit protects the upstream quota. Proxy headers are not trusted.
const limits = new Map<string, { count: number; expires: number }>()

export default defineEventHandler(async (event): Promise<LocationResponse> => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const body = await readBody<{ query?: unknown } | null>(event)
  if (typeof body?.query !== 'string' || body.query.length > 150) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid location query' })
  }
  const query = body.query.trim().replace(/\s+/g, ' ')
  if (query.length < 2) return { suggestions: [] }
  const key = useRuntimeConfig(event).dadataApiKey.trim()
  if (!key) {
    throw createError({ statusCode: 503, statusMessage: 'Location search unavailable' })
  }

  const now = Date.now()
  for (const [ip, entry] of limits) if (entry.expires <= now) limits.delete(ip)
  const ip = getRequestIP(event) || 'unknown'
  const entry = limits.get(ip) || { count: 0, expires: now + 60_000 }
  if (entry.count >= 60 || (!limits.has(ip) && limits.size >= 1000)) {
    setResponseHeader(event, 'Retry-After', 60)
    throw createError({ statusCode: 429, statusMessage: 'Too many location queries' })
  }
  entry.count++
  limits.set(ip, entry)

  try {
    const response = await $fetch<{ suggestions: DaDataSuggestion[] }>(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: 'POST',
        headers: { Authorization: `Token ${key}`, Accept: 'application/json' },
        body: addressSearchBody(query),
        timeout: 4000,
        retry: 0,
      },
    )
    if (!Array.isArray(response.suggestions)) throw new Error('Invalid response')
    return { suggestions: mapAddressSuggestions(response.suggestions) }
  } catch {
    // Never return the upstream error, which can contain the Authorization header.
    throw createError({ statusCode: 503, statusMessage: 'Location search unavailable' })
  }
})
