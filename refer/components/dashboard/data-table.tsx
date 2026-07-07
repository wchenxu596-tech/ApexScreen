import { tableRows } from "@/lib/dashboard-data"

export function DataTable() {
  return (
    <div className="flex h-full flex-col text-xs">
      <div className="grid grid-cols-3 rounded bg-[rgba(74,144,226,0.18)] px-3 py-2 font-medium tracking-wider text-[var(--dv-cyan)]">
        <span>城市</span>
        <span className="text-center">总库存</span>
        <span className="text-right">使用率</span>
      </div>
      <div className="flex flex-1 flex-col justify-around">
        {tableRows.map((row, i) => (
          <div
            key={row.city}
            className={`grid grid-cols-3 px-3 py-2 ${
              i % 2 === 0 ? "bg-transparent" : "bg-[rgba(139,163,189,0.06)]"
            }`}
          >
            <span className="text-[var(--dv-text)]">{row.city}</span>
            <span className="text-center font-mono text-[var(--dv-text-dim)]">{row.stock.toLocaleString()}</span>
            <span className="text-right font-mono font-semibold text-[var(--dv-orange)]">{row.rate}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
