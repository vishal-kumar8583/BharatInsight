"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { getDataset } from "@/lib/data";
import { getDepartment } from "@/lib/departments";
import { TrendingUp, TrendingDown, Database, MapPin } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function StatsBar() {
  const { activeDepartment, filters } = useDashboardStore();
  const dept = getDepartment(activeDepartment);

  const stats = useMemo(() => {
    const data = getDataset(activeDepartment);
    let filtered = data;
    if (filters.state) filtered = filtered.filter((r) => r.state === filters.state);
    if (filters.year) filtered = filtered.filter((r) => r.year === parseInt(filters.year));
    const total = filtered.length;
    const avgValue = total ? filtered.reduce((s, r) => s + r.value, 0) / total : 0;
    const avgGrowth = total ? filtered.reduce((s, r) => s + r.growth, 0) / total : 0;
    const uniqueStates = new Set(filtered.map((r) => r.state)).size;
    return { total, avgValue, avgGrowth, uniqueStates };
  }, [activeDepartment, filters]);

  const items = [
    { label: "Records",    value: stats.total.toLocaleString("en-IN"), Icon: Database,    color: dept.color },
    { label: "Avg Value",  value: formatNumber(stats.avgValue),         Icon: TrendingUp,  color: "text-blue-400" },
    {
      label: "Avg Growth",
      value: `${stats.avgGrowth >= 0 ? "+" : ""}${stats.avgGrowth.toFixed(1)}%`,
      Icon: stats.avgGrowth >= 0 ? TrendingUp : TrendingDown,
      color: stats.avgGrowth >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    { label: "States",     value: String(stats.uniqueStates),           Icon: MapPin,      color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-border bg-background/30 shrink-0">
      {items.map(({ label, value, Icon, color }, i) => (
        <div
          key={label}
          className={`flex items-center gap-2.5 px-4 py-2.5 ${i < items.length - 1 ? "border-r border-border/50" : ""}`}
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
          </div>
          <div className="min-w-0">
            <div className={`text-sm font-bold font-mono truncate ${color}`}>{value}</div>
            <div className="text-xs text-slate-600">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
