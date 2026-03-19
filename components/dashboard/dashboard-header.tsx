"use client";

import { useDashboardStore } from "@/store/dashboard-store";
import { getDepartment } from "@/lib/departments";
import { OrgSwitcher } from "./org-switcher";
import { RoleSwitcher } from "./role-switcher";
import { BarChart3, Brain, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PrintView } from "./print-view";

export function DashboardHeader() {
  const { activeDepartment, aiPanelOpen, setAiPanelOpen, setCmdOpen } =
    useDashboardStore();
  const dept = getDepartment(activeDepartment);

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0 z-40 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-1 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <BarChart3 className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm text-white hidden sm:block">
          Bharat<span className="text-gradient">Insight</span>
        </span>
      </Link>

      <div className="w-px h-6 bg-border shrink-0" />

      {/* Org Switcher */}
      <OrgSwitcher />

      <div className="flex-1" />

      {/* Search shortcut */}
      <button
        onClick={() => setCmdOpen(true)}
        className="hidden sm:flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:border-accent/50 hover:text-slate-300 transition-all"
      >
        <Search className="w-3 h-3" />
        <span>Search...</span>
        <kbd className="ml-2 text-slate-600 border border-border rounded px-1 py-0.5">Ctrl+K</kbd>
      </button>

      {/* Role switcher */}
      <RoleSwitcher />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Print / Share */}
      <PrintView />

      {/* AI Panel toggle */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setAiPanelOpen(!aiPanelOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
          aiPanelOpen
            ? "bg-accent text-white shadow-lg shadow-accent/20"
            : "bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20"
        }`}
      >
        <Brain className="w-3.5 h-3.5" />
        <span className="hidden sm:block">AI Insights</span>
      </motion.button>
    </header>
  );
}
