import { HeaderBar } from "@/components/layout/HeaderBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Inspector } from "@/components/layout/Inspector";
import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  return (
    <div className="layout-container">
      <HeaderBar />
      <Sidebar />
      <CodeEditor />
      <Inspector />
      <Terminal />
    </div>
  );
}
