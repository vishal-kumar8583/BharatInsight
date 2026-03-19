"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section id="launch" className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative bg-gradient-to-br from-accent/20 via-purple-500/10 to-cyan-500/10 border border-accent/20 rounded-3xl p-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">Free to explore</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to decode{" "}
              <span className="text-gradient">India's data?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Launch the dashboard and start exploring 2.4M+ records with
              AI-powered insights in seconds.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-accent/30"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
