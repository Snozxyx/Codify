"use client";

import { useState, useEffect } from "react";
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
import { AIService, type ProjectFile } from "@/lib/tauri-api";

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

const chatHistory = [
  { role: "user", content: "How do I implement AI autocomplete?" },
  { role: "assistant", content: "I can help you implement TabX autocomplete. Let me show you the pattern..." }
];

export function Sidebar() {
  const [chatInput, setChatInput] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]));
  const [messages, setMessages] = useState(chatHistory);
  const [suggestedFiles, setSuggestedFiles] = useState<ProjectFile[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [
      ...messages,
      { role: "user" as const, content: chatInput }
    ];
    
    setMessages(newMessages);
    setChatInput("");

    // Simulate AI response - in real implementation, this could use a chat completion API
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant" as const, 
        content: "I understand your request. Let me help you with that..." 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Load AI-suggested files
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await AIService.getAISuggestedFiles('app.tsx', '/current/project');
        setSuggestedFiles(suggestions);
      } catch (error) {
        console.error('Failed to load AI suggestions:', error);
        // Fallback to mock data
        setSuggestedFiles([
          {
            path: 'src/components/Button.tsx',
            name: 'Button.tsx',
            file_type: 'typescript',
            size: 2048,
            modified: '2024-01-15T10:30:00Z',
            ai_relevance: 0.95
          },
          {
            path: 'src/utils/helpers.ts',
            name: 'helpers.ts',
            file_type: 'typescript',
            size: 1024,
            modified: '2024-01-14T15:20:00Z',
            ai_relevance: 0.80
          },
          {
            path: 'src/styles/globals.css',
            name: 'globals.css',
            file_type: 'css',
            size: 4096,
            modified: '2024-01-13T09:15:00Z',
            ai_relevance: 0.60
          }
        ]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, []);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'typescript':
      case 'javascript':
        return Code;
      case 'json':
        return Braces;
      case 'css':
      case 'scss':
        return FileText;
      default:
        return File;
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
          <h4 className="text-xs font-medium text-[hsl(var(--text-secondary))] mb-2">
            Related to current task
            {isLoadingSuggestions && (
              <span className="ml-2 inline-block w-3 h-3 border border-[hsl(var(--accent-primary))] border-t-transparent rounded-full animate-spin"></span>
            )}
          </h4>
          {suggestedFiles.map((file) => {
            const IconComponent = getFileIcon(file.file_type);
            return (
              <div key={file.path} className="flex items-center gap-2 py-1 px-2 hover:bg-[hsl(var(--bg-accent))] rounded cursor-pointer">
                <IconComponent className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
                <span className="text-xs text-[hsl(var(--text-primary))] flex-1">{file.name}</span>
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: `hsl(var(--accent-success) / ${file.ai_relevance || 0.5})` }}
                ></div>
              </div>
            );
          })}
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