import { rankData } from "@/lib/dashboard-data"

export function RankList() {
  const max = Math.max(...rankData.map((d) => d.value))

  return (
    <ul className="flex h-full flex-col justify-between gap-1.5 overflow-hidden">
      {rankData.map((item, i) => {
        const top3 = i < 3
        return (
          <li key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                top3
                  ? "bg-[var(--dv-orange)] text-white shadow-[0_0_8px_var(--dv-orange)]"
                  : "bg-[rgba(74,144,226,0.25)] text-[var(--dv-cyan)]"
              }`}
            >
              {i + 1}
            </span>
            <span className="w-14 shrink-0 truncate text-[var(--dv-text)]">{item.name}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(139,163,189,0.12)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: top3
                    ? "linear-gradient(90deg,#ff6b00,#ff9d4d)"
                    : "linear-gradient(90deg,#2b6cb0,#4a90e2)",
                  boxShadow: top3 ? "0 0 8px rgba(255,107,0,0.6)" : "0 0 6px rgba(74,144,226,0.5)",
                }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-mono text-[var(--dv-orange)]">{item.value}</span>
          </li>
        )
      })}
    </ul>
  )
}
