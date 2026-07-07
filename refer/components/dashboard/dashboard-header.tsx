"use client"

import { useEffect, useState } from "react"

export function DashboardHeader() {
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    setNow(fmt())
    const t = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-center">
      {/* 背景光带 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--dv-cyan)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-1/4 bottom-0 h-16 bg-[radial-gradient(ellipse_at_bottom,rgba(74,144,226,0.25),transparent_70%)]" />

      <h1 className="dv-title-glow text-2xl font-bold text-[var(--dv-text)] md:text-3xl">信息综合管理平台</h1>

      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-2 text-xs text-[var(--dv-text-dim)] md:flex">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--dv-orange)]" />
        系统运行中
      </div>
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 font-mono text-xs text-[var(--dv-text-dim)] md:block">
        {now}
      </div>
    </header>
  )
}
