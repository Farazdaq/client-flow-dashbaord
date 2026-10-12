import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AIAssistance, { useAIAssistance } from "../../pages/AIAccesstnce"; // adjust path

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // call the hook once here so both slots share the same state
  const ai = useAIAssistance();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        expanded={sidebarExpanded}
        onExpandedChange={setSidebarExpanded}
        footerContent={
          <AIAssistance
            ai={ai}
            variant="compact"
            onOpen={() => setSidebarExpanded(true)}
          />
        }
        expandedContent={<AIAssistance ai={ai} variant="panel" devSwitcher />}
      />

      <div className="min-h-screen min-w-0 md:ml-60">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
