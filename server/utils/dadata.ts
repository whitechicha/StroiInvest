import type { LocationSuggestion } from '../../shared/types/location'

interface AddressData {
  country_iso_code?: string | null
  fias_id?: string | null
  region?: string | null
  region_with_type?: string | null
  area?: string | null
  area_with_type?: string | null
  city?: string | null
  city_with_type?: string | null
  settlement?: string | null
  settlement_with_type?: string | null
  settlement_type_full?: string | null
  city_type_full?: string | null
  area_type_full?: string | null
}

export interface DaDataSuggestion {
  data: AddressData
}

const aliases: Record<string, string> = {
  мск: 'Москва',
  спб: 'Санкт-Петербург',
  екб: 'Екатеринбург',
  нн: 'Нижний Новгород',
}

export function addressSearchBody(query: string) {
  return {
    query: aliases[query.toLocaleLowerCase('ru')] || query,
    count: 8,
    language: 'ru',
    locations: [{ country_iso_code: 'RU' }],
    from_bound: { value: 'region' },
    to_bound: { value: 'settlement' },
  }
}

export function mapAddressSuggestions(items: DaDataSuggestion[]): LocationSuggestion[] {
  const unique = new Map<string, LocationSuggestion>()
  for (const item of items) {
    const data = item?.data
    if (!data || (data.country_iso_code && data.country_iso_code !== 'RU')) continue
    const parts = [
      [data.region, data.region_with_type],
      [data.area, data.area_with_type],
      [data.city, data.city_with_type],
      [data.settlement, data.settlement_with_type],
    ].filter((part): part is [string, string | null | undefined] => Boolean(part[0]))
    const distinct = [...new Map(parts.map((part) => [part[1] || part[0], part])).values()]
    const last = distinct.at(-1)
    if (!last) continue
    const name = data.settlement || data.city || data.area || last[1] || last[0]
    const value = distinct.map(([plain, typed]) => typed || plain).join(', ')
    const kind = data.settlement
      ? data.settlement_type_full || 'Населённый пункт'
      : data.city
        ? data.city_type_full || 'Город'
        : data.area
          ? data.area_type_full || 'Район'
          : 'Регион'
    const id = data.fias_id || value
    unique.set(id, {
      id,
      name,
      value,
      context: distinct
        .slice(0, -1)
        .map(([plain, typed]) => typed || plain)
        .join(', '),
      kind: kind.charAt(0).toLocaleUpperCase('ru') + kind.slice(1),
    })
  }
  return [...unique.values()].slice(0, 8)
}
