/**
 * 📸 自动化截图脚本 — 巅峰数据大屏 ApexScreen
 *
 * 生成 README 展示图和课程资料截图。
 *
 * 用法:
 *   node scripts/screenshot.mjs                    # 默认 http://localhost:3000
 *   URL=http://localhost:5173 node scripts/screenshot.mjs
 *
 * 输出:
 *   screenshots/
 *     dashboard-full.png         完整大屏 1920×1080
 *     dashboard-kpi.png          KPI 指标行
 *     dashboard-china-map.png    中国地图模块
 *     dashboard-charts.png       右侧图表区
 *     dashboard-bottom.png       底部面板区
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

  console.log('📸 启动浏览器 …')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // 收集控制台异常
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  console.log(`📡 访问 ${URL} …`)
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })

  // —— 等待核心元素 ——
  await page.waitForSelector('.header-title', { timeout: 10000 })
  await page.waitForSelector('.kpi-row > *', { timeout: 10000 })
  await page.waitForSelector('.grid-main', { timeout: 10000 })
  // 等待 ECharts 和中国地图 GeoJSON 加载
  await page.waitForTimeout(4000)

  console.log(`📐 视口: ${await page.evaluate(() => `${window.innerWidth}×${window.innerHeight}`)}`)

  // —— 1. 完整大屏 ——
  console.log('📷 截图: 完整大屏 (dashboard-full.png)')
  await page.screenshot({
    path: resolve(OUT, 'dashboard-full.png'),
    fullPage: false,
  })

  // —— 2. KPI 指标行 ——
  console.log('📷 截图: KPI 指标行 (dashboard-kpi.png)')
  const kpiBox = await page.locator('.kpi-row').boundingBox()
  if (kpiBox) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-kpi.png'),
      clip: {
        x: kpiBox.x, y: kpiBox.y,
        width: kpiBox.width, height: kpiBox.height,
      },
    })
  }

  // —— 3. 中国地图模块 ——
  console.log('📷 截图: 中国地图 (dashboard-china-map.png)')
  const mapPanel = await page.locator('.panel-map').boundingBox()
  if (mapPanel) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-china-map.png'),
      clip: {
        x: mapPanel.x, y: mapPanel.y,
        width: mapPanel.width, height: mapPanel.height,
      },
    })
  }

  // —— 4. 右侧图表区（访问趋势 + 分类占比） ——
  console.log('📷 截图: 右侧图表 (dashboard-charts.png)')
  const topRight = await page.locator('.panel-top-right').boundingBox()
  const midRight = await page.locator('.panel-mid-right').boundingBox()
  if (topRight && midRight) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-charts.png'),
      clip: {
        x: topRight.x, y: topRight.y,
        width: topRight.width,
        height: (midRight.y + midRight.height) - topRight.y,
      },
    })
  }

  // —— 5. 底部面板区 ——
  console.log('📷 截图: 底部面板 (dashboard-bottom.png)')
  const botLeft = await page.locator('.panel-bot-left').boundingBox()
  const botFar = await page.locator('.panel-bot-far').boundingBox()
  if (botLeft && botFar) {
    await page.screenshot({
      path: resolve(OUT, 'dashboard-bottom.png'),
      clip: {
        x: botLeft.x, y: botLeft.y,
        width: (botFar.x + botFar.width) - botLeft.x,
        height: botFar.height,
      },
    })
  }

  // —— 报告 ——
  console.log(`\n✅ 截图完成! 共 5 张, 保存在: ${OUT}`)
  if (errors.length) {
    console.warn(`⚠️  ${errors.length} 个控制台异常:\n  ${errors.join('\n  ')}`)
  } else {
    console.log('✅ 控制台无异常')
  }

  await browser.close()
}

run().catch((err) => {
  console.error('❌ 截图失败:', err)
  process.exit(1)
})
