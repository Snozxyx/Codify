"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Lightbulb, RefreshCw, TestTube, Check, X, MoreHorizontal } from "lucide-react";
import { AIService, type CompletionResult, type AIContext } from "@/lib/tauri-api";

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

export function CodeEditor() {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<CompletionResult | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
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

  const requestAICompletion = async () => {
    setIsLoadingSuggestion(true);
    try {
      const context: AIContext = {
        project_path: "/current/project",
        current_file: "app.tsx",
        selected_text: "",
        cursor_position: { line: 10, column: 20 }
      };
      
      const result = await AIService.completeCode(context, 'Component');
      setCurrentSuggestion(result);
      setShowSuggestion(true);
    } catch (error) {
      console.error('AI completion failed:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const acceptSuggestion = () => {
    if (currentSuggestion) {
      // In real implementation, this would insert the code at cursor position
      setCode(prevCode => prevCode + '\n\n// AI Generated:\n' + currentSuggestion.code);
    }
    setShowSuggestion(false);
    setCurrentSuggestion(null);
  };

  const rejectSuggestion = () => {
    setShowSuggestion(false);
    setCurrentSuggestion(null);
  };

  const handleAIExplain = async () => {
    try {
      const explanation = await AIService.explainCode(code);
      alert(explanation); // In real implementation, show in a proper modal
    } catch (error) {
      console.error('AI explain failed:', error);
    }
  };

  const handleAIRefactor = async () => {
    try {
      const suggestions = await AIService.suggestRefactor(code);
      alert('Refactoring suggestions:\n' + suggestions.join('\n')); // In real implementation, show in a proper modal
    } catch (error) {
      console.error('AI refactor failed:', error);
    }
  };

  const handleGenerateTests = async () => {
    try {
      const tests = await AIService.generateTests(code);
      alert('Generated tests:\n' + tests); // In real implementation, show in a proper modal
    } catch (error) {
      console.error('AI test generation failed:', error);
    }
  };

  // Auto-request completion on certain triggers
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.includes('const ') && !showSuggestion && !isLoadingSuggestion) {
        requestAICompletion();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, showSuggestion, isLoadingSuggestion]);

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
      {showSuggestion && currentSuggestion && (
        <div className="absolute top-4 right-4 w-80 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg suggestion-enter">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[hsl(var(--accent-primary))] uppercase tracking-wide">
                  {currentSuggestion.level}
                </span>
                <span className="text-xs text-[hsl(var(--text-secondary))]">
                  {Math.round(currentSuggestion.confidence * 100)}% confident
                </span>
              </div>
              <button onClick={rejectSuggestion} className="p-1 hover:bg-[hsl(var(--bg-accent))] rounded">
                <X className="w-3 h-3 text-[hsl(var(--text-tertiary))]" />
              </button>
            </div>
            
            <div className="bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-subtle))] rounded p-3 mb-3 text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
              <pre className="text-[hsl(var(--text-primary))] whitespace-pre-wrap">
                {currentSuggestion.code}
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
              {currentSuggestion.alternatives && currentSuggestion.alternatives.length > 0 && (
                <button className="px-3 py-1.5 bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-secondary))] rounded text-xs font-medium hover:bg-[hsl(var(--bg-accent))] transition-colors">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator for AI */}
      {isLoadingSuggestion && (
        <div className="absolute top-4 right-4 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
            <div className="w-3 h-3 border-2 border-[hsl(var(--accent-primary))] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">AI thinking...</span>
          </div>
        </div>
      )}
      
      {/* Floating AI Actions */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          onClick={handleAIExplain}
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Explain this code"
        >
          <Lightbulb className="w-4 h-4 text-[hsl(var(--accent-warning))] group-hover:text-[hsl(var(--accent-warning)_/_0.8)]" />
        </button>
        <button 
          onClick={handleAIRefactor}
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Suggest refactoring"
        >
          <RefreshCw className="w-4 h-4 text-[hsl(var(--accent-primary))] group-hover:text-[hsl(var(--accent-primary)_/_0.8)]" />
        </button>
        <button 
          onClick={handleGenerateTests}
          className="p-3 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-strong))] rounded-lg shadow-lg hover:bg-[hsl(var(--bg-tertiary))] transition-colors group"
          title="Generate tests"
        >
          <TestTube className="w-4 h-4 text-[hsl(var(--accent-success))] group-hover:text-[hsl(var(--accent-success)_/_0.8)]" />
        </button>
      </div>
    </main>
  );
}