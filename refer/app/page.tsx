import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Panel } from "@/components/dashboard/panel"
import { ChinaMap } from "@/components/dashboard/china-map"
import { MiniMap } from "@/components/dashboard/mini-map"
import { DonutChart } from "@/components/dashboard/donut-chart"
import { RankList } from "@/components/dashboard/rank-list"
import { LineTrend } from "@/components/dashboard/line-trend"
import { BarStats } from "@/components/dashboard/bar-stats"
import { DataTable } from "@/components/dashboard/data-table"
import { RadarChart } from "@/components/dashboard/radar-chart"

export default function Page() {
  return (
    <main className="dv-screen flex h-screen min-h-screen flex-col overflow-hidden p-3">
      <DashboardHeader />

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 pt-3">
        {/* 左栏 */}
        <div className="col-span-12 grid grid-rows-3 gap-3 md:col-span-3">
          <Panel title="城市数量占比" variant="blue">
            <DonutChart />
          </Panel>
          <Panel title="TOP10 城市排行" variant="orange">
            <RankList />
          </Panel>
          <Panel title="月度使用趋势" variant="teal">
            <LineTrend />
          </Panel>
        </div>

        {/* 中栏 */}
        <div className="relative col-span-12 md:col-span-6">
          <Panel title="全国分布态势" variant="blue" className="h-full">
            <ChinaMap />
          </Panel>
          <div className="absolute right-5 top-11 z-10">
            <MiniMap />
          </div>
        </div>

        {/* 右栏 */}
        <div className="col-span-12 grid grid-rows-3 gap-3 md:col-span-3">
          <Panel title="月度使用统计分析" variant="violet">
            <BarStats />
          </Panel>
          <Panel title="城市库存明细" variant="teal">
            <DataTable />
          </Panel>
          <Panel title="年度空置率统计" variant="orange">
            <RadarChart />
          </Panel>
        </div>
      </div>
    </main>
  )
}
