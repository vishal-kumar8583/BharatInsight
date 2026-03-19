import Link from "next/link";
import { BarChart3, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">
              Bharat<span className="text-gradient">Insight</span>
            </span>
          </div>

          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} BharatInsight · Crafted with care by{" "}
            <span className="text-white font-medium">Vishal</span>
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
