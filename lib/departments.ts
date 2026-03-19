import type { ComponentType } from "react";
import { Heart, Wheat, IndianRupee, GraduationCap, Zap, Droplets } from "lucide-react";

export type Department = {
  id: string;
  name: string;
  shortName: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
};

export const DEPARTMENTS: Department[] = [
  {
    id: "health",
    name: "Health & Family Welfare",
    shortName: "Health",
    icon: Heart,
    color: "text-rose-400",
    accentColor: "#f43f5e",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    description: "Public health metrics, hospital data, disease surveillance",
  },
  {
    id: "agriculture",
    name: "Agriculture & Farmers Welfare",
    shortName: "Agriculture",
    icon: Wheat,
    color: "text-emerald-400",
    accentColor: "#10b981",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "Crop yields, irrigation, farmer income, land use",
  },
  {
    id: "finance",
    name: "Finance & Economic Indicators",
    shortName: "Finance",
    icon: IndianRupee,
    color: "text-amber-400",
    accentColor: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    description: "GDP, tax revenue, FDI, economic indicators",
  },
  {
    id: "education",
    name: "Education & Literacy",
    shortName: "Education",
    icon: GraduationCap,
    color: "text-blue-400",
    accentColor: "#3b82f6",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Literacy rates, enrollment, dropout rates, teacher ratios",
  },
  {
    id: "energy",
    name: "Renewable Energy & Power",
    shortName: "Energy",
    icon: Zap,
    color: "text-yellow-400",
    accentColor: "#eab308",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    description: "Solar capacity, wind energy, electrification data",
  },
  {
    id: "water",
    name: "Water Resources & Sanitation",
    shortName: "Water",
    icon: Droplets,
    color: "text-cyan-400",
    accentColor: "#06b6d4",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    description: "Water coverage, sanitation, groundwater levels",
  },
];

export function getDepartment(id: string): Department {
  return DEPARTMENTS.find((d) => d.id === id) || DEPARTMENTS[0];
}
