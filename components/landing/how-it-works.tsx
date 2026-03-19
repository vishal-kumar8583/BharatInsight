"use client";

import { motion } from "framer-motion";
import { Database, Filter, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Database,
    step: "01",
    title: "Connect Public Data",
    description: "We ingest datasets from data.gov.in across agriculture, health, education, and finance, then normalize them for analysis.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Filter,
    step: "02",
    title: "Filter & Explore",
    description: "Use multi-column filters, fuzzy search, and keyboard navigation to drill into exactly the data you need.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Brain,
    step: "03",
    title: "Ask Gemini AI",
    description: "The AI reads your active filters and data context, then streams a detailed analysis in real-time.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Act on Insights",
    description: "Export findings, share with your team, or switch departments to compare across ministries.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From raw government data to actionable AI insights in four steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative bg-surface border ${step.border} rounded-2xl p-6`}
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-border z-10" />
                )}
                <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                  <StepIcon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className={`text-xs font-bold ${step.color} mb-2 font-mono`}>STEP {step.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}