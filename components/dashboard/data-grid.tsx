"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDashboardStore } from "@/store/dashboard-store";
import { getDataset, DataRecord } from "@/lib/data";
import { getDepartment } from "@/lib/departments";
import { formatNumber, formatGrowth } from "@/lib/utils";
import Fuse from "fuse.js";
import {
  TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, SearchX,
} from "lucide-react";
import { SkeletonGrid } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type SortConfig = { key: keyof DataRecord; dir: "asc" | "desc" } | null;

const COLUMNS = [
  { key: "id" as const,       label: "#",        width: 56  },
  { key: "state" as const,    label: "State",    width: 160 },
  { key: "district" as const, label: "District", width: 140 },
  { key: "year" as const,     label: "Year",     width: 72  },
  { key: "metric" as const,   label: "Metric",   width: 210 },
  { key: "value" as const,    label: "Value",    width: 110 },
  { key: "unit" as const,     label: "Unit",     width: 100 },
  { key: "growth" as const,   label: "Growth",   width: 100 },
  { key: "rank" as const,     label: "Rank",     width: 72  },
];
const ROW_HEIGHT = 44;

export function DataGrid() {
  const { activeDepartment, filters, resetFilters } = useDashboardStore();
  const dept = getDepartment(activeDepartment);
  const { add: toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortConfig>({ key: "state", dir: "asc" });
  const [focusedRow, setFocusedRow] = useState(-1);
  const parentRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataRecord[]>([]);

  const totalWidth = COLUMNS.reduce((s, c) => s + c.width, 0);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setData(getDataset(activeDepartment));
      setLoading(false);
      toast(`${getDepartment(activeDepartment).shortName} data loaded`, "success");
    }, 500);
    return () => clearTimeout(t);
  }, [activeDepartment]);

  const fuse = useMemo(
    () => new Fuse(data, { keys: ["state", "district", "metric", "category"], threshold: 0.35, includeScore: true }),
    [data]
  );

  const filtered = useMemo(() => {
    let result = data;
    if (filters.search) result = fuse.search(filters.search).map((r) => r.item);
    if (filters.state)  result = result.filter((r) => r.state === filters.state);
    if (filters.year)   result = result.filter((r) => r.year === parseInt(filters.year));
    if (filters.metric) result = result.filter((r) => r.metric === filters.metric);
    if (sort) {
      result = [...result].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        if (cmp !== 0) return sort.dir === "asc" ? cmp : -cmp;
        if (sort.key === "state" || sort.key === "metric") return a.year - b.year;
        return 0;
      });
    }
    return result;
  }, [data, filters, sort, fuse]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  });

  const handleSort = (key: keyof DataRecord) => {
    setSort((prev) =>
      prev?.key === key ? (prev.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }
    );
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusedRow((r) => Math.min(r + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedRow((r) => Math.max(r - 1, 0)); }
  }, [filtered.length]);

  if (loading) return <SkeletonGrid />;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/40 shrink-0">
        <span className="text-xs text-slate-500">
          Showing <span className={`font-semibold ${dept.color}`}>{filtered.length.toLocaleString("en-IN")}</span>{" "}
          of <span className="text-slate-400">{data.length.toLocaleString("en-IN")}</span> records
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${dept.bgColor} ${dept.color} border ${dept.borderColor}`}>
          {dept.shortName}
        </span>
      </div>

      <div ref={parentRef} className="flex-1 overflow-auto" onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none" }}>
        <div style={{ minWidth: totalWidth }}>
          {/* Header */}
          <div className="flex border-b border-border bg-[#0d0d14] sticky top-0 z-10" style={{ minWidth: totalWidth }}>
            {COLUMNS.map((col) => (
              <button
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider transition-colors shrink-0 select-none"
                style={{ width: col.width, minWidth: col.width }}
              >
                {col.label}
                {sort?.key === col.key ? (
                  sort.dir === "asc" ? <ChevronUp className="w-3 h-3 text-accent" /> : <ChevronDown className="w-3 h-3 text-accent" />
                ) : <span className="w-3 h-3 inline-block" />}
              </button>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <SearchX className="w-7 h-7 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">No records found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search query</p>
              </div>
              <button
                onClick={() => { resetFilters(); toast("Filters cleared", "info"); }}
                className="text-xs text-accent hover:text-white border border-accent/30 hover:border-accent px-4 py-1.5 rounded-lg transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
              {virtualizer.getVirtualItems().map((vItem) => {
                const row = filtered[vItem.index];
                const isFocused = focusedRow === vItem.index;
                const isEven = vItem.index % 2 === 0;
                return (
                  <div
                    key={vItem.key}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    onClick={() => setFocusedRow(vItem.index)}
                    className={`absolute top-0 left-0 flex items-center border-b border-border/40 cursor-pointer transition-colors
                      ${isFocused ? "bg-accent/10 border-l-2 border-l-accent" : isEven ? "bg-transparent hover:bg-white/[0.02]" : "bg-white/[0.015] hover:bg-white/[0.03]"}`}
                    style={{ transform: `translateY(${vItem.start}px)`, height: ROW_HEIGHT, width: totalWidth }}
                  >
                    <Cell w={56}  className="text-xs text-slate-600">{row.id}</Cell>
                    <Cell w={160} className="text-sm text-white font-medium">{row.state}</Cell>
                    <Cell w={140} className="text-sm text-slate-400">{row.district}</Cell>
                    <Cell w={72}  className="text-sm text-slate-300">{row.year}</Cell>
                    <Cell w={210} className="text-xs text-slate-300">{row.metric}</Cell>
                    <Cell w={110} className={`text-sm font-mono font-semibold ${dept.color}`}>{formatNumber(row.value)}</Cell>
                    <Cell w={100} className="text-xs text-slate-500">{row.unit}</Cell>
                    <Cell w={100} className="flex items-center gap-1">
                      {row.growth > 0 ? <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                        : row.growth < 0 ? <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                        : <Minus className="w-3 h-3 text-slate-500 shrink-0" />}
                      <span className={`text-xs font-mono ${row.growth > 0 ? "text-emerald-400" : row.growth < 0 ? "text-rose-400" : "text-slate-500"}`}>
                        {formatGrowth(row.growth)}
                      </span>
                    </Cell>
                    <Cell w={72} className="text-sm text-slate-400">#{row.rank}</Cell>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Cell({ w, className = "", children }: { w: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-3 shrink-0 truncate ${className}`} style={{ width: w, minWidth: w }}>
      {children}
    </div>
  );
}
