"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/dashboard-store";
import { DEPARTMENTS } from "@/lib/departments";
import { useRouter } from "next/navigation";
import {
  Search,
  BarChart3,
  Home,
  Brain,
  Shield,
  Eye,
  X,
  ArrowRight,
} from "lucide-react";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: string;
};

export function CommandPalette() {
  const { cmdOpen, setCmdOpen, setActiveDepartment, setAiPanelOpen, setRole } =
    useDashboardStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCmdOpen]);

  useEffect(() => {
    if (cmdOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [cmdOpen]);

  const commands: CommandItem[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: Home,
      action: () => { router.push("/"); setCmdOpen(false); },
      category: "Navigation",
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      icon: BarChart3,
      action: () => { router.push("/dashboard"); setCmdOpen(false); },
      category: "Navigation",
    },
    {
      id: "ai",
      label: "Open AI Insights Panel",
      icon: Brain,
      action: () => { setAiPanelOpen(true); setCmdOpen(false); },
      category: "Actions",
    },
    {
      id: "admin",
      label: "Switch to Admin Role",
      icon: Shield,
      action: () => { setRole("admin"); setCmdOpen(false); },
      category: "Access",
    },
    {
      id: "viewer",
      label: "Switch to Viewer Role",
      icon: Eye,
      action: () => { setRole("viewer"); setCmdOpen(false); },
      category: "Access",
    },
    ...DEPARTMENTS.map((d) => ({
      id: `dept-${d.id}`,
      label: `Switch to ${d.shortName}`,
      description: d.description,
      icon: d.icon,
      action: () => {
        setActiveDepartment(d.id);
        router.push("/dashboard");
        setCmdOpen(false);
      },
      category: "Departments",
    })),
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      flatFiltered[selected]?.action();
    }
  };

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 cmd-backdrop"
            onClick={() => setCmdOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, departments..."
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none"
              />
              <button onClick={() => setCmdOpen(false)} className="text-slate-600 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="text-xs text-slate-600 px-3 py-1.5 font-medium uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map((item) => {
                    const idx = globalIdx++;
                    const isSelected = selected === idx;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelected(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isSelected ? "bg-accent/20" : "hover:bg-white/5"
                        }`}
                      >
                        <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent" : "text-slate-500"}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-600 truncate">{item.description}</div>
                          )}
                        </div>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No commands found for "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-slate-600">
              <span><kbd className="border border-border rounded px-1">↑↓</kbd> navigate</span>
              <span><kbd className="border border-border rounded px-1">↵</kbd> select</span>
              <span><kbd className="border border-border rounded px-1">Esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
