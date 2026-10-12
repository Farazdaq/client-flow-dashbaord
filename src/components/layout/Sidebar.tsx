import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LuBrainCircuit,
  LuChartNoAxesCombined,
  LuChevronLeft,
  LuChevronRight,
  LuFileText,
  LuLayoutDashboard,
  LuMegaphone,
  LuMessagesSquare,
  LuPanelsTopLeft,
  LuPlug,
  LuShare2,
  LuUsers,
  LuX,
} from "react-icons/lu";
import Logo from "../Logo/Logo";
import AIAssistance, {
  useAIAssistance,
  type AIAssistanceController,
} from "../../pages/AIAccesstnce";

const SHOW_AI_CASE_SWITCHER = true;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  ai?: AIAssistanceController;
  footerContent?: ReactNode;
  expandedContent?: ReactNode;
}

const navigationItems = [
  { label: "Dashboard", path: "/", end: true, icon: LuLayoutDashboard },
  { label: "Customers", path: "/customers", icon: LuUsers },
  { label: "Listings", path: "/listings", icon: LuPanelsTopLeft },
  { label: "Campaigns", path: "/campaigns", icon: LuMegaphone },
  { label: "Conversations", path: "/conversations", icon: LuMessagesSquare },
  { label: "Social Media", path: "/social-media", icon: LuShare2 },
  { label: "AI Insights", path: "/ai-insights", icon: LuBrainCircuit },
  { label: "Analytics", path: "/analytics", icon: LuChartNoAxesCombined },
  { label: "Reports", path: "/reports", icon: LuFileText },
  { label: "Integrations", path: "/integrations", icon: LuPlug },
];

export default function Sidebar({
  isOpen,
  onClose,
  expanded,
  onExpandedChange,
  ai: aiFromParent,
  footerContent,
  expandedContent,
}: SidebarProps) {
  const ownAi = useAIAssistance();
  const ai = aiFromParent ?? ownAi;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 bg-[#3D4151] text-white transition-[width,transform] duration-300 ease-in-out md:translate-x-0 ${
        expanded ? "w-full" : "w-60"
      } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div
        className={`flex h-full w-60 shrink-0 flex-col transition-[width] duration-300 ease-in-out ${
          expanded ? "md:w-16" : ""
        }`}
      >
        <div
          className={`flex h-14 min-h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 ${
            expanded ? "md:justify-center md:px-0" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <span
              className={`text-sm font-semibold tracking-wide text-white ${
                expanded ? "md:hidden" : ""
              }`}
            >
              ClientFlow
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1 text-slate-300 hover:bg-white/10 md:hidden"
          >
            <LuX size={20} />
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden px-1.5 pb-4 pt-2"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                aria-label={item.label}
                title={expanded ? item.label : undefined}
                onClick={() => {
                  onClose();
                  onExpandedChange(false);
                }}
                className={({ isActive }) =>
                  `flex h-9 items-center gap-2.5 rounded-md px-3.5 text-sm font-medium transition-colors ${
                    expanded ? "md:justify-center md:px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#505568] text-white"
                      : "text-[#B8BDCC] hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                <span className={expanded ? "md:hidden" : ""}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div
          className={`flex shrink-0 items-end gap-2 border-t border-white/10 p-2 ${
            expanded ? "md:flex-col md:items-center md:justify-center" : ""
          }`}
        >
          {footerContent ? (
            <div
              className={`min-w-0 h-full  flex-1 ${expanded ? "md:hidden" : ""}`}
            >
              {footerContent}
            </div>
          ) : (
            <>
              <div className={`min-w-0  flex-1 ${expanded ? "md:hidden" : ""}`}>
                <AIAssistance
                  ai={ai}
                  variant="card"
                  onOpen={() => onExpandedChange(true)}
                />
              </div>

              {expanded && (
                <div className="hidden md:block ">
                  <AIAssistance
                    ai={ai}
                    variant="card"
                    onOpen={() => onExpandedChange(true)}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => onExpandedChange(!expanded)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            className="hidden size-9 shrink-0 items-center justify-center rounded-md text-[#B8BDCC] transition-colors hover:bg-white/10 hover:text-white md:flex"
          >
            {expanded ? (
              <LuChevronLeft size={18} />
            ) : (
              <LuChevronRight size={18} />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="hidden  min-w-0 flex-1 overflow-hidden border-l border-white/10 md:block">
          {expandedContent ?? (
            <AIAssistance
              ai={ai}
              variant="panel"
              devSwitcher={SHOW_AI_CASE_SWITCHER}
            />
          )}
        </div>
      )}
    </aside>
  );
}
