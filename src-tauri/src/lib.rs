// Modules
mod ai;
mod storage;
mod commands;

use ai::*;
use storage::*;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::new().build())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      // AI Commands
      ai_complete_code,
      ai_explain_code,
      ai_suggest_refactor,
      ai_generate_tests,
      
      // Storage Commands
      get_project_files,
      search_code_semantic,
      store_code_embedding,
      get_ai_suggested_files,
      
      // General Commands
      execute_terminal_command,
      ai_generate_design,
      get_ai_status,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      
      log::info!("ProjectCode AI-Powered IDE starting...");
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running ProjectCode application");
}
