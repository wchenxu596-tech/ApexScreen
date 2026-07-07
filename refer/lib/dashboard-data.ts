// 大屏模拟数据（Mock Data）

export const COLORS = {
  cyan: "#2563eb",
  teal: "#0ea5a4",
  orange: "#f97316",
  text: "#1e293b",
  textDim: "#64748b",
  grid: "rgba(100, 116, 139, 0.18)",
}

// 地图城市插针数据 [经度, 纬度, 数值, 名称]
export const cityPoints: { name: string; value: [number, number, number] }[] = [
  { name: "北京", value: [116.4, 39.9, 120] },
  { name: "上海", value: [121.47, 31.23, 98] },
  { name: "广州", value: [113.26, 23.13, 86] },
  { name: "成都", value: [104.06, 30.67, 74] },
  { name: "西安", value: [108.95, 34.27, 63] },
  { name: "武汉", value: [114.3, 30.6, 58] },
  { name: "沈阳", value: [123.43, 41.8, 45] },
  { name: "乌鲁木齐", value: [87.62, 43.82, 38] },
]

// 环形图：城市数量占比
export const donutData = [
  { name: "一线城市", value: 428 },
  { name: "新一线城市", value: 356 },
  { name: "二线城市", value: 284 },
  { name: "三线及以下", value: 180 },
]
export const donutTotal = 1248

// Top10 城市排行
export const rankData = [
  { name: "北京", value: 120 },
  { name: "上海", value: 98 },
  { name: "广州", value: 86 },
  { name: "成都", value: 74 },
  { name: "西安", value: 63 },
  { name: "武汉", value: 58 },
  { name: "杭州", value: 52 },
  { name: "南京", value: 47 },
  { name: "沈阳", value: 45 },
  { name: "重庆", value: 41 },
]

// 月度趋势 折线
export const months = ["02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"]
export const lineTrend = [320, 402, 391, 534, 620, 730, 812, 690, 760, 880, 940]

// 月度统计 柱状
export const barStats = [220, 302, 281, 434, 390, 530, 610, 480, 520, 640, 720]

// 表格
export const tableRows = [
  { city: "北京", stock: 1280, rate: "86%" },
  { city: "上海", stock: 1064, rate: "78%" },
  { city: "广州", stock: 932, rate: "71%" },
  { city: "成都", stock: 806, rate: "64%" },
  { city: "西安", stock: 654, rate: "58%" },
]

// 雷达图：年度空置率
export const radarIndicators = [
  { name: "一季度", max: 100 },
  { name: "二季度", max: 100 },
  { name: "三季度", max: 100 },
  { name: "四季度", max: 100 },
  { name: "年均", max: 100 },
  { name: "预测", max: 100 },
]
export const radarValues = [42, 58, 65, 48, 53, 60]
