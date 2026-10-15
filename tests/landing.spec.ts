import { expect, test } from '@playwright/test'
import { locationFixtures as locations } from './fixtures/locations'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/locations', async (route) => {
    const query = String(route.request().postDataJSON().query).toLowerCase()
    const item =
      query.startsWith('моск') || query === 'мск'
        ? locations.moscow
        : query === 'спб'
          ? locations.petersburg
          : query.startsWith('ростов')
            ? locations.rostov
            : query.startsWith('краснодар')
              ? locations.krasnodar
              : query.startsWith('див')
                ? locations.village
                : null
    await route.fulfill({ json: { suggestions: item ? [item] : [] } })
  })
})

test('Content is rendered before JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto(baseURL!)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ваше будущее.')
    await expect(page.locator('#about')).toContainText('строительная компания')
    await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /Стройинвест/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  } finally {
    await context.close()
  }
})

test('Catalogue transfers module size and plan selection into the form', async ({ page }) => {
  const issues: string[] = []
  page.on('pageerror', (error) => issues.push(error.message))
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) issues.push(message.text())
  })
  await page.goto('./')
  await page.locator('#modular-tab').click()
  await expect(page.locator('#modular-panel')).toBeVisible()
  await page.locator('[data-size="8 × 5 м"]').click()
  await page.locator('[data-interest="Двухмодульный дом"]').click()
  await expect(page.locator('#area')).toHaveValue('40')
  await expect(page.locator('#interest')).toHaveValue('Двухмодульный дом')
  await page.locator('#stone-tab').click()
  await page.locator('[data-plan="110"]').click()
  await expect(page.locator('dialog')).toBeVisible()
  await page.locator('#choose-plan').click()
  await expect(page.locator('dialog')).not.toBeVisible()
  await expect(page.locator('#interest')).toHaveValue('Каменный дом')
  await expect(page.locator('#area')).toHaveValue('110')
  await expect(page.locator('.btn svg.icon').first()).toHaveAttribute('aria-hidden', 'true')
  expect(issues).toEqual([])
})

test('DaData suggestions support keyboard, aliases and manual values', async ({ page }) => {
  await page.goto('./')
  const region = page.locator('#region')
  await region.fill('моск')
  await expect(page.locator('#location-options strong').first()).toHaveText('Москва')
  await region.press('ArrowDown')
  await region.press('Enter')
  await expect(region).toHaveValue('г Москва')
  await expect(page.locator('#location-dropdown')).not.toBeVisible()
  await region.fill('спб')
  await expect(page.locator('#location-options strong').first()).toHaveText('Санкт-Петербург')
  await region.press('Escape')
  await expect(region).toHaveValue('спб')
  await region.fill('ростов')
  await page.getByRole('option').filter({ hasText: 'Ростов-на-Дону' }).click()
  await expect(region).toHaveValue('Ростовская обл, г Ростов-на-Дону')
  await region.fill('Мой поселок')
  await expect(page.locator('#location-empty')).toContainText('Ничего не найдено')
  await region.press('Tab')
  await expect(region).toHaveValue('Мой поселок')
})

test('Village context is visible and the full location goes to WhatsApp', async ({ page }) => {
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.goto('./')
  await page.locator('#region').fill('дивномор')
  const option = page.getByRole('option', { name: /Дивноморское/ })
  await expect(option).toContainText('Село · Краснодарский край, г Геленджик')
  await option.click()
  await expect(page.locator('#region')).toHaveValue(locations.village.value)
  const pending = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'))
  await page.getByRole('button', { name: 'Отправить запрос в WhatsApp' }).click()
  expect(new URL((await pending).url()).searchParams.get('text')).toContain(locations.village.value)
})

test('Unavailable suggestions preserve manual entry and allow submission', async ({ page }) => {
  await page.route('**/api/locations', (route) => route.fulfill({ status: 503, json: {} }))
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.goto('./')
  await page.locator('#region').fill('Мой посёлок, Тверская область')
  await expect(page.locator('#location-empty')).toContainText('Подсказки временно недоступны')
  await expect(page.locator('#region')).toHaveValue('Мой посёлок, Тверская область')
  const pending = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'))
  await page.getByRole('button', { name: 'Отправить запрос в WhatsApp' }).click()
  expect(new URL((await pending).url()).searchParams.get('text')).toContain('Мой посёлок')
})

test('Search debounces input and ignores a late response after editing', async ({ page }) => {
  const queries: string[] = []
  await page.route('**/api/locations', async (route) => {
    const query = route.request().postDataJSON().query
    queries.push(query)
    if (query === 'моск') await new Promise((resolve) => setTimeout(resolve, 1000))
    await route
      .fulfill({
        json: {
          suggestions: [query === 'моск' ? locations.moscow : locations.village],
        },
      })
      .catch(() => {})
  })
  await page.goto('./')
  const region = page.locator('#region')
  await region.fill('м')
  await region.fill('мо')
  const first = page.waitForRequest((request) => request.url().endsWith('/api/locations'))
  await region.fill('моск')
  await first
  await expect(page.locator('#location-empty')).toContainText('Ищем')
  await region.fill('дивномор')
  await expect(page.locator('#location-options strong')).toHaveText('Дивноморское')
  await page.waitForTimeout(1100)
  await expect(page.locator('#location-options strong')).toHaveText('Дивноморское')
  expect(queries).toEqual(['моск', 'дивномор'])
  await region.fill('д')
  await expect(page.locator('#location-dropdown')).not.toBeVisible()
})

test('WhatsApp preserves selected criteria and special characters', async ({ page }) => {
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.goto('./')
  await page.locator('#region').fill('Ростовская область')
  await page.locator('#area').fill('110')
  await page.locator('#package').selectOption('Под ключ')
  await page.locator('#message').fill('Три спальни & терраса + кабинет\nДетали обсудим')
  const pending = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'))
  await page.getByRole('button', { name: 'Отправить запрос в WhatsApp' }).click()
  const url = new URL((await pending).url())
  expect(url.pathname).toBe('/79889984896')
  const text = url.searchParams.get('text')!
  expect(text).toContain('Желаемая площадь: 110 м²')
  expect(text).toContain('Комплектация: Под ключ')
  expect(text).toContain('Три спальни & терраса + кабинет\nДетали обсудим')
})

test('Land requests omit stale and invalid house criteria', async ({ page }) => {
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.goto('./')
  await page.locator('#area').fill('9999')
  await page.locator('#interest').selectOption('Земля для ветерана')
  await expect(page.locator('#house-fields')).not.toBeVisible()
  await page.locator('#region').fill('Республика Татарстан')
  const pending = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'))
  await page.getByRole('button', { name: 'Отправить запрос в WhatsApp' }).click()
  const text = new URL((await pending).url()).searchParams.get('text')!
  expect(text).toContain('Земля для ветерана')
  expect(text).not.toContain('площадь')
  expect(text).not.toContain('Комплектация')
})

for (const [width, height] of [
  [320, 568],
  [375, 667],
  [622, 800],
  [1440, 900],
]) {
  test(`Responsive layout ${width} × ${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('./')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width < 900) {
      await page.locator('.menu-toggle').click()
      await expect(page.locator('.nav')).toBeVisible()
      await page.locator('.nav a[href="#houses"]').click()
      await expect(page.locator('.nav')).not.toBeVisible()
    }
    await page.locator('#modular-tab').click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('#three-modular-tab').click()
    await expect(page.locator('#three-modular-panel')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('#region').fill('краснодар')
    await expect(page.locator('#location-options [role=option]').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('Three-module house includes both sizes, source PDF and house/bath plans', async ({
  page,
  request,
}) => {
  await page.goto('./')
  const tab = page.locator('#three-modular-tab')
  await tab.click()
  const panel = page.locator('#three-modular-panel')
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('3 137 500 ₽')
  await expect(panel).toContainText('3 375 000 ₽')
  await expect(panel).toContainText('палуба из лиственницы')
  const pdf = await panel.locator('a[href$="three-module-house.pdf"]').getAttribute('href')
  const response = await request.get(pdf!)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('application/pdf')
  await panel.locator('[data-three-size="8 × 7,5 м"]').click()
  await panel.locator('summary').click()
  await expect(panel).toContainText('2,1–2,45 м')
  await expect(panel).toContainText('226 / 150 мм')
  await panel.locator('[data-plan="three-module-bath"]').click()
  await expect(page.locator('#plan-title')).toContainText('баня')
  await expect(page.locator('#plan-image')).toHaveAttribute('src', /three-module-plan-bath.webp$/)
  await expect(page.locator('#choose-plan')).not.toBeVisible()
  await page.locator('.close-dialog').click()
  await panel.locator('[data-plan="three-module"]').click()
  await expect(page.locator('#plan-image')).toHaveAttribute('src', /three-module-plan-house.webp$/)
  await page.locator('#choose-plan').click()
  await expect(page.locator('#interest')).toHaveValue('Трехмодульный дом')
  await expect(page.locator('#area')).toHaveValue('60')
})

test('Three-module fractional area and selected size are preserved in WhatsApp', async ({
  page,
}) => {
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.goto('./')
  await page.locator('#three-modular-tab').click()
  await page.locator('[data-interest="Трехмодульный дом"]').click()
  await expect(page.locator('#area')).toHaveValue('52.5')
  expect(
    await page.locator('#area').evaluate((element: HTMLInputElement) => element.validity.valid),
  ).toBe(true)
  await page.locator('#region').fill('Московская область')
  const pending = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'))
  await page.getByRole('button', { name: 'Отправить запрос в WhatsApp' }).click()
  const text = new URL((await pending).url()).searchParams.get('text')!
  expect(text).toContain('Направление: Трехмодульный дом')
  expect(text).toContain('Желаемая площадь: 52,5 м²')
  expect(text).toContain('Размер трехмодульного дома: 7 × 7,5 м')
  expect(text).toContain('Палуба: из лиственницы')
  expect(text).not.toContain('6 × 5 м')
})

test('House tabs support keyboard navigation across all three types', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#stone-tab')).toBeEnabled()
  await page.locator('#stone-tab').focus()
  await page.keyboard.press('End')
  await expect(page.locator('#three-modular-tab')).toBeFocused()
  await expect(page.locator('#three-modular-panel')).toBeVisible()
  await page.keyboard.press('Home')
  await expect(page.locator('#stone-tab')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#three-modular-tab')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#stone-tab')).toBeFocused()
})
