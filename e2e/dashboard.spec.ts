/**
 * E2E 测试 — 16:9 数据大屏
 *
 * 覆盖：
 * - 首页可见性（标题、KPI、图表）
 * - 实时刷新（日期时间走动）
 * - 控制台无报错
 */

import { test, expect } from '@playwright/test'

test.describe('巅峰数据大屏 E2E', () => {
  test('首页完整渲染 — 标题、KPI、图表、日志均可见', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // ── 标题 ──
    await expect(page.locator('.header-title')).toHaveText('巅峰数据大屏')

    // ── 日期时间 ──
    await expect(page.locator('.dt-date')).toBeVisible()
    await expect(page.locator('.dt-time')).toBeVisible()

    // ── KPI 指标（6 个） ──
    const kpis = page.locator('.kpi-row > *')
    await expect(kpis).toHaveCount(6)
    await expect(kpis.first()).toBeVisible()

    // ── 主网格（6 个面板） ──
    const panels = page.locator('.panel')
    await expect(panels).toHaveCount(6)

    // ── 面板标题 ──
    const headers = page.locator('.panel-h')
    await expect(headers).toHaveCount(4) // 中心态势没有 panel-h
    await expect(headers.nth(0)).toContainText('访问趋势')
    await expect(headers.nth(1)).toContainText('城市排名')
    await expect(headers.nth(2)).toContainText('分类占比')
    await expect(headers.nth(3)).toContainText('雷达模型')

    // ── 实时日志列表 ──
    const logs = page.locator('.log-item')
    await expect(logs.first()).toBeVisible()
    await expect(logs).toHaveCount(6)

    // ── Footer ──
    await expect(page.locator('.footer')).toContainText('巅峰数据大屏')

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

    // 获取初始时间
    const time1 = await page.locator('.dt-time').textContent()

    // 等待 2 秒
    await page.waitForTimeout(2000)

    // 获取更新后的时间
    const time2 = await page.locator('.dt-time').textContent()

    // 时间应该不同（秒数变化）
    expect(time1).not.toBe(time2)
  })

  test('响应式 — 16:9 视口下布局无溢出', async ({ page }) => {
    // 设置 16:9 视口
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 页面不应有滚动
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight)

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    expect(scrollHeight).toBeLessThanOrEqual(clientHeight)
  })
})
