"use client";

import { useState } from "react";
import { Palette, Code, Layers, Settings } from "lucide-react";

export function Inspector() {
  const [activeTab, setActiveTab] = useState<"design" | "code" | "layers" | "properties">("design");

  const tabs = [
    { id: "design" as const, label: "Design", icon: Palette },
    { id: "code" as const, label: "Code", icon: Code },
    { id: "layers" as const, label: "Layers", icon: Layers },
    { id: "properties" as const, label: "Props", icon: Settings },
  ];

  return (
    <div className="inspector flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-[hsl(var(--border-subtle))]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "text-[hsl(var(--accent-primary))] border-b-2 border-[hsl(var(--accent-primary))]"
                : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "design" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-3">AI Designer</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-[hsl(var(--border-subtle))]">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">Color Palette</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-primary))]" title="Primary"></div>
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-success))]" title="Success"></div>
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-warning))]" title="Warning"></div>
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-error))]" title="Error"></div>
                  </div>
                </div>

                <div className="p-3 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-[hsl(var(--border-subtle))]">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-[hsl(var(--accent-purple))]" />
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">Typography</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--text-secondary))]">Font Family</span>
                      <span className="text-[hsl(var(--text-primary))]">JetBrains Mono</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--text-secondary))]">Font Size</span>
                      <span className="text-[hsl(var(--text-primary))]">14px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--text-secondary))]">Line Height</span>
                      <span className="text-[hsl(var(--text-primary))]">1.5</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 px-3 bg-[hsl(var(--accent-primary))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(var(--accent-primary)_/_0.9)] transition-colors">
                  ✨ Generate from Description
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-3">Generated Components</h4>
              <div className="space-y-2">
                <div className="p-3 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-[hsl(var(--border-subtle))]">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-[hsl(var(--accent-success))]" />
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">Button.tsx</span>
                  </div>
                  <pre className="text-xs text-[hsl(var(--text-secondary))] font-mono">
{`interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: ReactNode;
}`}
                  </pre>
                </div>
                <div className="p-3 bg-[hsl(var(--bg-tertiary))] rounded-lg border border-[hsl(var(--border-subtle))]">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-[hsl(var(--accent-success))]" />
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">Card.tsx</span>
                  </div>
                  <pre className="text-xs text-[hsl(var(--text-secondary))] font-mono">
{`interface CardProps {
  title: string;
  content: string;
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-3">Component Tree</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 p-2 hover:bg-[hsl(var(--bg-accent))] rounded">
                  <Layers className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
                  <span className="text-[hsl(var(--text-primary))]">App</span>
                </div>
                <div className="flex items-center gap-2 p-2 pl-6 hover:bg-[hsl(var(--bg-accent))] rounded">
                  <div className="w-3.5 h-3.5 rounded bg-[hsl(var(--accent-success))]"></div>
                  <span className="text-[hsl(var(--text-primary))]">Header</span>
                </div>
                <div className="flex items-center gap-2 p-2 pl-6 hover:bg-[hsl(var(--bg-accent))] rounded">
                  <div className="w-3.5 h-3.5 rounded bg-[hsl(var(--accent-warning))]"></div>
                  <span className="text-[hsl(var(--text-primary))]">Main</span>
                </div>
                <div className="flex items-center gap-2 p-2 pl-10 hover:bg-[hsl(var(--bg-accent))] rounded">
                  <div className="w-3.5 h-3.5 rounded bg-[hsl(var(--accent-purple))]"></div>
                  <span className="text-[hsl(var(--text-primary))]">Button</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-3">Component Properties</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--text-secondary))] mb-1">
                    Variant
                  </label>
                  <select className="w-full bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-subtle))] rounded px-2 py-1 text-sm text-[hsl(var(--text-primary))]">
                    <option>primary</option>
                    <option>secondary</option>
                    <option>outline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--text-secondary))] mb-1">
                    Size
                  </label>
                  <select className="w-full bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-subtle))] rounded px-2 py-1 text-sm text-[hsl(var(--text-primary))]">
                    <option>sm</option>
                    <option>md</option>
                    <option>lg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--text-secondary))] mb-1">
                    Disabled
                  </label>
                  <input type="checkbox" className="w-4 h-4 rounded border-[hsl(var(--border-subtle))]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}