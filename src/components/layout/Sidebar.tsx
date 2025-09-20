"use client";

import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  File, 
  Bot, 
  Send, 
  Sparkles,
  FileText,
  Code,
  Braces
} from "lucide-react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  aiScore?: number;
}

const projectFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      { name: "components", type: "folder" },
      { name: "pages", type: "folder" },
      { name: "utils", type: "folder" },
      { name: "app.tsx", type: "file", aiScore: 0.9 },
      { name: "index.tsx", type: "file", aiScore: 0.7 }
    ]
  },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" }
];

const suggestedFiles = [
  { name: "components/Button.tsx", aiScore: 0.95, icon: Code },
  { name: "utils/helpers.ts", aiScore: 0.8, icon: Braces },
  { name: "styles/globals.css", aiScore: 0.6, icon: FileText }
];

const chatHistory = [
  { role: "user", content: "How do I implement AI autocomplete?" },
  { role: "assistant", content: "I can help you implement TabX autocomplete. Let me show you the pattern..." }
];

export function Sidebar() {
  const [chatInput, setChatInput] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]));
  const [messages, setMessages] = useState(chatHistory);

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [
      ...messages,
      { role: "user" as const, content: chatInput },
      { role: "assistant" as const, content: "I understand your request. Let me help you with that..." }
    ];
    
    setMessages(newMessages);
    setChatInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderFileTree = (files: FileItem[], depth = 0) => {
    return files.map((file) => (
      <div key={file.name} style={{ paddingLeft: `${depth * 16}px` }}>
        <div className="flex items-center gap-2 py-1 px-2 hover:bg-[hsl(var(--bg-accent))] rounded cursor-pointer">
          {file.type === "folder" ? (
            expandedFolders.has(file.name) ? (
              <FolderOpen className="w-4 h-4 text-[hsl(var(--accent-primary))]" onClick={() => toggleFolder(file.name)} />
            ) : (
              <Folder className="w-4 h-4 text-[hsl(var(--text-secondary))]" onClick={() => toggleFolder(file.name)} />
            )
          ) : (
            <File className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
          )}
          <span className="text-sm text-[hsl(var(--text-primary))]">{file.name}</span>
        </div>
        {file.type === "folder" && expandedFolders.has(file.name) && file.children && (
          renderFileTree(file.children, depth + 1)
        )}
      </div>
    ));
  };

  return (
    <aside className="sidebar flex flex-col">
      {/* Smart File Explorer */}
      <section className="flex-1 p-4 border-b border-solid">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))]">Explorer</h3>
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 rounded hover:bg-[hsl(var(--bg-accent))] transition-colors"
              title="AI Organize Files"
            >
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
            </button>
          </div>
        </header>
        
        {/* AI-suggested relevant files */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-[hsl(var(--text-secondary))] mb-2">Related to current task</h4>
          {suggestedFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-2 py-1 px-2 hover:bg-[hsl(var(--bg-accent))] rounded cursor-pointer">
              <file.icon className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
              <span className="text-xs text-[hsl(var(--text-primary))] flex-1">{file.name}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--accent-success) / ${file.aiScore})` }}></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {renderFileTree(projectFiles)}
        </div>
      </section>
      
      {/* AI Chat Interface */}
      <section className="flex-1 p-4 flex flex-col">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))]">AI Assistant</h3>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-[hsl(var(--accent-success))] text-[hsl(var(--bg-primary))] text-xs rounded font-medium">
              GPT-4 Ready
            </div>
          </div>
        </header>
        
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                message.role === "user" 
                  ? "bg-[hsl(var(--accent-primary))] text-white" 
                  : "bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-primary))]"
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI anything..."
            className="flex-1 bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-subtle))] rounded-lg px-3 py-2 text-sm text-[hsl(var(--text-primary))] placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))]"
          />
          <button 
            onClick={sendMessage}
            className="p-2 bg-[hsl(var(--accent-primary))] text-white rounded-lg hover:bg-[hsl(var(--accent-primary)_/_0.9)] transition-colors"
            disabled={!chatInput.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </aside>
  );
}