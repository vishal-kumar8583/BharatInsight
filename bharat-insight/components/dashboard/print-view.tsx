"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X, Download, FileText } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";
import { getDataset } from "@/lib/data";
import { getDepartment } from "@/lib/departments";
import { formatNumber, formatGrowth } from "@/lib/utils";

export function PrintView() {
  const [open, setOpen] = useState(false);
  const { activeDepartment, filters } = useDashboardStore();
  const dept = getDepartment(activeDepartment);

  const raw = getDataset(activeDepartment);
  const data = raw
    .filter((r) => (!filters.state || r.state === filters.state))
    .filter((r) => (!filters.year || r.year === parseInt(filters.year)))
    .sort((a, b) => a.state.localeCompare(b.state) || a.year - b.year)
    .slice(0, 50);

  const total = data.length;
  const avgValue = total ? data.reduce((s, r) => s + r.value, 0) / total : 0;
  const avgGrowth = total ? data.reduce((s, r) => s + r.growth, 0) / total : 0;
  const uniqueStates = new Set(data.map((r) => r.state)).size;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const downloadCSV = () => {
    const headers = ["State", "District", "Year", "Metric", "Value", "Unit", "Growth", "Rank"];
    const rows = data.map((r) =>
      [r.state, r.district, r.year, `"${r.metric}"`, r.value, r.unit, r.growth, r.rank].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bharat-insight-${dept.shortName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePDF = () => {
    const rows = data.map((r, i) => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"};font-weight:600">${r.state}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">${r.district}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">${r.year}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">${r.metric}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"};color:#6366f1;font-weight:700;font-family:monospace">${formatNumber(r.value)}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"};color:${r.growth >= 0 ? "#059669" : "#dc2626"};font-weight:700;font-family:monospace">${formatGrowth(r.growth)}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;background:${i % 2 === 0 ? "#fff" : "#f8fafc"};color:#94a3b8">#${r.rank}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head>
      <title>BharatInsight – ${dept.shortName} Report</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Inter,system-ui,sans-serif;color:#0f172a;background:#fff;padding:32px;font-size:12px}
        @media print{body{padding:16px}}
      </style>
    </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:2px solid #e2e8f0;margin-bottom:20px">
        <div>
          <div style="font-size:22px;font-weight:900;color:#0f172a">BharatInsight</div>
          <div style="font-size:12px;color:#64748b;margin-top:4px">${dept.name} · Data Report</div>
        </div>
        <div style="text-align:right;font-size:11px;color:#94a3b8">
          <div>Generated: ${dateStr}</div>
          ${filters.state ? `<div>State: ${filters.state}</div>` : ""}
          ${filters.year ? `<div>Year: ${filters.year}</div>` : ""}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
        ${[
          { label: "Records", value: total.toLocaleString("en-IN") },
          { label: "Avg Value", value: formatNumber(avgValue) },
          { label: "Avg Growth", value: formatGrowth(avgGrowth) },
          { label: "States", value: String(uniqueStates) },
        ].map(s => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:900;color:#6366f1">${s.value}</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:3px">${s.label}</div>
          </div>`).join("")}
      </div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;margin-bottom:10px">Top ${data.length} Records</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f1f5f9">
            ${["State","District","Year","Metric","Value","Growth","Rank"].map(h =>
              `<th style="padding:8px 10px;text-align:left;font-weight:600;color:#475569;border:1px solid #e2e8f0">${h}</th>`
            ).join("")}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:20px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8">
        <span>© ${new Date().getFullYear()} BharatInsight · Crafted by Vishal</span>
        <span>Data sourced from data.gov.in</span>
      </div>
    </body></html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-all bg-surface"
      >
        <Printer className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Print / Share</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-8 px-6 pb-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl"
              style={{ height: "calc(100vh - 4rem)" }}
            >
              {/* Fixed header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 rounded-t-2xl shrink-0">
                <div>
                  <p className="font-bold text-slate-800 text-base">Data Report Preview</p>
                  <p className="text-xs text-slate-400 mt-0.5">{dept.shortName} · {data.length} records</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={downloadCSV} className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 transition-all font-medium">
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button onClick={savePDF} className="flex items-center gap-1.5 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-2 transition-all font-medium">
                    <FileText className="w-3.5 h-3.5" /> Save PDF
                  </button>
                  <button onClick={() => setOpen(false)} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-2 transition-all font-medium">
                    <X className="w-4 h-4" /> Close
                  </button>
                </div>
              </div>

              {/* Scrollable preview */}
              <div className="overflow-y-auto flex-1 px-8 py-6">
                {/* Report header */}
                <div className="flex items-start justify-between pb-5 border-b border-slate-200 mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">BharatInsight</h1>
                    <p className="text-slate-500 text-sm mt-1">{dept.name} · Data Report</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 space-y-0.5">
                    <p>Generated: {dateStr}</p>
                    {filters.state && <p>State: {filters.state}</p>}
                    {filters.year && <p>Year: {filters.year}</p>}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Records", value: total.toLocaleString("en-IN") },
                    { label: "Avg Value", value: formatNumber(avgValue) },
                    { label: "Avg Growth", value: formatGrowth(avgGrowth) },
                    { label: "States", value: String(uniqueStates) },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-indigo-600">{s.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top {data.length} Records</p>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      {["State", "District", "Year", "Metric", "Value", "Growth", "Rank"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-slate-600 font-semibold border border-slate-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-3 py-2 border border-slate-200 font-semibold text-slate-800">{row.state}</td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-600">{row.district}</td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-600">{row.year}</td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-600">{row.metric}</td>
                        <td className="px-3 py-2 border border-slate-200 font-mono font-bold text-indigo-600">{formatNumber(row.value)}</td>
                        <td className={`px-3 py-2 border border-slate-200 font-mono font-bold ${row.growth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatGrowth(row.growth)}</td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-400">#{row.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400">
                  <span>© {new Date().getFullYear()} BharatInsight · Crafted by Vishal</span>
                  <span>Data sourced from data.gov.in</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
