"use client"

import { useMemo } from "react"
import { EChart } from "./echart"
import { donutData, donutTotal, COLORS } from "@/lib/dashboard-data"

const palette = ["#f97316", "#2563eb", "#0ea5a4", "#94a3b8"]

export function DonutChart() {
  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: {
        orient: "vertical",
        right: 0,
        top: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: COLORS.textDim, fontSize: 11 },
      },
      title: {
        text: donutTotal.toLocaleString(),
        subtext: "城市总数",
        left: "32%",
        top: "38%",
        textAlign: "center",
        textStyle: { color: COLORS.orange, fontSize: 22, fontWeight: "bold" },
        subtextStyle: { color: COLORS.textDim, fontSize: 11 },
      },
      series: [
        {
          type: "pie",
          radius: ["52%", "72%"],
          center: ["33%", "50%"],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          data: donutData.map((d, i) => ({
            ...d,
            itemStyle: { color: palette[i % palette.length] },
          })),
        },
      ],
    }),
    [],
  )

  return <EChart option={option as any} />
}
