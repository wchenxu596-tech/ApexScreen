"use client"

import { useEffect, useState, useMemo } from "react"
import * as echarts from "echarts"
import { EChart } from "./echart"
import { cityPoints, COLORS } from "@/lib/dashboard-data"

const GEO_URL = "/geo/china.json"

export function ChinaMap() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((geo) => {
        if (!active) return
        echarts.registerMap("china", geo)
        setReady(true)
      })
      .catch(() => setReady(false))
    return () => {
      active = false
    }
  }, [])

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: COLORS.cyan,
        textStyle: { color: COLORS.text },
        formatter: (p: any) =>
          p.seriesType === "effectScatter" ? `${p.name}<br/>数值：<b style="color:${COLORS.orange}">${p.value[2]}</b>` : p.name,
      },
      geo: {
        map: "china",
        roam: true,
        zoom: 1.15,
        label: { show: false },
        itemStyle: {
          areaColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(191,219,254,0.85)" },
              { offset: 1, color: "rgba(224,242,254,0.9)" },
            ],
          },
          borderColor: "rgba(37,99,235,0.55)",
          borderWidth: 1,
          shadowColor: "rgba(37,99,235,0.25)",
          shadowBlur: 18,
        },
        emphasis: {
          itemStyle: { areaColor: "rgba(37,99,235,0.35)" },
          label: { show: false },
        },
      },
      series: [
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: cityPoints,
          symbolSize: (v: number[]) => 6 + v[2] / 12,
          rippleEffect: { brushType: "stroke", scale: 3.5 },
          showEffectOn: "render",
          itemStyle: {
            color: COLORS.orange,
            shadowBlur: 12,
            shadowColor: COLORS.orange,
          },
          label: {
            show: true,
            position: "right",
            formatter: (p: any) => `{n|${p.name}} {v|${p.value[2]}}`,
            rich: {
              n: { color: COLORS.text, fontSize: 11, padding: [0, 0, 0, 2] },
              v: { color: COLORS.orange, fontSize: 12, fontWeight: "bold" },
            },
          },
        },
      ],
    }),
    [],
  )

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--dv-text-dim)]">
        <span className="animate-pulse">地图数据加载中…</span>
      </div>
    )
  }

  return <EChart option={option as any} />
}
