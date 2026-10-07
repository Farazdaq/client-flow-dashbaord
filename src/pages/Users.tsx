export default function Users() {
  return (
    <div>
      <div
        className="
          mb-6 flex flex-col gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customers and user data.
          </p>
        </div>

        <button
          type="button"
          className="
            w-full rounded-lg
            bg-blue-600 px-4 py-3
            text-sm font-semibold text-white
            hover:bg-blue-700
            sm:w-auto
          "
        >
          + Add User
        </button>
      </div>

      <div
        className="
          rounded-xl
          border border-slate-200
          bg-white p-5
          shadow-sm
        "
      >
        <h2 className="text-base font-semibold text-slate-900">Customers</h2>

        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Your customer list will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
