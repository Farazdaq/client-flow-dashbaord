const stats = [
  {
    title: "Total Customers",
    value: "12,842",
    change: "+12.5%",
    description: "vs. last month",
  },
  {
    title: "Active Customers",
    value: "8,421",
    change: "+8.2%",
    description: "vs. last month",
  },
  {
    title: "Messages Sent",
    value: "24,892",
    change: "+18.7%",
    description: "vs. last month",
  },
  {
    title: "Engagement Rate",
    value: "68.4%",
    change: "+5.4%",
    description: "vs. last month",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your customer engagement and communication.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>

            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>

              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                {stat.change}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Customer Growth */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Customer Growth</h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer acquisition over the last 6 months.
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 flex h-64 items-end gap-3 border-b border-l border-slate-200 px-4 pb-0">
            {[35, 48, 42, 65, 58, 78, 72, 88, 82, 96, 90, 100].map(
              (height, index) => (
                <div key={index} className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ),
            )}
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">AI Insights</h2>

              <p className="mt-1 text-sm text-slate-500">
                Intelligent customer analysis.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              AI
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Engagement increasing
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Customer engagement increased 18% this month.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                124 customers at risk
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                These customers have shown declining activity.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                Campaign opportunity
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                A targeted campaign could increase conversions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Recent Campaigns</h2>

          <div className="mt-4 divide-y divide-slate-100">
            {[
              ["Summer Engagement", "2,842", "Active"],
              ["Customer Winback", "1,294", "Completed"],
              ["New Customer Welcome", "892", "Active"],
            ].map(([name, audience, status]) => (
              <div
                key={name}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{name}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    {audience} customers
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Communication Activity
          </h2>

          <div className="mt-5 space-y-5">
            <Activity label="Email" value="12,482" percentage="72%" />

            <Activity label="WhatsApp" value="8,241" percentage="58%" />

            <Activity
              label="Push Notifications"
              value="4,169"
              percentage="41%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActivityProps {
  label: string;
  value: string;
  percentage: string;
}

function Activity({ label, value, percentage }: ActivityProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>

        <span className="text-sm text-slate-500">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}
