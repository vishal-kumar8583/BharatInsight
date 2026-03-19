"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/dashboard-store";
import { DEPARTMENTS, getDepartment } from "@/lib/departments";
import { ChevronDown, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function OrgSwitcher() {
  const { activeDepartment, setActiveDepartment } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const { add: toast } = useToast();
  const dept = getDepartment(activeDepartment);
  const DeptIcon = dept.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-surface border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-all"
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center ${dept.bgColor}`}>
          <DeptIcon className={`w-3 h-3 ${dept.color}`} />
        </div>
        <span className="text-sm text-white font-medium hidden sm:block max-w-[140px] truncate">
          {dept.shortName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-xs text-slate-500 px-3 py-2 font-medium uppercase tracking-wider">
                  Switch Department
                </div>
                {DEPARTMENTS.map((d) => {
                  const DIcon = d.icon;
                  return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveDepartment(d.id);
                      setOpen(false);
                      toast(`Switched to ${d.shortName}`, "info");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      d.id === activeDepartment
                        ? "bg-accent/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.bgColor}`}>
                      <DIcon className={`w-4 h-4 ${d.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">
                        {d.shortName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {d.description}
                      </div>
                    </div>
                    {d.id === activeDepartment && (
                      <Check className="w-4 h-4 text-accent shrink-0" />
                    )}
                  </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
