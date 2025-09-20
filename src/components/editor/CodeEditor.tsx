"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Lightbulb, RefreshCw, TestTube, Check, X, MoreHorizontal } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
        <div className="w-4 h-4 border-2 border-[hsl(var(--accent-primary))] border-t-transparent rounded-full animate-spin"></div>
        <span>Loading AI-Enhanced Editor...</span>
      </div>
    </div>
  )
});

interface TabXSuggestion {
  id: string;
  level: "line" | "block" | "component" | "feature";
  confidence: number;
  code: string;
  language: string;
  diff?: string;
  alternatives?: string[];
}

const mockSuggestion: TabXSuggestion = {
  id: "1",
  level: "component",
  confidence: 0.92,
  code: `const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      {...props}
    >
      {children}
    </button>
  );
};`,
  language: "typescript",
  alternatives: ["Styled components variant", "CSS modules variant"]
};

export function CodeEditor() {
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [code, setCode] = useState(`import React from 'react';

// ProjectCode - AI-Powered IDE
export default function App() {
  return (
    <div className="app">
      <h1>Welcome to ProjectCode</h1>
      <p>AI-powered development starts here...</p>
      
      {/* Try typing below - TabX will suggest completions */}
      const handleClick = () => {
        
      };
    </div>
  );
}`);

  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount = (editor: unknown, monaco: unknown) => {
    editorRef.current = editor;
    
    // Configure Monaco for our theme
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monacoEditor = monaco as any; // Monaco types are complex, using any for theme definition
    monacoEditor.editor.defineTheme('projectcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '808080' },
        { token: 'keyword', foreground: '0066ff' },
        { token: 'string', foreground: '00d16a' },
        { token: 'number', foreground: 'ff9500' },
        { token: 'type', foreground: '8e44ad' },
        { token: 'function', foreground: '0066ff' },
      ],
      colors: {
        'editor.background': '#0a0a0b',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a1b',
        'editor.selectionBackground': '#0066ff40',
        'editorCursor.foreground': '#0066ff',
        'editorLineNumber.foreground': '#808080',
        'editorLineNumber.activeForeground': '#ffffff',
        'editorIndentGuide.background': '#2a2a2b',
        'editorIndentGuide.activeBackground': '#3a3a3b'
      }
    });
    
    monacoEditor.editor.setTheme('projectcode-dark');
  };

  const acceptSuggestion = () => {
    setShowSuggestion(false);
    // In real implementation, this would insert the code
  };

  const rejectSuggestion = () => {
    setShowSuggestion(false);
  };

  return (
    <main className="editor relative overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          minimap: { enabled: false },
          padding: { top: 20, bottom: 20 },
          suggest: {
            showKeywords: false // We'll handle this with AI
          },
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true
          }
        }}
      />
      
      {/* TabX Suggestion Interface */}
      {showSuggestion && (
        <div className="absolute top-4 right-4 w-80 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg suggestion-enter">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[hsl(var(--accent-primary))] uppercase tracking-wide">
                  {mockSuggestion.level}
                </span>
                <span className="text-xs text-[hsl(var(--text-secondary))]">
                  {Math.round(mockSuggestion.confidence * 100)}% confident
                </span>
              </div>
              <button onClick={rejectSuggestion} className="p-1 hover:bg-[hsl(var(--bg-accent))] rounded">
                <X className="w-3 h-3 text-[hsl(var(--text-tertiary))]" />
              </button>
            </div>
            
            <div className="bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-subtle))] rounded p-3 mb-3 text-xs font-mono overflow-x-auto">
              <pre className="text-[hsl(var(--text-primary))] whitespace-pre-wrap">
                {mockSuggestion.code}
              </pre>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={acceptSuggestion}
                className="flex-1 flex items-center justify-center gap-1 bg-[hsl(var(--accent-primary))] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[hsl(var(--accent-primary)_/_0.9)] transition-colors"
              >
                <Check className="w-3 h-3" />
                Accept
              </button>
              {mockSuggestion.alternatives && (
                <button className="px-3 py-1.5 bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-secondary))] rounded text-xs font-medium hover:bg-[hsl(var(--bg-accent))] transition-colors">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Floating AI Actions */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Explain this code"
        >
          <Lightbulb className="w-4 h-4 text-[hsl(var(--accent-warning))] group-hover:text-[hsl(var(--accent-warning)_/_0.8)]" />
        </button>
        <button 
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Suggest refactoring"
        >
          <RefreshCw className="w-4 h-4 text-[hsl(var(--accent-primary))] group-hover:text-[hsl(var(--accent-primary)_/_0.8)]" />
        </button>
        <button 
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Generate tests"
        >
          <TestTube className="w-4 h-4 text-[hsl(var(--accent-success))] group-hover:text-[hsl(var(--accent-success)_/_0.8)]" />
        </button>
      </div>
    </main>
  );
}