import { create } from "zustand";

export type UserRole = "admin" | "viewer";

export type FilterState = {
  state: string;
  year: string;
  metric: string;
  search: string;
};

type DashboardStore = {
  activeDepartment: string;
  setActiveDepartment: (id: string) => void;

  role: UserRole;
  setRole: (role: UserRole) => void;

  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;

  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;

  cmdOpen: boolean;
  setCmdOpen: (open: boolean) => void;
};

const defaultFilters: FilterState = { state: "", year: "", metric: "", search: "" };

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeDepartment: "health",
  setActiveDepartment: (id) => set({ activeDepartment: id, filters: defaultFilters }),

  role: "admin",
  setRole: (role) => set({ role }),

  filters: defaultFilters,
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),

  aiPanelOpen: false,
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),

  cmdOpen: false,
  setCmdOpen: (open) => set({ cmdOpen: open }),
}));
