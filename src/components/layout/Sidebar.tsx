import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        h-screen
        w-64
        bg-slate-950
        text-white
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
            C
          </div>

          <span className="text-lg font-bold">ClientFlow</span>
        </div>

        <button onClick={onClose} className="ml-auto text-2xl md:hidden">
          ×
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`
          }
        >
          <span>▦</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`
          }
        >
          <span>◉</span>
          <span>Customers</span>
        </NavLink>

        <NavLink
          to="/integrations"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`
          }
        >
          <span>⚙</span>
          <span>Integrations</span>
        </NavLink>
      </nav>
    </aside>
  );
}
