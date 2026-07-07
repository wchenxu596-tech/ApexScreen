import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Variant = "blue" | "teal" | "orange" | "violet"

interface PanelProps {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  blue: "dv-glass-blue",
  teal: "dv-glass-teal",
  orange: "dv-glass-orange",
  violet: "dv-glass-violet",
}

const dotColor: Record<Variant, string> = {
  blue: "var(--dv-cyan)",
  teal: "var(--dv-teal)",
  orange: "var(--dv-orange)",
  violet: "#6366f1",
}

export function Panel({ title, children, className, action, variant = "blue" }: PanelProps) {
  return (
    <section
      className={cn("dv-glass dv-glass-band dv-corners flex flex-col p-3", variantClass[variant], className)}
    >
      <span className="dv-band" />
      <header className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3.5 w-1 rounded-full"
            style={{ backgroundColor: dotColor[variant], boxShadow: `0 0 8px ${dotColor[variant]}` }}
          />
          <h2 className="text-sm font-semibold tracking-widest text-[var(--dv-text)]">{title}</h2>
        </div>
        {action}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}
