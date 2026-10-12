import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuPanelsTopLeft,
  LuMegaphone,
  LuMessagesSquare,
  LuShare2,
  LuBrainCircuit,
  LuChartNoAxesCombined,
  LuFileText,
  LuPlug,
  LuX,
  LuChevronRight,
  LuChevronLeft,
} from "react-icons/lu";
import Logo from "../Logo/Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Component shown in the center when the sidebar is expanded */
  expandedContent?: ReactNode;
  /** Component shown in the footer, before the arrow button */
  footerContent?: ReactNode;
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

/** Default placeholder for the center area (replace via `expandedContent`) */
function ExpandedPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex h-full max-h-96 w-full max-w-2xl items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-[#B8BDCC]">
        Component placeholder
      </div>
    </div>
  );
}

/** Default placeholder for the footer slot (replace via `footerContent`) */
function FooterPlaceholder() {
  return (
    <div className="flex h-9 w-full items-center justify-center rounded-md border border-dashed border-white/20 text-xs text-[#B8BDCC]">
      Placeholder
    </div>
  );
}

export default function Sidebar({
  isOpen,
  onClose,
  expanded,
  onExpandedChange,
  expandedContent,
  footerContent,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen shrink-0
        bg-[#3D4151] text-white
        transition-[width,transform] duration-300 ease-in-out
        w-60
        ${expanded ? "md:w-full" : "md:w-60"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Icon rail / normal sidebar */}
      <div
        className={`flex h-full w-60 shrink-0 flex-col transition-[width] duration-300 ease-in-out ${
          expanded ? "md:w-16" : ""
        }`}
      >
        {/* Brand: matches the navbar height */}
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

        {/* Navigation */}
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
                  onExpandedChange(false); // reveal the page you navigated to
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
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className={expanded ? "md:hidden" : ""}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: placeholder slot, then the expand / collapse arrow */}
        <div
          className={`flex shrink-0 items-center gap-2 border-t border-white/10 p-2 ${
            expanded ? "md:justify-center" : ""
          }`}
        >
          <div className={`min-w-0 flex-1 ${expanded ? "md:hidden" : ""}`}>
            {footerContent ?? <FooterPlaceholder />}
          </div>

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

      {/* Center area, only when expanded */}
      {expanded && (
        <div className="hidden min-w-0 flex-1 overflow-hidden border-l border-white/10 md:block">
          {expandedContent ?? <ExpandedPlaceholder />}
        </div>
      )}
    </aside>
  );
}
