"use client"

import { useEffect, useState, useMemo } from "react"
import * as echarts from "echarts"
import { EChart } from "./echart"

const GEO_URL = "/geo/china.json"

export function MiniMap() {
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
      geo: {
        map: "china",
        roam: false,
        zoom: 1.2,
        silent: true,
        itemStyle: {
          areaColor: "rgba(37,99,235,0.16)",
          borderColor: "rgba(37,99,235,0.6)",
          borderWidth: 0.6,
        },
      },
    }),
    [],
  )

  return (
    <div className="dv-glass h-24 w-32 overflow-hidden p-1">
      <div className="mb-0.5 px-1 text-[10px] tracking-wider text-[var(--dv-text-dim)]">区域缩略</div>
      <div className="h-[70px] w-full">{ready ? <EChart option={option as any} /> : null}</div>
    </div>
  )
}
