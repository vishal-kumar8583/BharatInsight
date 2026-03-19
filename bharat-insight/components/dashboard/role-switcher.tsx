"use client";

import { useDashboardStore, UserRole } from "@/store/dashboard-store";
import { Shield, Eye } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useDashboardStore();

  return (
    <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
      {(["admin", "viewer"] as UserRole[]).map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            role === r
              ? r === "admin"
                ? "bg-accent text-white"
                : "bg-slate-700 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {r === "admin" ? (
            <Shield className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
          <span className="hidden sm:block capitalize">{r}</span>
        </button>
      ))}
    </div>
  );
}
