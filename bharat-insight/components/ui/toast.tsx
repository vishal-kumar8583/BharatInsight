"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { create } from "zustand";

type ToastType = "success" | "info" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  info:    <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  error:   <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
};

const borders = {
  success: "border-emerald-500/30",
  info:    "border-blue-500/30",
  error:   "border-rose-500/30",
};

export function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className={`pointer-events-auto flex items-center gap-3 bg-surface border ${borders[t.type]} rounded-xl px-4 py-3 shadow-2xl shadow-black/40 min-w-[240px] max-w-[340px]`}
          >
            {icons[t.type]}
            <span className="text-sm text-slate-200 flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-slate-600 hover:text-white transition-colors ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
