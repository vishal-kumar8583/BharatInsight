"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { INDIAN_STATES, YEARS, getDataset } from "@/lib/data";
import { getDepartment } from "@/lib/departments";
import { Search, X, SlidersHorizontal, MapPin, Calendar, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const sel = "bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors cursor-pointer appearance-none pr-8 select-styled";

export function FilterBar() {
  const { filters, setFilter, resetFilters, activeDepartment } = useDashboardStore();
  const dept = getDepartment(activeDepartment);
  const { add: toast } = useToast();
  const hasFilters = Object.values(filters).some(Boolean);

  // Get unique metrics for this department
  const metrics = useMemo(() => {
    const data = getDataset(activeDepartment);
    return Array.from(new Set(data.map((r) => r.metric))).sort();
  }, [activeDepartment]);

  const handleReset = () => {
    resetFilters();
    toast("All filters cleared", "info");
  };

  const activeCount = [filters.state, filters.year, filters.metric, filters.search].filter(Boolean).length;

  return (
    <div className="border-b border-border bg-surface/60 shrink-0">
      {/* Main filter row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative min-w-[180px] max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent/50 transition-colors filter-input"
          />
          {filters.search && (
            <button onClick={() => setFilter("search", "")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* State */}
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          <select
            value={filters.state}
            onChange={(e) => setFilter("state", e.target.value)}
            className={`${sel} pl-7 ${filters.state ? `${dept.color} border-current/30` : ""}`}
          >
            <option value="">All States</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          <select
            value={filters.year}
            onChange={(e) => setFilter("year", e.target.value)}
            className={`${sel} pl-7 ${filters.year ? "text-amber-400 border-amber-500/30" : ""}`}
          >
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>

        {/* Metric */}
        <div className="relative">
          <BarChart2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          <select
            value={filters.metric}
            onChange={(e) => setFilter("metric", e.target.value)}
            className={`${sel} pl-7 max-w-[180px] ${filters.metric ? "text-violet-400 border-violet-500/30" : ""}`}
          >
            <option value="">All Metrics</option>
            {metrics.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Active filter count + clear */}
        <div className="ml-auto flex items-center gap-2">
          {activeCount > 0 && (
            <>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dept.bgColor} ${dept.color} border ${dept.borderColor}`}>
                {activeCount} filter{activeCount > 1 ? "s" : ""} active
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors border border-border hover:border-rose-500/30 rounded-lg px-2.5 py-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            </>
          )}
          {!activeCount && (
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs text-slate-600">No filters</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
