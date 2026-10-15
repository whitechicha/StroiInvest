import { expect, test } from '@playwright/test'
import { addressSearchBody, mapAddressSuggestions } from '../server/utils/dadata'

test('Search scope includes RF regions through settlements, with city aliases', () => {
  expect(addressSearchBody('спб')).toMatchObject({
    query: 'Санкт-Петербург',
    count: 8,
    language: 'ru',
    locations: [{ country_iso_code: 'RU' }],
    from_bound: { value: 'region' },
    to_bound: { value: 'settlement' },
  })
  expect(addressSearchBody('Екатеринбург').query).toBe('Екатеринбург')
})

test('DaData mapping handles federal cities, villages, regions and foreign results', () => {
  const suggestions = mapAddressSuggestions([
    {
      data: {
        country_iso_code: 'RU',
        fias_id: '1',
        region: 'Москва',
        region_with_type: 'г Москва',
        city: 'Москва',
        city_with_type: 'г Москва',
      },
    },
    {
      data: {
        country_iso_code: 'RU',
        fias_id: '2',
        region: 'Тверская',
        region_with_type: 'Тверская обл',
        area: 'Калининский',
        area_with_type: 'Калининский р-н',
        settlement: 'Медное',
        settlement_with_type: 'с Медное',
        settlement_type_full: 'село',
      },
    },
    {
      data: {
        country_iso_code: 'RU',
        fias_id: '3',
        region: 'Краснодарский',
        region_with_type: 'Краснодарский край',
      },
    },
    { data: { country_iso_code: 'BY', region: 'Минская', city: 'Минск' } },
  ])
  expect(suggestions).toEqual([
    { id: '1', name: 'Москва', value: 'г Москва', context: '', kind: 'Город' },
    {
      id: '2',
      name: 'Медное',
      value: 'Тверская обл, Калининский р-н, с Медное',
      context: 'Тверская обл, Калининский р-н',
      kind: 'Село',
    },
    {
      id: '3',
      name: 'Краснодарский край',
      value: 'Краснодарский край',
      context: '',
      kind: 'Регион',
    },
  ])
})

test('Location endpoint rejects invalid requests before calling DaData', async ({ request }) => {
  const short = await request.post('./api/locations', { data: { query: 'я' } })
  expect(short.ok()).toBe(true)
  expect(await short.json()).toEqual({ suggestions: [] })
  for (const query of [null, ['Москва'], 'я'.repeat(151)]) {
    const response = await request.post('./api/locations', { data: { query } })
    expect(response.status()).toBe(400)
    expect(response.headers()['cache-control']).toBe('no-store')
  }
})
