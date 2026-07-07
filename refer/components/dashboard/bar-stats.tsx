"use client"

import { useMemo } from "react"
import { EChart } from "./echart"
import { months, barStats, COLORS } from "@/lib/dashboard-data"

export function BarStats() {
  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { top: 16, right: 12, bottom: 22, left: 34 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
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
          type: "bar",
          data: barStats,
          barWidth: "45%",
          itemStyle: {
            borderRadius: [3, 3, 0, 0],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#6366f1" },
                { offset: 1, color: "rgba(99,102,241,0.15)" },
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
