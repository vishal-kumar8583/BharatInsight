"use client";

import { useEffect, lazy, Suspense } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

const Stats = lazy(() => import("@/components/landing/stats").then(m => ({ default: m.Stats })));
const BentoFeatures = lazy(() => import("@/components/landing/bento-features").then(m => ({ default: m.BentoFeatures })));
const HowItWorks = lazy(() => import("@/components/landing/how-it-works").then(m => ({ default: m.HowItWorks })));
const Testimonials = lazy(() => import("@/components/landing/testimonials").then(m => ({ default: m.Testimonials })));
const CTA = lazy(() => import("@/components/landing/cta").then(m => ({ default: m.CTA })));
const Footer = lazy(() => import("@/components/landing/footer").then(m => ({ default: m.Footer })));

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <Stats />
        <BentoFeatures />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </Suspense>
    </main>
  );
}
