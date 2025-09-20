import { invoke } from '@tauri-apps/api/core';

// AI Types
export interface Position {
  line: number;
  column: number;
}

export type CompletionLevel = 'Line' | 'Block' | 'Component' | 'Feature';

export interface CompletionResult {
  id: string;
  level: CompletionLevel;
  confidence: number;
  code: string;
  language: string;
  alternatives: string[];
}

export interface AIContext {
  project_path: string;
  current_file?: string;
  selected_text?: string;
  cursor_position: Position;
}

// Storage Types
export interface ProjectFile {
  path: string;
  name: string;
  file_type: string;
  size: number;
  modified: string;
  ai_relevance?: number;
}

// Terminal Types
export interface TerminalCommand {
  command: string;
  args: string[];
  working_dir: string;
}

export interface TerminalResponse {
  success: boolean;
  output: string;
  error?: string;
  suggestions: string[];
}

// Design Types
export interface DesignPrompt {
  description: string;
  component_type: string;
  style_preferences: Record<string, string>;
}

export interface GeneratedDesign {
  component_code: string;
  styles: string;
  props_interface: string;
  preview_url?: string;
}

// AI Service
export class TauriAIService {
  // AI Code Completion
  static async completeCode(context: AIContext, level: CompletionLevel): Promise<CompletionResult> {
    return await invoke('ai_complete_code', { context, level });
  }

  static async explainCode(code: string): Promise<string> {
    return await invoke('ai_explain_code', { code });
  }

  static async suggestRefactor(code: string): Promise<string[]> {
    return await invoke('ai_suggest_refactor', { code });
  }

  static async generateTests(code: string): Promise<string> {
    return await invoke('ai_generate_tests', { code });
  }

  // File Management
  static async getProjectFiles(projectPath: string): Promise<ProjectFile[]> {
    return await invoke('get_project_files', { projectPath });
  }

  static async getAISuggestedFiles(currentFile: string, projectPath: string): Promise<ProjectFile[]> {
    return await invoke('get_ai_suggested_files', { currentFile, projectPath });
  }

  static async searchCodeSemantic(query: string, projectPath: string): Promise<unknown[]> {
    return await invoke('search_code_semantic', { query, projectPath });
  }

  // Terminal
  static async executeTerminalCommand(command: TerminalCommand): Promise<TerminalResponse> {
    return await invoke('execute_terminal_command', { command });
  }

  // Design
  static async generateDesign(prompt: DesignPrompt): Promise<GeneratedDesign> {
    return await invoke('ai_generate_design', { prompt });
  }

  // System Status
  static async getAIStatus(): Promise<Record<string, unknown>> {
    return await invoke('get_ai_status');
  }
}

// Mock fallback for development when not in Tauri
export class MockAIService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async completeCode(_context: AIContext, level: CompletionLevel): Promise<CompletionResult> {
    return {
      id: '1',
      level,
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
      language: 'typescript',
      alternatives: ['Styled components variant', 'CSS modules variant']
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async explainCode(_code: string): Promise<string> {
    return "This code creates a reusable Button component with TypeScript props and CSS class variants.";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async suggestRefactor(_code: string): Promise<string[]> {
    return [
      "Extract common button styles to a design system",
      "Add prop validation with TypeScript",
      "Implement accessibility features"
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async generateTests(_code: string): Promise<string> {
    return `describe('Button', () => {
  test('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getProjectFiles(_projectPath: string): Promise<ProjectFile[]> {
    return [
      {
        path: 'src/components/Button.tsx',
        name: 'Button.tsx',
        file_type: 'typescript',
        size: 2048,
        modified: '2024-01-15T10:30:00Z',
        ai_relevance: 0.95
      }
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getAISuggestedFiles(_currentFile: string, _projectPath: string): Promise<ProjectFile[]> {
    return [
      {
        path: 'src/components/Button.tsx',
        name: 'Button.tsx',
        file_type: 'typescript',
        size: 2048,
        modified: '2024-01-15T10:30:00Z',
        ai_relevance: 0.95
      }
    ];
  }

  static async executeTerminalCommand(command: TerminalCommand): Promise<TerminalResponse> {
    return {
      success: true,
      output: `Executed: ${command.command} ${command.args.join(' ')}`,
      suggestions: ['This is a simulated response']
    };
  }

  static async generateDesign(prompt: DesignPrompt): Promise<GeneratedDesign> {
    return {
      component_code: `const ${prompt.component_type} = () => <div>Generated Component</div>;`,
      styles: '.generated { color: blue; }',
      props_interface: `interface ${prompt.component_type}Props { }`
    };
  }

  static async getAIStatus(): Promise<Record<string, unknown>> {
    return {
      model_loaded: true,
      model_name: 'GPT-4 (Mock)',
      gpu_usage: 23,
      memory_usage: 156,
      inference_speed: 'Fast',
      last_activity: new Date().toISOString()
    };
  }
}

// Auto-detect environment and export appropriate service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;

export const AIService = isTauri ? TauriAIService : MockAIService;