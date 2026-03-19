"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const healthData = [42, 58, 51, 67, 73, 69, 82, 78, 91, 85, 94, 88];
const agriData = [65, 59, 72, 68, 81, 76, 70, 85, 79, 88, 83, 92];

export function AnimatedChart() {
  const maxVal = 100;
  const chartH = 180;

  const toY = (v: number) => chartH - (v / maxVal) * chartH;

  const healthPath = healthData
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (healthData.length - 1)) * 100}% ${toY(v)}`)
    .join(" ");

  const agriPath = agriData
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (agriData.length - 1)) * 100}% ${toY(v)}`)
    .join(" ");

  return (
    <div className="relative bg-surface border border-border rounded-2xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-sm">Ministry Performance Index</h3>
          <p className="text-slate-500 text-xs mt-0.5">Real-time data · 2024</p>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-accent rounded" />
          <span className="text-xs text-slate-400">Health</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-emerald-400 rounded" />
          <span className="text-xs text-slate-400">Agriculture</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative" style={{ height: chartH }}>
        <svg
          viewBox={`0 0 400 ${chartH}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[25, 50, 75, 100].map((v) => (
            <line
              key={v}
              x1="0"
              y1={toY(v)}
              x2="400"
              y2={toY(v)}
              stroke="rgba(99,102,241,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Health area fill */}
          <motion.path
            d={`${healthData.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (healthData.length - 1)) * 400} ${toY(v)}`).join(" ")} L 400 ${chartH} L 0 ${chartH} Z`}
            fill="url(#healthGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Agri area fill */}
          <motion.path
            d={`${agriData.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (agriData.length - 1)) * 400} ${toY(v)}`).join(" ")} L 400 ${chartH} L 0 ${chartH} Z`}
            fill="url(#agriGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          {/* Health line */}
          <motion.path
            d={healthData.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (healthData.length - 1)) * 400} ${toY(v)}`).join(" ")}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Agri line */}
          <motion.path
            d={agriData.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (agriData.length - 1)) * 400} ${toY(v)}`).join(" ")}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
          />

          {/* Dots - only show every other one for perf */}
          {healthData.filter((_, i) => i % 2 === 0).map((v, i) => (
            <circle
              key={i}
              cx={(i * 2 / (healthData.length - 1)) * 400}
              cy={toY(v)}
              r="3"
              fill="#6366f1"
            />
          ))}

          <defs>
            <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="agriGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X axis labels */}
      <div className="flex justify-between mt-2">
        {months.map((m) => (
          <span key={m} className="text-xs text-slate-600">{m}</span>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
        {[
          { label: "Datasets", value: "2.4M", color: "text-accent" },
          { label: "States", value: "28", color: "text-emerald-400" },
          { label: "Accuracy", value: "98.7%", color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
