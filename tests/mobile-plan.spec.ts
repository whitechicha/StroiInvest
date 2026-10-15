import { expect, test } from '@playwright/test'

for (const [width, height] of [
  [320, 568],
  [375, 667],
  [568, 320],
  [1190, 668],
]) {
  test(`Plan cards and dialog stay usable at ${width} x ${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 320 || width === 375) {
      await expect(page.locator('.hero-actions .btn')).toBeInViewport({ ratio: 1 })
      await expect(page.locator('.hero-link')).toBeInViewport({ ratio: 1 })
    }
    await expect(page.locator('.project-card img')).toHaveCount(0)
    await expect(page.locator('.project-card .project-bottom')).toHaveText([
      'Открыть планировку',
      'Открыть планировку',
      'Открыть планировку',
    ])
    const trigger = page.locator('.project-card[data-plan="110"]')
    await trigger.click()
    const dialog = page.locator('#plan-dialog')
    const close = dialog.getByRole('button', { name: 'Закрыть планировку' })
    await expect(dialog).toBeVisible()
    await expect(close).toBeInViewport({ ratio: 1 })
    await expect(page.locator('#choose-plan')).toBeInViewport({ ratio: 1 })
    const button = (await close.boundingBox())!
    const icon = (await close.locator('svg').boundingBox())!
    const title = (await page.locator('#plan-title').boundingBox())!
    expect(button.width).toBeGreaterThanOrEqual(44)
    expect(button.height).toBeGreaterThanOrEqual(44)
    expect(Math.abs(icon.x + icon.width / 2 - (button.x + button.width / 2))).toBeLessThan(1)
    expect(Math.abs(icon.y + icon.height / 2 - (button.y + button.height / 2))).toBeLessThan(1)
    expect(title.x + title.width).toBeLessThanOrEqual(button.x - 8)
    const scrollY = await page.evaluate(() => window.scrollY)
    await page.locator('.dialog-content').evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(close).toBeInViewport({ ratio: 1 })
    await expect(page.locator('#choose-plan')).toBeInViewport({ ratio: 1 })
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY)
    await close.click()
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })
}
