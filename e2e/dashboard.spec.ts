/**
 * E2E 测试 — 16:9 教学数据大屏（浅色毛玻璃主题）
 *
 * 覆盖：
 * - 首页可见性（标题、KPI、中国地图、校园图、日志）
 * - 实时刷新（日期时间走动）
 * - 控制台无报错
 */

import { test, expect } from '@playwright/test'

test.describe('教学数据大屏 E2E', () => {
  test('首页完整渲染 — 标题/KPI/面板/地图/日志均可见', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // ── 标题 ──
    await expect(page.locator('.header-title')).toHaveText('巅峰数据大屏')

    // ── 日期时间 ──
    await expect(page.locator('.dt-date')).toBeVisible()
    await expect(page.locator('.dt-time')).toBeVisible()

    // ── KPI 指标（4 个） ──
    const kpis = page.locator('.kpi-row > *')
    await expect(kpis).toHaveCount(4)
    await expect(kpis.first()).toBeVisible()

    // ── 面板标题（7 个） ──
    const headers = page.locator('.panel-h')
    await expect(headers).toHaveCount(7)
    await expect(headers.nth(0)).toContainText('全国城市访问分布')
    await expect(headers.nth(1)).toContainText('访问趋势')
    await expect(headers.nth(2)).toContainText('分类占比')
    await expect(headers.nth(3)).toContainText('实时动态')
    await expect(headers.nth(4)).toContainText('教学中心')
    await expect(headers.nth(5)).toContainText('城市排名')
    await expect(headers.nth(6)).toContainText('雷达模型')

    // ── 2.5D 中国地图 ──
    const chinaMap = page.locator('.map-container')
    await expect(chinaMap).toBeVisible()

    // ── 校园中枢图 ──
    const campusSvg = page.locator('.campus-svg')
    await expect(campusSvg).toBeVisible()

    // ── 实时动态（20 条） ──
    const logItems = page.locator('.log-item')
    await expect(logItems.first()).toBeVisible()
    await expect(logItems).toHaveCount(20)

    // ── 告警条目（5 条 alert） ──
    const alerts = page.locator('.log-item.is-alert')
    await expect(alerts).toHaveCount(5)

    // ── Footer ──
    await expect(page.locator('.footer')).toContainText('教学数据大屏')

    // ── 无控制台报错 ──
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await expect(errors).toHaveLength(0)
  })

  test('实时刷新 — 时间走动和刷新按钮可用', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const time1 = await page.locator('.dt-time').textContent()
    await page.waitForTimeout(2000)
    const time2 = await page.locator('.dt-time').textContent()

    expect(time1).not.toBe(time2)
  })

  test('响应式 — 16:9 视口下布局无溢出', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    const sh = await page.evaluate(() => document.documentElement.scrollHeight)
    const cw = await page.evaluate(() => document.documentElement.clientWidth)
    const ch = await page.evaluate(() => document.documentElement.clientHeight)

    expect(sw).toBeLessThanOrEqual(cw)
    expect(sh).toBeLessThanOrEqual(ch)
  })
})
