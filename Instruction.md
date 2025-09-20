# ProjectCode: AI Coding Agent Instructions

## Project Overview

ProjectCode is an ambitious **offline-first AI-powered IDE** that combines advanced code intelligence, bidirectional design-code synchronization, and multi-agent workflows. This project aims to surpass existing tools like Cursor, VS Code Copilot, and Figma through superior local AI integration and novel features.

## Core Architecture Understanding

### Technology Stack
- **Desktop Framework**: Tauri (Rust backend + React/TypeScript frontend) for 96% smaller bundles and 58% less memory vs Electron
- **Code Editor**: Monaco Editor with custom AI extensions
- **AI Inference**: llama.cpp for local LLM execution with automatic GPU/CPU fallback
- **Vector Storage**: DuckDB with VSS extension for code embeddings and semantic search
- **Multi-Agent**: LangGraph for workflow orchestration
- **Design Engine**: Custom WebGL canvas for bidirectional code-design sync

### Key Components
- **MemoryX**: Hierarchical context management (user/project/session memory)
- **TabX**: Multi-level autocomplete (line/block/component/feature completion)
- **AI Designer**: Bidirectional design-code synchronization engine
- **Reasoning Mode**: Complex task planning with step-by-step analysis
- **Internet Mode**: Hybrid online/offline with API discovery and GitHub integration

## Development Patterns & Conventions

### File Organization
```
src/
├── components/         # React UI components
│   ├── CodeEditor/    # Monaco integration with AI overlays
│   ├── AIDesigner/    # Design canvas and code sync
│   └── Terminal/      # AI-enhanced terminal
├── ai/                # AI service layer
│   ├── models/        # Local AI model management
│   ├── completion/    # TabX autocomplete system
│   └── reasoning/     # Deep planning and analysis
├── agents/            # Multi-agent system
├── storage/           # Vector DB and embedding management
└── workflows/         # LangGraph workflow definitions

src-tauri/src/
├── ai/               # Rust AI model bindings
├── storage/          # Vector database operations
└── commands/         # Tauri commands for frontend
```

### AI-First Development Approach
1. **Context Awareness**: All components must support context injection for AI features
2. **Incremental Processing**: Real-time updates for indexing, parsing, and AI inference
3. **Performance First**: 60fps UI with background AI processing
4. **Offline Capability**: Core functionality works without internet

### Code Generation Patterns

#### Tauri Commands
```rust
#[tauri::command]
async fn ai_complete_code(
    context: String,
    position: Position,
    level: CompletionLevel
) -> Result<CompletionResult, String> {
    // Implementation follows async pattern with error handling
}
```

#### React Component Structure
```typescript
interface AIComponentProps {
  context: AIContext;
  onAIEvent: (event: AIEvent) => void;
  fallbackUI?: ReactNode;
}

const AIComponent: React.FC<AIComponentProps> = ({ context, onAIEvent, fallbackUI }) => {
  // Always include loading states and error boundaries
  // Support both AI-enhanced and fallback modes
};
```

### State Management
- **AI Context**: Centralized context management through MemoryX
- **Real-time Sync**: WebSocket-like updates for cross-component communication
- **Persistence**: Critical state saved to local storage with encryption

## Critical Integration Points

### Monaco Editor Extensions
- Custom completion providers for TabX integration
- Real-time syntax highlighting with Tree-sitter
- AI overlay rendering for suggestions and explanations
- Keyboard shortcuts: Tab (accept), Escape (dismiss), Cmd+K (AI actions)

### Vector Database Operations
```sql
-- Core embedding query pattern
SELECT id, file_path, content, 
       array_cosine_similarity(embedding, ?1) as similarity
FROM code_embeddings
WHERE similarity > 0.6
ORDER BY similarity DESC
LIMIT 10
```

### AI Model Integration
- **Model Selection**: Automatic based on system resources (4B/8B/30B models)
- **Quantization**: Dynamic int4/int8 based on available VRAM
- **Context Windows**: 4K-32K tokens depending on model and task complexity

## Development Workflows

### Local Development Setup
```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli

# Setup frontend dependencies
pnpm install

# Download AI models (handled by setup script)
pnpm run setup:models

# Development server
pnpm tauri dev
```

### AI Model Management
- Models stored in `~/.projectcode/models/`
- Automatic downloading of quantized GGUF models
- GPU detection and optimal model selection
- Fallback to smaller models on resource constraints

### Testing Patterns
- **Unit Tests**: Jest for TypeScript, Cargo test for Rust
- **Integration Tests**: AI model loading and inference
- **Performance Tests**: Memory usage and inference latency
- **UI Tests**: Playwright for end-to-end workflows

## Project-Specific Conventions

### AI Feature Integration
Every major component should include:
1. **AI Context Provider**: Access to current project and user context
2. **Loading States**: Smooth transitions during AI processing
3. **Error Boundaries**: Graceful degradation when AI unavailable
4. **Accessibility**: Screen reader support for AI suggestions

### Performance Requirements
- **Startup Time**: <3 seconds to usable state
- **AI Response**: <500ms for line completion, <2s for complex operations
- **Memory Usage**: <200MB base, +500MB per loaded AI model
- **Animations**: 60fps with GPU acceleration where possible

### Security Considerations
- All AI processing happens locally by default
- Encrypted storage for user data and preferences
- Sandboxed model execution in separate processes
- Optional cloud sync with end-to-end encryption

## Error Handling & Debugging

### AI Model Failures
```typescript
try {
  const completion = await aiModel.complete(context);
  return completion;
} catch (error) {
  // Log error, fallback to simpler model or disable AI features
  logger.error('AI completion failed:', error);
  return fallbackCompletion(context);
}
```

### Common Debug Commands
```bash
# Check AI model status
tauri dev --debug ai-status

# Vector database inspection
sqlite3 ~/.projectcode/embeddings.db ".tables"

# Performance profiling
pnpm run profile:ai
```

## Key Implementation Priorities

1. **Phase 1 (Foundation)**: Tauri app + Monaco + basic AI integration
2. **Phase 2 (Intelligence)**: TabX autocomplete + code search + AI terminal
3. **Phase 3 (Advanced)**: Multi-agent workflows + AI Designer + reasoning mode
4. **Phase 4 (Innovation)**: Cross-device sync + AR/VR + adaptive learning

## External Dependencies & APIs

### Required for Internet Mode
- **GitHub API**: Repository discovery and collaboration
- **NPM/PyPI APIs**: Package search and dependency analysis
- **OpenAPI Registry**: API discovery and documentation

### Optional Cloud Services
- **Model Hosting**: Fallback for users without local compute
- **Telemetry**: Usage analytics (opt-in only)
- **Sync Service**: Cross-device state synchronization

## Common Gotchas & Solutions

1. **Model Loading**: Use async initialization with progress indicators
2. **Memory Management**: Unload unused models, implement context caching
3. **Cross-Platform**: Test thoroughly on Windows/macOS/Linux
4. **Accessibility**: Include ARIA labels for all AI-generated content
5. **Performance**: Profile regularly, optimize critical paths first
6. **AI Context**: Ensure context is always up-to-date before AI calls
7. **Error Handling**: Always provide user feedback on AI failures
8. **Concurrency**: Manage multiple AI
9. **Versioning**: Keep AI models and dependencies updated
10. **User Preferences**: Respect user settings for AI features
11. **UI/UX**: Avoid intrusive AI suggestions, focus on seamless integration
12. **Testing**: Include AI scenarios in regular test suites
13. **Documentation**: Keep AI feature docs current and comprehensive
14. **Resource Monitoring**: Alert users when system resources are low
15. **Fallback Modes**: Always have non-AI alternatives for critical features
16. **Design Style**: Maintain consistent UI/UX design patterns across AI features

## Any More Gotchas?
1. Check the Docs/  Files

## Contributing Guidelines

- Follow the established TypeScript patterns in existing docs
- All AI features must include fallback modes
- Performance tests required for AI-related changes
- Documentation updates for new AI capabilities
- Consider offline-first design in all implementations

---

This project represents the future of AI-assisted development. Focus on creating seamless, non-intrusive AI integration that enhances rather than interrupts the developer workflow. 
