<script setup lang="ts">
/**
 * CategoryShareChart — 分类占比环形图
 * 展示各分类的占比分布
 */
import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CategoryShare } from '../../types'

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

defineOptions({ name: 'CategoryShareChart' })

const props = defineProps<{
  data: CategoryShare[]
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f87171', '#38bdf8']

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#e2e8f0', fontSize: 12 },
    formatter: '{b}: {c}% ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      type: 'pie',
      radius: ['35%', '80%'],
      center: ['45%', '50%'],
      avoidLabelOverlap: true,
      padAngle: 2,
      itemStyle: { borderRadius: 4, borderColor: '#0f172a', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' },
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
      },
      data: props.data.map((d) => ({ name: d.name, value: d.value })),
    },
  ],
  color: COLORS,
}))

function init() {
  if (!chartRef.value) return
  chartInstance.value?.dispose()
  const inst = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  inst.setOption(option.value)
  chartInstance.value = inst
}

function resize() {
  chartInstance.value?.resize()
}

watch(option, () => chartInstance.value?.setOption(option.value, { notMerge: true }), {
  deep: true,
})
watch(
  () => props.loading,
  (val) => {
    if (!val) nextTick(() => resize())
  },
)
onMounted(async () => {
  await nextTick()
  init()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div v-show="!loading" ref="chartRef" class="chart-container" />
  <div v-show="loading" class="chart-placeholder">加载中…</div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  flex: 1;
  min-height: 0;
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: rgb(255, 255, 255, 30%);
  font-size: 13px;
}
</style>
