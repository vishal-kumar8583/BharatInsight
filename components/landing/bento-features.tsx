"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Filter,
  Globe,
  Lock,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Gemini AI Insights",
    description:
      "Real-time streaming AI analysis of your filtered data. Ask questions, get instant answers with token-by-token streaming.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    size: "lg",
  },
  {
    icon: Database,
    title: "100K+ Row Virtualization",
    description:
      "Render millions of records without lag using TanStack Virtual.",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    size: "sm",
  },
  {
    icon: Globe,
    title: "Multi-Tenant Architecture",
    description:
      "Switch between ministries instantly. Each tenant gets its own theme, data, and access controls.",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    size: "sm",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Multi-column filters with fuzzy search across all Indian states and years.",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    size: "sm",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description:
      "Admin vs Viewer roles with granular UI state control.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
    size: "sm",
  },
  {
    icon: Search,
    title: "Command Palette",
    description:
      "Ctrl+K to navigate anywhere, trigger actions, or search across all datasets instantly.",
    color: "from-indigo-500/20 to-blue-500/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    size: "md",
  },
  {
    icon: Zap,
    title: "Real-Time Streaming",
    description:
      "AI responses stream token-by-token with a live thinking indicator.",
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    size: "md",
  },
];

export function BentoFeatures() {
  const heroFeature = features[0];
  const HeroIcon = heroFeature.icon;

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium">Platform Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Everything you need to{" "}
            <span className="text-gradient">understand India</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Built for analysts, policymakers, and researchers who need fast,
            accurate insights from India's public data.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ delay: 0 }}
            className={`lg:col-span-2 bento-card bg-gradient-to-br ${heroFeature.color} border ${heroFeature.border} rounded-2xl p-8 relative overflow-hidden`}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6">
              <HeroIcon className={`w-6 h-6 ${heroFeature.iconColor}`} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{heroFeature.title}</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">{heroFeature.description}</p>

            {/* Mini AI preview */}
            <div className="bg-background/60 border border-border rounded-xl p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-slate-500">Gemini is thinking...</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Based on the filtered data for{" "}
                <span className="text-violet-400">Maharashtra (2023)</span>, crop
                yield shows a{" "}
                <span className="text-emerald-400">+12.4% increase</span> compared
                to the national average, driven by improved irrigation coverage in
                Nashik and Pune districts...
              </p>
              <div className="mt-2 flex gap-1">
                {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-violet-500/30 rounded-sm"
                    style={{ height: `${h * 0.4}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Small cards */}
          {features.slice(1).map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                
                transition={{ delay: (i + 1) * 0.06 }}
                className={`bento-card bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 relative overflow-hidden`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

