"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { AnimatedChart } from "@/components/ui/animated-chart";

const streamingTexts = [
  "Analyzing crop yield data across 28 states...",
  "Detecting health trends in rural districts...",
  "Correlating rainfall with agricultural output...",
  "Generating AI insights for Ministry of Finance...",
  "Processing 2.4M records from data.gov.in...",
];

export function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = streamingTexts[textIndex];
    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 40);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setTextIndex((i) => (i + 1) % streamingTexts.length);
        setCharIndex(0);
        setDisplayText("");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [charIndex, textIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">
                Powered by Gemini AI · Indian Public Data
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white">India's Data,</span>
              <br />
              <span className="text-gradient">Intelligently</span>
              <br />
              <span className="text-white">Decoded.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed"
            >
              A multi-tenant analytics platform that transforms millions of
              government records into real-time AI-powered insights — built for
              every ministry, every department.
            </motion.p>

            {/* Streaming text preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-surface border border-border rounded-xl p-4 mb-8 font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-500">AI Processing</span>
              </div>
              <span className="text-emerald-400">
                {displayText}
                <span className="streaming-cursor" />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="flex items-center gap-2 border border-border hover:border-accent/50 text-slate-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                See Features
              </a>
            </motion.div>
          </div>

          {/* Right: Animated Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block"
          >
            <AnimatedChart />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
