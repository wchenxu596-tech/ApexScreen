/** * CityRankingChart — 城市排名横向柱状图 * 按访问量排序展示城市排名 */
<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CityRank } from '../../types'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

defineOptions({ name: 'CityRankingChart' })

const props = defineProps<{
  data: CityRank[]
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#e2e8f0', fontSize: 12 },
    axisPointer: { type: 'shadow' },
    formatter: (params: { name: string; value: number }[]) => {
      const d = props.data.find((c) => c.city === params[0].name)
      return `${params[0].name}<br/>访问量：${params[0].value.toLocaleString()}<br/>同比增长：${d?.growth ?? 0}%`
    },
  },
  grid: { left: 70, right: 50, top: 8, bottom: 16 },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } },
    axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10 },
  },
  yAxis: {
    type: 'category',
    data: props.data.map((d) => d.city).reverse(),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  },
  series: [
    {
      type: 'bar',
      data: props.data
        .map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: `rgba(96, 165, 250, ${0.4 + (i / props.data.length) * 0.5})` },
              { offset: 1, color: '#60a5fa' },
            ]),
            borderRadius: [0, 3, 3, 0],
          },
        }))
        .reverse(),
      barWidth: 14,
      label: {
        show: true,
        position: 'right',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        formatter: (p: { value: number }) => p.value.toLocaleString(),
      },
    },
  ],
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
  <div v-if="!loading" ref="chartRef" class="chart-container" />
  <div v-else class="chart-placeholder">加载中…</div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0;
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(255, 255, 255, 30%);
  font-size: 13px;
}
</style>
