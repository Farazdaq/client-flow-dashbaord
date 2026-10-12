import { LuMenu, LuSearch, LuBell, LuChevronDown } from "react-icons/lu";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full min-w-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6">
      {/* Left: Mobile menu + Search */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <LuMenu size={21} strokeWidth={1.8} />
        </button>

        <div className="relative w-full max-w-sm">
          <LuSearch
            size={16}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search customers, campaigns, alerts..."
            aria-label="Search customers, campaigns, and alerts"
            className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right: Notifications + User profile */}
      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <LuBell size={19} strokeWidth={1.8} />

          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
            3
          </span>
        </button>

        <button
          type="button"
          aria-label="Account menu for Alex Morgan"
          className="flex shrink-0 items-center gap-2 rounded-md py-1 text-left transition hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            AM
          </span>

          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="text-sm font-semibold leading-5 text-slate-800">
              Alex Morgan
            </span>
            <span className="text-xs leading-4 text-slate-500">
              Account Manager
            </span>
          </span>

          <LuChevronDown
            size={16}
            strokeWidth={1.8}
            className="hidden text-slate-500 sm:block"
          />
        </button>
      </div>
    </header>
  );
}
