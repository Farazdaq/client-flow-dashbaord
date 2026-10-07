interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xl hover:bg-slate-100 md:hidden"
        >
          ☰
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-800">ClientFlow</p>

          <p className="text-xs text-slate-500">
            Customer management dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200"
        >
          🔔
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          FA
        </div>
      </div>
    </header>
  );
}
