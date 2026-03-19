"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "BharatInsight transformed how our ministry analyzes crop data. The AI insights are remarkably accurate and the streaming responses feel magical.",
    name: "Dr. Priya Sharma",
    role: "Data Analyst, Ministry of Agriculture",
    avatar: "PS",
    color: "bg-emerald-500",
  },
  {
    quote: "The multi-tenant switching is seamless. We can compare health metrics across states in seconds, something that used to take days.",
    name: "Rajesh Kumar",
    role: "Senior Officer, Ministry of Health",
    avatar: "RK",
    color: "bg-blue-500",
  },
  {
    quote: "The command palette and keyboard navigation make this the most productive analytics tool I have used. The dark UI is stunning.",
    name: "Ananya Patel",
    role: "Research Lead, NITI Aayog",
    avatar: "AP",
    color: "bg-violet-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Trusted by <span className="text-gradient">analysts</span> across India
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface border border-border rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}