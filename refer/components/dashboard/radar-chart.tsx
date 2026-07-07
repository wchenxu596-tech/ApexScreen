"use client"

import { useMemo } from "react"
import { EChart } from "./echart"
import { radarIndicators, radarValues, COLORS } from "@/lib/dashboard-data"

export function RadarChart() {
  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: { trigger: "item" },
      radar: {
        indicator: radarIndicators,
        radius: "62%",
        center: ["50%", "52%"],
        axisName: { color: COLORS.textDim, fontSize: 11 },
        splitLine: { lineStyle: { color: COLORS.grid } },
        splitArea: { areaStyle: { color: ["rgba(74,144,226,0.04)", "rgba(74,144,226,0.09)"] } },
        axisLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: radarValues,
              name: "年度空置率(%)",
              symbolSize: 5,
              lineStyle: { color: COLORS.orange, width: 2 },
              itemStyle: { color: COLORS.orange },
              areaStyle: { color: "rgba(255,107,0,0.28)" },
            },
          ],
        },
      ],
    }),
    [],
  )

  return <EChart option={option as any} />
}
