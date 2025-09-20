"use client";

import { Brain, Search, Terminal, Rocket, ChevronRight, Menu } from "lucide-react";
import { useState } from "react";

export function HeaderBar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="header flex items-center justify-between px-4 border-b border-solid">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--bg-accent))] transition-colors"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <Menu className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
      </button>

      {/* AI Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent-success))] animate-pulse"></div>
          <span className="text-sm text-[hsl(var(--text-secondary))] hidden sm:block">
            GPT-4 Ready • 23% GPU
          </span>
          <span className="text-xs text-[hsl(var(--text-secondary))] sm:hidden">
            AI Ready
          </span>
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-[hsl(var(--text-primary))] font-medium">ProjectCode</span>
        <ChevronRight className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
        <span className="text-[hsl(var(--text-secondary))] hidden sm:block">app.tsx</span>
      </nav>
      
      {/* Quick Actions */}
      <div className="flex items-center gap-1">
        <button 
          className="p-2 rounded-lg hover:bg-[hsl(var(--bg-accent))] transition-colors"
          title="Reasoning Mode"
        >
          <Brain className="w-4 h-4 text-[hsl(var(--accent-purple))]" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-[hsl(var(--bg-accent))] transition-colors hidden sm:block"
          title="Search Codebase"
        >
          <Search className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-[hsl(var(--bg-accent))] transition-colors hidden sm:block"
          title="AI Terminal"
        >
          <Terminal className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-[hsl(var(--bg-accent))] transition-colors"
          title="Deploy"
        >
          <Rocket className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
        </button>
      </div>
    </header>
  );
}