"use client"

import { useMemo } from "react"
import { EChart } from "./echart"
import { months, lineTrend, COLORS } from "@/lib/dashboard-data"

export function LineTrend() {
  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { top: 16, right: 12, bottom: 22, left: 34 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { lineStyle: { color: COLORS.grid } },
        axisLabel: { color: COLORS.textDim, fontSize: 10, interval: 1 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: COLORS.grid } },
        axisLabel: { color: COLORS.textDim, fontSize: 10 },
      },
      series: [
        {
          type: "line",
          data: lineTrend,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: COLORS.teal, width: 2.5, shadowColor: "rgba(14,165,164,0.4)", shadowBlur: 10 },
          itemStyle: { color: COLORS.orange, borderColor: "#fff", borderWidth: 1.5 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(14,165,164,0.35)" },
                { offset: 1, color: "rgba(14,165,164,0.02)" },
              ],
            },
          },
        },
      ],
    }),
    [],
  )

  return <EChart option={option as any} />
}
