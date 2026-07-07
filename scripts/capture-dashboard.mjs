/**
 * 📸 截图脚本 — 巅峰数据大屏 ApexScreen
 *
 * 截图保存到 docs/screenshots/。
 *
 * 用法：
 *   node scripts/capture-dashboard.mjs
 *   URL=http://localhost:5173 node scripts/capture-dashboard.mjs
 *
 * 退出码：
 *   0  — 成功，无 console error
 *   1  — 截图已生成但有 console error
 */

import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'docs', 'screenshots')
const SCREENSHOT_PATH = resolve(OUT_DIR, 'dashboard-1920x1080.png')

const URL = process.env.URL || 'http://localhost:3000'

async function main() {
  // 1. 创建输出目录
  mkdirSync(OUT_DIR, { recursive: true })

  // 2. 启动浏览器
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // 3. 收集 console error
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  // 4. 访问页面
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })

  // 5. 等待页面标题
  await page.waitForSelector('.header-title', { timeout: 10000 })

  // 6. 等待核心大屏内容
  await page.waitForSelector('.kpi-row > *', { timeout: 10000 })
  await page.waitForSelector('.grid-main', { timeout: 10000 })
  await page.waitForSelector('.map-container, .campus-svg', { timeout: 10000 })

  // 7. 等待 ECharts 渲染和数据刷新
  await page.waitForTimeout(4000)

  // 8. 检查是否有明显加载失败状态
  const hasLoadingError = await page.evaluate(() => {
    const placeholders = document.querySelectorAll('.map-placeholder, .chart-placeholder')
    return Array.from(placeholders).some((el) => el.textContent?.includes('失败'))
  })
  if (hasLoadingError) {
    consoleErrors.push('页面中存在加载失败状态')
  }

  // 9. 截图（当前视口，不截长图）
  await page.screenshot({
    path: SCREENSHOT_PATH,
    fullPage: false,
  })

  await browser.close()

  // 10. 输出截图路径
  console.log(`📸 截图已保存: ${SCREENSHOT_PATH}`)

  // 11. 根据 console error 决定退出码
  if (consoleErrors.length > 0) {
    console.warn(`⚠️  发现 ${consoleErrors.length} 个 console error:`)
    for (const err of consoleErrors) {
      console.warn(`  • ${err}`)
    }
    process.exit(1)
  }

  console.log('✅ 截图完成，控制台无异常')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ 截图失败:', err)
  process.exit(1)
})
