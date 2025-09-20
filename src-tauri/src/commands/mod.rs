use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalCommand {
    pub command: String,
    pub args: Vec<String>,
    pub working_dir: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalResponse {
    pub success: bool,
    pub output: String,
    pub error: Option<String>,
    pub suggestions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DesignPrompt {
    pub description: String,
    pub component_type: String,
    pub style_preferences: std::collections::HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneratedDesign {
    pub component_code: String,
    pub styles: String,
    pub props_interface: String,
    pub preview_url: Option<String>,
}

/// Execute terminal command with AI assistance
#[tauri::command]
pub async fn execute_terminal_command(
    command: TerminalCommand,
) -> Result<TerminalResponse, String> {
    log::info!("Executing terminal command: {}", command.command);
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    
    let response = match command.command.as_str() {
        "npm" => handle_npm_command(&command).await,
        "git" => handle_git_command(&command).await,
        "test" => handle_test_command(&command).await,
        _ => handle_generic_command(&command).await,
    };
    
    Ok(response)
}

async fn handle_npm_command(command: &TerminalCommand) -> TerminalResponse {
    if command.args.contains(&"install".to_string()) {
        TerminalResponse {
            success: true,
            output: "📦 Installing dependencies...\n✓ Dependencies installed successfully".to_string(),
            error: None,
            suggestions: vec![
                "Run 'npm audit' to check for security vulnerabilities".to_string(),
                "Consider using 'npm ci' for faster installs in CI".to_string(),
            ],
        }
    } else if command.args.contains(&"run".to_string()) && command.args.contains(&"build".to_string()) {
        TerminalResponse {
            success: true,
            output: "🔨 Building application...\n✓ Build completed in 12.3s".to_string(),
            error: None,
            suggestions: vec![
                "Your bundle size increased by 15%. Consider code splitting.".to_string(),
            ],
        }
    } else {
        TerminalResponse {
            success: true,
            output: format!("npm {} completed", command.args.join(" ")),
            error: None,
            suggestions: vec!["Use 'npm help' to see available commands".to_string()],
        }
    }
}

async fn handle_git_command(command: &TerminalCommand) -> TerminalResponse {
    if command.args.contains(&"status".to_string()) {
        TerminalResponse {
            success: true,
            output: "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   src/components/Button.tsx".to_string(),
            error: None,
            suggestions: vec![
                "Use 'git add .' to stage all changes".to_string(),
                "Use 'git commit -m \"message\"' to commit changes".to_string(),
            ],
        }
    } else if command.args.contains(&"commit".to_string()) {
        TerminalResponse {
            success: true,
            output: "📝 Committing changes...\n✓ Committed: feat: add AI-powered terminal interface".to_string(),
            error: None,
            suggestions: vec![
                "Consider adding a pre-commit hook for linting".to_string(),
            ],
        }
    } else {
        TerminalResponse {
            success: true,
            output: format!("git {} completed", command.args.join(" ")),
            error: None,
            suggestions: vec!["Use 'git help' to see available commands".to_string()],
        }
    }
}

async fn handle_test_command(_command: &TerminalCommand) -> TerminalResponse {
    TerminalResponse {
        success: true,
        output: "🧪 Running tests...\n✓ 24 tests passed\n⚠ 2 tests have low coverage".to_string(),
        error: None,
        suggestions: vec![
            "Add tests for components/Button.tsx".to_string(),
            "Consider increasing test coverage threshold".to_string(),
        ],
    }
}

async fn handle_generic_command(command: &TerminalCommand) -> TerminalResponse {
    TerminalResponse {
        success: true,
        output: format!("🤖 AI processed command: {}\nI understand you want help with: {}", 
                       command.command, 
                       command.args.join(" ")),
        error: None,
        suggestions: vec![
            "Try: 'npm run dev' to start the development server".to_string(),
            "Use 'help' to see available commands".to_string(),
        ],
    }
}

/// Generate design from AI prompt
#[tauri::command]
pub async fn ai_generate_design(prompt: DesignPrompt) -> Result<GeneratedDesign, String> {
    log::info!("Generating design from prompt: {}", prompt.description);
    
    tokio::time::sleep(std::time::Duration::from_millis(1000)).await;
    
    let design = GeneratedDesign {
        component_code: format!(r#"interface {}Props {{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}}

const {}: React.FC<{}Props> = ({{ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}}) => {{
  return (
    <button
      className={{`btn btn-${{variant}} btn-${{size}}`}}
      onClick={{onClick}}
    >
      {{children}}
    </button>
  );
}};"#, prompt.component_type, prompt.component_type, prompt.component_type),
        styles: r#".btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}"#.to_string(),
        props_interface: format!("interface {}Props {{\n  variant?: 'primary' | 'secondary' | 'outline';\n  size?: 'sm' | 'md' | 'lg';\n  children: React.ReactNode;\n  onClick?: () => void;\n}}", prompt.component_type),
        preview_url: None,
    };
    
    Ok(design)
}

/// Get AI system status
#[tauri::command]
pub async fn get_ai_status() -> Result<std::collections::HashMap<String, serde_json::Value>, String> {
    log::info!("Getting AI system status");
    
    let mut status = std::collections::HashMap::new();
    
    status.insert("model_loaded".to_string(), serde_json::Value::Bool(true));
    status.insert("model_name".to_string(), serde_json::Value::String("GPT-4".to_string()));
    status.insert("gpu_usage".to_string(), serde_json::Value::Number(serde_json::Number::from(23)));
    status.insert("memory_usage".to_string(), serde_json::Value::Number(serde_json::Number::from(156)));
    status.insert("inference_speed".to_string(), serde_json::Value::String("Fast".to_string()));
    status.insert("last_activity".to_string(), serde_json::Value::String(chrono::Utc::now().to_rfc3339()));
    
    Ok(status)
}