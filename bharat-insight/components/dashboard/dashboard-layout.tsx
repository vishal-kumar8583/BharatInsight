"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { DashboardHeader } from "./dashboard-header";
import { DataGrid } from "./data-grid";
import { AIPanel } from "./ai-panel";
import { FilterBar } from "./filter-bar";
import { StatsBar } from "./stats-bar";
import { ChartsPanel } from "./charts-panel";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, BarChart2, Keyboard } from "lucide-react";

export function DashboardLayout() {
  const { aiPanelOpen } = useDashboardStore();
  const [view, setView] = useState<"table" | "charts">("table");

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
          style={{ marginRight: aiPanelOpen ? 400 : 0 }}
        >
          <FilterBar />
          <StatsBar />

          {/* View toggle */}
          <div className="flex items-center gap-3 px-4 py-2 shrink-0 border-b border-border bg-surface/40">
            <div className="flex items-center bg-background border border-border rounded-lg p-1 gap-1">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === "table"
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => setView("charts")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === "charts"
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Charts
              </button>
            </div>
            <span className="text-xs text-slate-500">
              {view === "table" ? "Virtualized data grid" : "Visual analytics"}
            </span>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {view === "table" ? (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden p-4"
              >
                <DataGrid />
              </motion.div>
            ) : (
              <motion.div
                key="charts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-y-auto pt-2"
              >
                <ChartsPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Side Panel */}
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] z-30"
            >
              <AIPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard hints footer */}
      <div className="shrink-0 border-t border-border bg-background/60 px-4 py-1.5 flex items-center gap-4 overflow-x-auto">
        <Keyboard className="w-3 h-3 text-slate-600 shrink-0" />
        {[
          { keys: ["Ctrl", "K"], label: "Command palette" },
          { keys: ["↑", "↓"], label: "Navigate rows" },
          { keys: ["Ctrl", "F"], label: "Search" },
        ].map((hint) => (
          <div key={hint.label} className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1">
              {hint.keys.map((k) => (
                <kbd key={k} className="text-[10px] text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono leading-none">
                  {k}
                </kbd>
              ))}
            </div>
            <span className="text-[11px] text-slate-600">{hint.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
