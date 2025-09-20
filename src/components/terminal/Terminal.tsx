"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Zap, AlertTriangle } from "lucide-react";

interface TerminalLine {
  type: "command" | "output" | "error" | "suggestion";
  content: string;
  timestamp?: Date;
}

const initialHistory: TerminalLine[] = [
  { type: "output", content: "ProjectCode AI Terminal v1.0.0", timestamp: new Date() },
  { type: "output", content: "AI assistance enabled. Type commands or ask questions.", timestamp: new Date() },
  { type: "command", content: "npm run dev", timestamp: new Date() },
  { type: "output", content: "✓ Ready in 2.3s", timestamp: new Date() },
  { type: "suggestion", content: "💡 AI suggests: Try 'npm run build' to check for production errors", timestamp: new Date() },
];

export function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>(initialHistory);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    const newHistory = [...history, { type: "command" as const, content: command, timestamp: new Date() }];
    setHistory(newHistory);
    setCurrentCommand("");
    setIsThinking(true);

    // Simulate AI processing
    setTimeout(() => {
      const responses = getAIResponse(command);
      setHistory(prev => [...prev, ...responses]);
      setIsThinking(false);
    }, 1000 + Math.random() * 1000);
  };

  const getAIResponse = (command: string): TerminalLine[] => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd.includes("install") || cmd.includes("npm i")) {
      return [
        { type: "output", content: "📦 Installing dependencies...", timestamp: new Date() },
        { type: "output", content: "✓ Dependencies installed successfully", timestamp: new Date() },
        { type: "suggestion", content: "💡 AI suggests: Run 'npm audit' to check for security vulnerabilities", timestamp: new Date() },
      ];
    }
    
    if (cmd.includes("build")) {
      return [
        { type: "output", content: "🔨 Building application...", timestamp: new Date() },
        { type: "output", content: "✓ Build completed in 12.3s", timestamp: new Date() },
        { type: "suggestion", content: "💡 AI suggests: Your bundle size increased by 15%. Consider code splitting.", timestamp: new Date() },
      ];
    }
    
    if (cmd.includes("test")) {
      return [
        { type: "output", content: "🧪 Running tests...", timestamp: new Date() },
        { type: "output", content: "✓ 24 tests passed", timestamp: new Date() },
        { type: "error", content: "⚠ 2 tests have low coverage", timestamp: new Date() },
        { type: "suggestion", content: "💡 AI suggests: Add tests for components/Button.tsx", timestamp: new Date() },
      ];
    }
    
    if (cmd.includes("git") && cmd.includes("commit")) {
      return [
        { type: "output", content: "📝 Committing changes...", timestamp: new Date() },
        { type: "output", content: "✓ Committed: feat: add AI-powered terminal interface", timestamp: new Date() },
        { type: "suggestion", content: "💡 AI suggests: Consider adding a pre-commit hook for linting", timestamp: new Date() },
      ];
    }
    
    // AI natural language processing
    if (!cmd.startsWith("npm") && !cmd.startsWith("git") && !cmd.startsWith("yarn")) {
      return [
        { type: "output", content: "🤖 AI is analyzing your request...", timestamp: new Date() },
        { type: "output", content: "I understand you want help with: " + command, timestamp: new Date() },
        { type: "suggestion", content: "💡 Try: 'npm run dev' to start the development server", timestamp: new Date() },
      ];
    }

    return [
      { type: "output", content: `Command executed: ${command}`, timestamp: new Date() },
      { type: "suggestion", content: "💡 AI suggests: Use 'help' to see available commands", timestamp: new Date() },
    ];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const getLineIcon = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "❯";
      case "error":
        return "❌";
      case "suggestion":
        return "💡";
      default:
        return "";
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-[hsl(var(--accent-primary))]";
      case "output":
        return "text-[hsl(var(--text-primary))]";
      case "error":
        return "text-[hsl(var(--accent-error))]";
      case "suggestion":
        return "text-[hsl(var(--accent-warning))]";
      default:
        return "text-[hsl(var(--text-secondary))]";
    }
  };

  return (
    <div className="terminal flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 border-b border-[hsl(var(--border-subtle))]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
          <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">AI Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          {isThinking && (
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--accent-warning))]">
              <Zap className="w-3 h-3 ai-thinking" />
              <span>AI Processing...</span>
            </div>
          )}
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-error))]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-warning))]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-success))]"></div>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm cursor-text"
        onClick={handleTerminalClick}
      >
        {history.map((line, index) => (
          <div key={index} className={`flex items-start gap-2 mb-1 ${getLineColor(line.type)}`}>
            <span className="w-4 text-center flex-shrink-0">
              {getLineIcon(line.type)}
            </span>
            <span className="flex-1 whitespace-pre-wrap break-words">
              {line.content}
            </span>
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center gap-2 text-[hsl(var(--accent-primary))]">
          <span className="w-4 text-center">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-[hsl(var(--text-primary))] placeholder-[hsl(var(--text-tertiary))]"
            placeholder="Type a command or ask AI..."
            autoFocus
          />
          {isThinking && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[hsl(var(--accent-primary))] rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-[hsl(var(--accent-primary))] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1 h-1 bg-[hsl(var(--accent-primary))] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions Bar */}
      <div className="p-2 bg-[hsl(var(--bg-secondary))] border-t border-[hsl(var(--border-subtle))]">
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="w-3 h-3 text-[hsl(var(--accent-warning))]" />
          <span className="text-[hsl(var(--text-secondary))]">AI suggests:</span>
          <button className="text-[hsl(var(--accent-primary))] hover:underline">
            npm run build
          </button>
          <span className="text-[hsl(var(--text-tertiary))]">•</span>
          <button className="text-[hsl(var(--accent-primary))] hover:underline">
            git status
          </button>
        </div>
      </div>
    </div>
  );
}