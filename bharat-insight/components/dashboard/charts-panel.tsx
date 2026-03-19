"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/dashboard-store";
import { getDataset } from "@/lib/data";
import { getDepartment } from "@/lib/departments";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, Brush,
} from "recharts";
import { BarChart2, TrendingUp, PieChart as PieIcon, Activity, Maximize2, X, Hexagon } from "lucide-react";

// ─── colour palette ──────────────────────────────────────────────────────────
const PALETTE = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#ec4899","#14b8a6"];

// ─── shared tooltip style ────────────────────────────────────────────────────
const TT_STYLE = {
  backgroundColor: "#111118",
  border: "1px solid #1e1e2e",
  borderRadius: 10,
  color: "#e2e8f0",
  fontSize: 12,
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

// ─── data hook ───────────────────────────────────────────────────────────────
function useChartData() {
  const { activeDepartment, filters } = useDashboardStore();
  const dept = getDepartment(activeDepartment);

  return useMemo(() => {
    const raw = getDataset(activeDepartment);
    let data = raw;
    if (filters.state) data = data.filter((r) => r.state === filters.state);
    if (filters.year)  data = data.filter((r) => r.year === parseInt(filters.year));

    // Top 10 states by avg value
    const byState: Record<string, number[]> = {};
    data.forEach((r) => { (byState[r.state] ??= []).push(r.value); });
    const stateBar = Object.entries(byState)
      .map(([state, v]) => ({ state: state.split(" ")[0], fullState: state, avg: +(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1), count: v.length }))
      .sort((a, b) => b.avg - a.avg).slice(0, 10);

    // Year trend with growth overlay
    const byYear: Record<number, { vals: number[]; growths: number[] }> = {};
    data.forEach((r) => {
      (byYear[r.year] ??= { vals: [], growths: [] }).vals.push(r.value);
      byYear[r.year].growths.push(r.growth);
    });
    const yearLine = Object.entries(byYear)
      .map(([y, d]) => ({
        year: parseInt(y),
        avg: +(d.vals.reduce((a,b)=>a+b,0)/d.vals.length).toFixed(1),
        growth: +(d.growths.reduce((a,b)=>a+b,0)/d.growths.length).toFixed(2),
        count: d.vals.length,
      }))
      .sort((a, b) => a.year - b.year);

    // Growth distribution for pie
    const pos = data.filter((r) => r.growth > 2).length;
    const neg = data.filter((r) => r.growth < -2).length;
    const neu = data.length - pos - neg;
    const growthPie = [
      { name: "Growing",   value: pos, color: "#10b981" },
      { name: "Stable",    value: neu, color: "#6366f1" },
      { name: "Declining", value: neg, color: "#f43f5e" },
    ].filter((s) => s.value > 0);

    // Radar: top 6 metrics normalised 0-100
    const byMetric: Record<string, number[]> = {};
    data.forEach((r) => { (byMetric[r.metric] ??= []).push(r.value); });
    const metricEntries = Object.entries(byMetric)
      .map(([m, v]) => ({ metric: m.replace(/\(.*\)/,"").trim().slice(0,18), avg: v.reduce((a,b)=>a+b,0)/v.length }))
      .sort((a,b) => b.avg - a.avg).slice(0, 6);
    const mMax = Math.max(...metricEntries.map((m) => m.avg)) || 1;
    const radarData = metricEntries.map((m) => ({ metric: m.metric, value: +((m.avg/mMax)*100).toFixed(1) }));

    // Scatter: value vs growth (sample 300)
    const step = Math.max(1, Math.floor(data.length / 300));
    const scatter = data.filter((_,i) => i % step === 0).map((r) => ({
      value: +r.value.toFixed(1), growth: +r.growth.toFixed(1), state: r.state, metric: r.metric,
    }));

    // Stacked bar: top 5 states × top 3 metrics
    const top5States = stateBar.slice(0, 5).map((s) => s.fullState);
    const top3Metrics = metricEntries.slice(0, 3).map((m) => m.metric);
    const stackedMap: Record<string, Record<string, number[]>> = {};
    data.filter((r) => top5States.includes(r.state) && top3Metrics.some((m) => r.metric.startsWith(m)))
      .forEach((r) => {
        const mk = top3Metrics.find((m) => r.metric.startsWith(m)) ?? r.metric;
        (stackedMap[r.state] ??= {})[mk] ??= [];
        stackedMap[r.state][mk].push(r.value);
      });
    const stackedBar = top5States.map((s) => {
      const row: Record<string, string | number> = { state: s.split(" ")[0] };
      top3Metrics.forEach((m) => {
        const vals = stackedMap[s]?.[m] ?? [];
        row[m] = vals.length ? +(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : 0;
      });
      return row;
    });

    // Summary stats
    const allValues = data.map((r) => r.value);
    const allGrowths = data.map((r) => r.growth);
    const overallAvg = allValues.length ? +(allValues.reduce((a,b)=>a+b,0)/allValues.length).toFixed(1) : 0;
    const overallGrowth = allGrowths.length ? +(allGrowths.reduce((a,b)=>a+b,0)/allGrowths.length).toFixed(1) : 0;
    const minVal = allValues.length ? +Math.min(...allValues).toFixed(1) : 0;
    const maxVal = allValues.length ? +Math.max(...allValues).toFixed(1) : 0;
    const years = [...new Set(data.map((r) => r.year))].sort();
    const stateCount = Object.keys(byState).length;

    return { stateBar, yearLine, growthPie, radarData, scatter, stackedBar, top3Metrics, dept, total: data.length, overallAvg, overallGrowth, minVal, maxVal, years, stateCount };
  }, [activeDepartment, filters]);
}

// ─── Expand modal ────────────────────────────────────────────────────────────
function ExpandModal({ title, children, onClose, description, insights, takeaway, howToRead, showInfo, setShowInfo }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  description?: string;
  insights?: { label: string; value: string; positive?: boolean }[];
  takeaway?: string;
  howToRead?: { zone: string; color: string; meaning: string }[];
  showInfo: boolean;
  setShowInfo: (v: boolean | ((prev: boolean) => boolean)) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 260 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold">{title}</span>
          <div className="flex items-center gap-2">
            {description && (
              <button
                onClick={() => setShowInfo((v) => !v)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors border font-medium ${showInfo ? "border-accent/40 text-accent bg-accent/10" : "border-border text-slate-500 hover:text-white bg-white/5"}`}
              >
                Details
              </button>
            )}
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showInfo && description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-lg border border-border bg-background/60 p-4 space-y-3">
                {takeaway && (
                  <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-2">
                    <span className="text-accent text-sm mt-0.5">💡</span>
                    <p className="text-sm text-accent leading-relaxed font-medium">{takeaway}</p>
                  </div>
                )}
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                {howToRead && howToRead.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">How to read</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {howToRead.map((z) => (
                        <div key={z.zone} className="flex items-center gap-2 bg-white/5 rounded-md px-2.5 py-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: z.color }} />
                          <span className="text-xs font-semibold" style={{ color: z.color }}>{z.zone}:</span>
                          <span className="text-xs text-slate-400">{z.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {insights && insights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                    {insights.map((ins) => (
                      <div key={ins.label} className="flex items-center gap-1.5 bg-white/5 border border-border rounded-md px-2.5 py-1.5">
                        <span className="text-xs text-slate-500">{ins.label}:</span>
                        <span className={`text-xs font-semibold font-mono ${ins.positive === true ? "text-emerald-400" : ins.positive === false ? "text-rose-400" : "text-white"}`}>
                          {ins.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: 520 }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({
  icon: Icon, title, subtitle, color, children, expandContent, description, insights, takeaway, howToRead,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string; subtitle: string; color: string;
  children: React.ReactNode;
  expandContent?: () => React.ReactNode;
  description?: string;
  insights?: { label: string; value: string; positive?: boolean }[];
  takeaway?: string;
  howToRead?: { zone: string; color: string; meaning: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const detailsPanel = (compact = true) => description && (
    <AnimatePresence>
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={`${compact ? "mb-3" : "mb-4"} rounded-lg border border-border bg-background/60 p-3 space-y-3`}>
            {/* Takeaway */}
            {takeaway && (
              <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-2">
                <span className="text-accent text-xs mt-0.5">💡</span>
                <p className="text-xs text-accent leading-relaxed font-medium">{takeaway}</p>
              </div>
            )}
            {/* Description */}
            <p className={`${compact ? "text-xs" : "text-sm"} text-slate-400 leading-relaxed`}>{description}</p>
            {/* How to read */}
            {howToRead && howToRead.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">How to read</p>
                <div className="grid grid-cols-1 gap-1">
                  {howToRead.map((z) => (
                    <div key={z.zone} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: z.color }} />
                      <span className="text-xs font-medium" style={{ color: z.color }}>{z.zone}:</span>
                      <span className="text-xs text-slate-500">{z.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Insight pills */}
            {insights && insights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                {insights.map((ins) => (
                  <div key={ins.label} className="flex items-center gap-1.5 bg-white/5 border border-border rounded-md px-2 py-1">
                    <span className="text-xs text-slate-500">{ins.label}:</span>
                    <span className={`text-xs font-semibold font-mono ${ins.positive === true ? "text-emerald-400" : ins.positive === false ? "text-rose-400" : "text-white"}`}>
                      {ins.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-surface border border-border rounded-xl p-4 flex flex-col group hover:border-white/10 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {description && (
              <button
                onClick={() => setShowInfo((v) => !v)}
                className={`text-xs px-2 py-0.5 rounded-md transition-colors border font-medium ${showInfo ? "border-accent/40 text-accent bg-accent/10" : "border-border text-slate-500 hover:text-white bg-white/5"}`}
              >
                Details
              </button>
            )}
            {expandContent && (
              <button
                onClick={() => setExpanded(true)}
                className="text-slate-600 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {detailsPanel(true)}
        <div className="flex-1">{children}</div>
      </motion.div>

      <AnimatePresence>
        {expanded && expandContent && (
          <ExpandModal
            title={title} onClose={() => setExpanded(false)}
            description={description} insights={insights}
            takeaway={takeaway} howToRead={howToRead}
            showInfo={showInfo} setShowInfo={setShowInfo}
          >
            {expandContent()}
          </ExpandModal>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Custom tooltip components ───────────────────────────────────────────────
const BarTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_STYLE} className="px-3 py-2 space-y-1">
      <p className="font-semibold text-white">{payload[0]?.payload?.fullState ?? label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">{Number(p.value).toLocaleString("en-IN")}</span>
        </p>
      ))}
    </div>
  );
};

const LineTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_STYLE} className="px-3 py-2 space-y-1">
      <p className="font-semibold text-white">Year {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={TT_STYLE} className="px-3 py-2">
      <p style={{ color: d.payload.color }} className="font-semibold">{d.name}</p>
      <p className="text-slate-300">Count: <span className="font-mono font-bold text-white">{d.value.toLocaleString("en-IN")}</span></p>
      <p className="text-slate-300">Share: <span className="font-mono font-bold text-white">{((d.value / d.payload.total) * 100).toFixed(1)}%</span></p>
    </div>
  );
};

const ScatterTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={TT_STYLE} className="px-3 py-2 space-y-0.5">
      <p className="font-semibold text-white text-xs">{d?.state}</p>
      <p className="text-slate-400 text-xs truncate max-w-[160px]">{d?.metric}</p>
      <p className="text-slate-300 text-xs">Value: <span className="font-mono text-white">{d?.value}</span></p>
      <p className="text-slate-300 text-xs">Growth: <span className={`font-mono font-bold ${d?.growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{d?.growth > 0 ? "+" : ""}{d?.growth}%</span></p>
    </div>
  );
};

// ─── Individual charts ────────────────────────────────────────────────────────

function TopStatesBar() {
  const { stateBar, dept } = useChartData();
  const [metric, setMetric] = useState<"avg" | "count">("avg");

  const chart = (h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={stateBar} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
        <XAxis dataKey="state" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={45}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <Tooltip content={<BarTip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
        <Bar dataKey={metric} name={metric === "avg" ? "Avg Value" : "Records"} radius={[4,4,0,0]}
          fill={dept.accentColor}
        >
          {stateBar.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const toggles = (
    <div className="flex gap-1 mb-3">
      {(["avg","count"] as const).map((m) => (
        <button key={m} onClick={() => setMetric(m)}
          className={`text-xs px-2 py-0.5 rounded-md transition-all ${metric === m ? "bg-accent text-white" : "text-slate-500 hover:text-slate-300 bg-white/5"}`}>
          {m === "avg" ? "Avg Value" : "Record Count"}
        </button>
      ))}
    </div>
  );

  const top = stateBar[0];
  const bottom = stateBar[stateBar.length - 1];

  return (
    <ChartCard icon={BarChart2} title="Top States" subtitle="Click bars to explore" color={dept.accentColor}
      description={`Ranks the top 10 states by their average ${dept.name} metric value. Each bar represents one state — taller bars mean higher performance. Switch to "Record Count" to see which states have the most data points. Use the state filter above to drill into a single state.`}
      takeaway={top && bottom ? `${top.fullState} leads with an average of ${top.avg.toLocaleString("en-IN")}, which is ${(top.avg / (bottom.avg || 1)).toFixed(1)}× higher than the lowest-ranked state (${bottom.fullState}).` : undefined}
      howToRead={[
        { zone: "Tall bar", color: "#10b981", meaning: "High average value — strong performer" },
        { zone: "Short bar", color: "#f43f5e", meaning: "Low average value — needs attention" },
        { zone: "Bar color", color: "#6366f1", meaning: "Each color = one unique state for easy comparison" },
      ]}
      insights={top ? [
        { label: "Top state", value: top.fullState },
        { label: "Highest avg", value: top.avg.toLocaleString("en-IN"), positive: true },
        { label: "Lowest avg", value: bottom?.avg.toLocaleString("en-IN") ?? "—", positive: false },
        { label: "States shown", value: String(stateBar.length) },
      ] : []}
      expandContent={() => <>{toggles}{chart(440)}</>}
    >
      {toggles}
      {chart(200)}
    </ChartCard>
  );
}

function YearTrendArea() {
  const { yearLine, dept } = useChartData();
  const [show, setShow] = useState<"avg" | "growth" | "both">("both");

  const chart = (h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={yearLine} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={dept.accentColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={dept.accentColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={45}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={35}
          tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<LineTip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
        {(show === "avg" || show === "both") && (
          <Area yAxisId="left" type="monotone" dataKey="avg" name="Avg Value" stroke={dept.accentColor}
            strokeWidth={2.5} fill="url(#avgGrad)" dot={{ fill: dept.accentColor, r: 3 }} activeDot={{ r: 5 }} />
        )}
        {(show === "growth" || show === "both") && (
          <Area yAxisId="right" type="monotone" dataKey="growth" name="Avg Growth %" stroke="#10b981"
            strokeWidth={2} fill="url(#growthGrad)" dot={{ fill: "#10b981", r: 3 }} activeDot={{ r: 5 }} strokeDasharray="5 3" />
        )}
        {h > 200 && <Brush dataKey="year" height={20} stroke="#1e1e2e" fill="#0a0a0f" travellerWidth={6} />}
      </AreaChart>
    </ResponsiveContainer>
  );

  const toggles = (
    <div className="flex gap-1 mb-3">
      {(["both","avg","growth"] as const).map((m) => (
        <button key={m} onClick={() => setShow(m)}
          className={`text-xs px-2 py-0.5 rounded-md transition-all ${show === m ? "bg-accent text-white" : "text-slate-500 hover:text-slate-300 bg-white/5"}`}>
          {m === "both" ? "Both" : m === "avg" ? "Value" : "Growth"}
        </button>
      ))}
    </div>
  );

  const first = yearLine[0];
  const last = yearLine[yearLine.length - 1];
  const trend = last && first ? (last.avg > first.avg ? true : false) : undefined;

  return (
    <ChartCard icon={TrendingUp} title="Year Trend" subtitle="Value & growth over time" color="#10b981"
      description="Shows how the average metric value and growth rate have changed year over year. The solid line tracks the actual value (left axis) while the dashed line shows the average growth percentage (right axis). A rising solid line with a positive dashed line means consistent improvement."
      takeaway={first && last ? `From ${first.year} to ${last.year}, the average value ${last.avg > first.avg ? "increased" : "decreased"} by ${Math.abs(last.avg - first.avg).toFixed(1)} points. The most recent year shows ${last.growth > 0 ? "positive" : "negative"} growth of ${last.growth}%.` : undefined}
      howToRead={[
        { zone: "Solid line (left axis)", color: "#6366f1", meaning: "Average metric value over time" },
        { zone: "Dashed line (right axis)", color: "#10b981", meaning: "Average growth rate (%)" },
        { zone: "Rising both lines", color: "#10b981", meaning: "Healthy — value and momentum both up" },
        { zone: "Value up, growth down", color: "#f59e0b", meaning: "Growth slowing — watch for plateau" },
      ]}
      insights={first && last ? [
        { label: "From", value: String(first.year) },
        { label: "To", value: String(last.year) },
        { label: "Value change", value: `${last.avg > first.avg ? "+" : ""}${(last.avg - first.avg).toFixed(1)}`, positive: trend },
        { label: "Latest growth", value: `${last.growth > 0 ? "+" : ""}${last.growth}%`, positive: last.growth > 0 },
      ] : []}
      expandContent={() => <>{toggles}{chart(440)}</>}
    >
      {toggles}
      {chart(200)}
    </ChartCard>
  );
}

function GrowthPie() {
  const { growthPie, total } = useChartData();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const enriched = growthPie.map((s) => ({ ...s, total }));

  const chart = (outerR: number, h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <PieChart>
        <Pie
          data={enriched} cx="50%" cy="50%"
          innerRadius={outerR * 0.55} outerRadius={outerR}
          paddingAngle={3} dataKey="value"
          onMouseEnter={(_, i) => setActiveIdx(i)}
          onMouseLeave={() => setActiveIdx(null)}
          animationBegin={0} animationDuration={900}
        >
          {enriched.map((s, i) => (
            <Cell key={s.name} fill={s.color}
              opacity={activeIdx === null || activeIdx === i ? 1 : 0.4}
              stroke={activeIdx === i ? s.color : "transparent"}
              strokeWidth={activeIdx === i ? 2 : 0}
            />
          ))}
        </Pie>
        <Tooltip content={<PieTip />} />
        <Legend
          formatter={(v, e: any) => <span style={{ color: e.color, fontSize: 11 }}>{v}</span>}
          iconType="circle" iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const growing = enriched.find((s) => s.name === "Growing");
  const declining = enriched.find((s) => s.name === "Declining");
  const dominant = [...enriched].sort((a, b) => b.value - a.value)[0];

  return (
    <ChartCard icon={PieIcon} title="Growth Split" subtitle="Growing vs stable vs declining" color="#f43f5e"
      description="Breaks down all data records into three categories based on their growth rate. Green = growing (>+2%), red = declining (<-2%), indigo = stable (within ±2%). A healthy dataset should show a majority in the green segment."
      takeaway={dominant ? `The majority of records (${((dominant.value / total) * 100).toFixed(0)}%) are in the "${dominant.name}" category. ${dominant.name === "Declining" ? "This signals a need for policy intervention." : dominant.name === "Growing" ? "This reflects strong positive momentum across the department." : "Performance is largely stable with moderate momentum."}` : undefined}
      howToRead={[
        { zone: "Green segment", color: "#10b981", meaning: "Growth rate > +2% — actively improving" },
        { zone: "Indigo segment", color: "#6366f1", meaning: "Growth rate ±2% — holding steady" },
        { zone: "Red segment", color: "#f43f5e", meaning: "Growth rate < -2% — declining, needs attention" },
        { zone: "Larger slice", color: "#94a3b8", meaning: "Dominant trend across all filtered records" },
      ]}
      insights={[
        { label: "Dominant", value: dominant?.name ?? "—", positive: dominant?.name === "Growing" ? true : dominant?.name === "Declining" ? false : undefined },
        { label: "Growing", value: growing ? `${((growing.value / total) * 100).toFixed(0)}%` : "0%", positive: true },
        { label: "Declining", value: declining ? `${((declining.value / total) * 100).toFixed(0)}%` : "0%", positive: false },
        { label: "Total records", value: total.toLocaleString("en-IN") },
      ]}
      expandContent={() => chart(140, 480)}
    >
      {chart(70, 220)}
    </ChartCard>
  );
}

function MetricRadar() {
  const { radarData, dept } = useChartData();

  const chart = (h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#1e1e2e" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }}
          tickFormatter={(v) => `${v}`} />
        <Radar name="Score" dataKey="value" stroke={dept.accentColor} fill={dept.accentColor}
          fillOpacity={0.25} strokeWidth={2} dot={{ fill: dept.accentColor, r: 3 }} />
        <Tooltip
          formatter={(v: any) => [`${v}/100`, "Relative Score"]}
          contentStyle={TT_STYLE}
          labelStyle={{ color: "#fff", fontWeight: 600 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  const topMetric = radarData[0];
  const weakMetric = [...radarData].sort((a, b) => a.value - b.value)[0];

  return (
    <ChartCard icon={Hexagon} title="Metric Radar" subtitle="Relative performance across metrics" color="#8b5cf6"
      description="A spider/radar chart comparing up to 6 key metrics relative to each other. All values are normalised to a 0–100 scale where 100 = the highest-performing metric in the current filtered dataset. A wider, more filled shape means more balanced performance across all metrics."
      takeaway={topMetric && weakMetric ? `"${topMetric.metric}" is the strongest metric at a relative score of ${topMetric.value}/100. "${weakMetric.metric}" is the weakest at ${weakMetric.value}/100 — this gap highlights where resources could be better directed.` : undefined}
      howToRead={[
        { zone: "Outer edge (100)", color: "#8b5cf6", meaning: "Best possible relative score" },
        { zone: "Filled area", color: "#8b5cf6", meaning: "Larger = more balanced across all metrics" },
        { zone: "Spike outward", color: "#10b981", meaning: "That metric significantly outperforms others" },
        { zone: "Dip inward", color: "#f43f5e", meaning: "That metric is underperforming relative to peers" },
      ]}
      insights={topMetric ? [
        { label: "Strongest metric", value: topMetric.metric, positive: true },
        { label: "Score", value: `${topMetric.value}/100`, positive: true },
        { label: "Weakest metric", value: weakMetric?.metric ?? "—", positive: false },
        { label: "Metrics tracked", value: String(radarData.length) },
      ] : []}
      expandContent={() => chart(480)}
    >
      {chart(220)}
    </ChartCard>
  );
}

function ValueScatter() {
  const { scatter, dept } = useChartData();

  const chart = (h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <ScatterChart margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis dataKey="value" name="Value" type="number" tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false} tickLine={false} label={{ value: "Value", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 10 }}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <YAxis dataKey="growth" name="Growth %" type="number" tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <ZAxis range={[20, 60]} />
        <Tooltip content={<ScatterTip />} cursor={{ strokeDasharray: "3 3", stroke: "#2d2d3d" }} />
        <Scatter data={scatter} fill={dept.accentColor} fillOpacity={0.6} />
        {/* Zero growth reference */}
        <CartesianGrid y={0} stroke="#f43f5e" strokeOpacity={0.2} horizontal={false} />
      </ScatterChart>
    </ResponsiveContainer>
  );

  const positiveGrowth = scatter.filter((d) => d.growth > 0).length;
  const pct = scatter.length ? Math.round((positiveGrowth / scatter.length) * 100) : 0;

  return (
    <ChartCard icon={Activity} title="Value vs Growth" subtitle="Scatter — spot outliers instantly" color="#06b6d4"
      description="Each dot is a data record plotted by its raw value (X axis) vs its growth rate (Y axis). Dots in the top-right are high-value AND fast-growing — the best performers. Dots in the bottom-right are high-value but declining. Clusters reveal patterns; isolated dots are outliers worth investigating."
      takeaway={`${pct}% of sampled records show positive growth. ${pct >= 60 ? "The department is broadly improving." : pct >= 40 ? "Growth is mixed — some areas thriving, others lagging." : "Most records are declining — this warrants deeper investigation."}`}
      howToRead={[
        { zone: "Top-right dots", color: "#10b981", meaning: "High value + high growth — star performers" },
        { zone: "Top-left dots", color: "#6366f1", meaning: "Low value but growing fast — emerging areas" },
        { zone: "Bottom-right dots", color: "#f59e0b", meaning: "High value but declining — at-risk leaders" },
        { zone: "Bottom-left dots", color: "#f43f5e", meaning: "Low value + declining — critical concern" },
      ]}
      insights={[
        { label: "Sample size", value: scatter.length.toLocaleString("en-IN") },
        { label: "Positive growth", value: `${pct}%`, positive: pct >= 50 },
        { label: "Negative growth", value: `${100 - pct}%`, positive: false },
      ]}
      expandContent={() => chart(480)}
    >
      {chart(220)}
    </ChartCard>
  );
}

function StackedMetricBar() {
  const { stackedBar, top3Metrics, dept } = useChartData();
  const colors = [dept.accentColor, "#8b5cf6", "#06b6d4"];

  const chart = (h: number) => (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={stackedBar} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
        <XAxis dataKey="state" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={45}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <Tooltip content={<BarTip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
        <Legend wrapperStyle={{ fontSize: 10, color: "#64748b" }} />
        {top3Metrics.map((m, i) => (
          <Bar key={m} dataKey={m} name={m.slice(0, 20)} stackId="a" fill={colors[i]} radius={i === top3Metrics.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const topStackState = stackedBar[0];

  return (
    <ChartCard icon={BarChart2} title="Stacked by Metric" subtitle="Top 5 states × top 3 metrics" color="#f59e0b"
      description="A stacked bar chart comparing the top 5 states across the 3 most common metrics simultaneously. Each colour segment within a bar represents one metric's average value. Taller total bars = higher overall performance. Compare segment proportions to see which metric dominates in each state."
      takeaway={topStackState ? `${topStackState.state} has the highest combined metric score among the top 5 states. The dominant metric across states is "${top3Metrics[0]}" — it contributes the largest share of each bar.` : undefined}
      howToRead={[
        { zone: "Bar height (total)", color: "#f59e0b", meaning: "Overall performance across all 3 metrics" },
        { zone: "Bottom segment", color: "#f59e0b", meaning: `Metric 1: ${top3Metrics[0] ?? "—"}` },
        { zone: "Middle segment", color: "#8b5cf6", meaning: `Metric 2: ${top3Metrics[1] ?? "—"}` },
        { zone: "Top segment", color: "#06b6d4", meaning: `Metric 3: ${top3Metrics[2] ?? "—"}` },
      ]}
      insights={[
        { label: "States compared", value: String(stackedBar.length) },
        { label: "Metrics stacked", value: String(top3Metrics.length) },
        { label: "Top state", value: topStackState ? String(topStackState.state) : "—" },
        { label: "Lead metric", value: top3Metrics[0]?.split(" ")[0] ?? "—" },
      ]}
      expandContent={() => chart(480)}
    >
      {chart(220)}
    </ChartCard>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function ChartsPanel() {
  const { dept, total, overallAvg, overallGrowth, minVal, maxVal, years, stateCount } = useChartData();

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Summary stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
        {[
          { label: "Total Records", value: total.toLocaleString("en-IN"), color: dept.accentColor },
          { label: "States", value: String(stateCount), color: "#06b6d4" },
          { label: "Years", value: years.length > 1 ? `${years[0]}–${years[years.length-1]}` : String(years[0] ?? "—"), color: "#8b5cf6" },
          { label: "Avg Value", value: overallAvg.toLocaleString("en-IN"), color: "#f59e0b" },
          { label: "Avg Growth", value: `${overallGrowth > 0 ? "+" : ""}${overallGrowth}%`, color: overallGrowth >= 0 ? "#10b981" : "#f43f5e" },
          { label: "Min Value", value: minVal.toLocaleString("en-IN"), color: "#f43f5e" },
          { label: "Max Value", value: maxVal.toLocaleString("en-IN"), color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-lg px-3 py-2 flex flex-col gap-0.5">
            <span className="text-xs text-slate-600">{s.label}</span>
            <span className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Hint strip */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dept.accentColor }} />
        <span className="text-xs text-slate-500">
          Hover charts · click <span className="text-slate-400 font-medium">Details</span> for insights · click <span className="text-slate-400">⤢</span> to expand · all charts react to active filters
        </span>
      </div>

      {/* Row 1 — 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopStatesBar />
        <YearTrendArea />
        <GrowthPie />
      </div>

      {/* Row 2 — 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricRadar />
        <ValueScatter />
        <StackedMetricBar />
      </div>
    </div>
  );
}
