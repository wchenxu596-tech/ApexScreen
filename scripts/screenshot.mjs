/**
 * 📸 自动化截图脚本 — 巅峰数据大屏
 *
 * 用途：
 * - 生成 README 展示图
 * - 生成课程资料可复用的大屏截图
 * - CI 中验证页面渲染
 *
 * 用法：
 *   node scripts/screenshot.mjs
 *
 * 依赖：
 *   npm install -D playwright
 *
 * 输出：
 *   screenshots/
 *     dashboard-1920x1080.png    完整大屏
 *     dashboard-kpi.png          KPI 区域
 *     dashboard-charts.png       图表区域
 */

import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'screenshots')

const URL = process.env.URL || 'http://localhost:3000'

async function run() {
  mkdirSync(OUT, { recursive: true })

  console.log('📸 启动浏览器 ...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina 清晰度
  })
  const page = await context.newPage()

  console.log(`📡 访问 ${URL} ...`)
  await page.goto(URL, { waitUntil: 'networkidle' })

  // 等待数据加载和图表渲染
  await page.waitForSelector('.header-title')
  await page.waitForSelector('.kpi-row > *')
  await page.waitForTimeout(2000) // ECharts 动画需要时间

  // ── 1. 完整大屏 ──
  console.log('📷 截图: 完整 16:9 大屏 ...')
  await page.screenshot({
    path: resolve(OUT, 'dashboard-1920x1080.png'),
    fullPage: false,
  })

  // ── 2. KPI 指标行 ──
  console.log('📷 截图: KPI 区域 ...')
  const kpiBox = await page.locator('.kpi-row').boundingBox()
  if (kpiBox) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-kpi.png'),
      clip: {
        x: kpiBox.x,
        y: kpiBox.y,
        width: kpiBox.width,
        height: kpiBox.height,
      },
    })
  }

  // ── 3. 图表网格区域 ──
  console.log('📷 截图: 图表网格 ...')
  const gridBox = await page.locator('.grid-main').boundingBox()
  if (gridBox) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-charts.png'),
      clip: {
        x: gridBox.x,
        y: gridBox.y,
        width: gridBox.width,
        height: gridBox.height,
      },
    })
  }

  console.log(`✅ 截图完成! 文件保存在: ${OUT}`)

  await browser.close()
}

run().catch((err) => {
  console.error('❌ 截图失败:', err)
  process.exit(1)
})
