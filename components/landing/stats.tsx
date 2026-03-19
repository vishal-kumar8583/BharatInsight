"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 2400000, label: "Records Processed", suffix: "+", prefix: "" },
  { value: 28, label: "States Covered", suffix: "", prefix: "" },
  { value: 98.7, label: "Data Accuracy", suffix: "%", prefix: "" },
  { value: 12, label: "Ministries Onboarded", suffix: "+", prefix: "" },
];

function Counter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display =
    target >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : target % 1 !== 0
      ? count.toFixed(1)
      : count.toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="py-16 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-gradient mb-1">
                <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

