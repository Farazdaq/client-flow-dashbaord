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
} from "react-icons/lu";
import Logo from "../Logo/Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen w-60 shrink-0 flex-col
        bg-[#3D4151] text-white
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Brand: matches the navbar height */}
      <div className="flex h-14 min-h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <span className="text-sm font-semibold tracking-wide text-white">
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
        className="flex-1 space-y-0.5 overflow-y-auto px-1.5 pb-4 pt-2"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-9 items-center gap-2.5 rounded-md px-3.5 text-sm font-medium transition-colors ${
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
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
