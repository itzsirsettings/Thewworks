import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAdminStats } from '../../hooks/useAdminStats';
import { dashboardFunnel, regionSeries } from '../../lib/marketplace-data';

const palette = {
  sand: '#fffaf3',
  sandMuted: '#f4e6d6',
  ink: '#241814',
  muted: '#7b6658',
  border: '#ddc6ab',
  orange: '#f97316',
  burgundy: '#5a1a2a',
  burgundyDeep: '#341018',
  clay: '#8c5330',
  wheat: '#d9a679',
};

const tooltipStyle = {
  backgroundColor: 'rgba(255, 250, 243, 0.98)',
  border: `1px solid ${palette.border}`,
  borderRadius: '18px',
  color: palette.ink,
  boxShadow: '0 20px 40px rgba(90, 26, 42, 0.12)',
};

const dashboardCardSurface =
  'live-card rounded-[28px] border border-[color:var(--admin-stroke)] bg-[rgba(255,251,245,0.88)] shadow-[0_24px_48px_rgba(90,26,42,0.10)] backdrop-blur-xl';

interface ThewworksICTAnalyticsDashboardProps {
  className?: string;
}

const ThewworksICTAnalyticsDashboard = ({
  className = '',
}: ThewworksICTAnalyticsDashboardProps) => {
  const { stats, isLoading, error } = useAdminStats();
  const themedRegionSeries = regionSeries.map((entry, index) => ({
    ...entry,
    color: [palette.orange, palette.burgundy, palette.clay, palette.wheat][index % 4],
  }));

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4"
            style={{ borderColor: palette.border, borderTopColor: palette.orange }}
          />
          <p className="text-sm font-medium" style={{ color: palette.muted }}>
            Loading store analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="my-10 rounded-[28px] border border-red-200 bg-red-50 p-8 text-center shadow-[0_24px_48px_rgba(90,26,42,0.08)]">
        <h3 className="text-lg font-semibold text-[var(--admin-ink)]">Dashboard unavailable</h3>
        <p className="mt-2 text-sm text-red-600">
          {error || 'We encountered an error while fetching your real-time stats.'}
        </p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return `NGN ${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 1 }).format(val / 1000000)}M`;
  };

  const activeMetrics = [
    {
      label: 'Gross merchandise value',
      value: formatCurrency(stats.metrics.gmv),
      delta: stats.metrics.gmv > 0 ? 'Live' : '0.0%',
      detail: 'Aggregated from all verified paid orders in Supabase.',
    },
    {
      label: 'Verified orders',
      value: `${stats.metrics.totalOrders}`,
      delta: 'Active',
      detail: 'Total volume of RFQs and checkouts recorded.',
    },
    {
      label: 'Conversion rate',
      value: `${stats.metrics.conversionRate.toFixed(1)}%`,
      delta: 'Performance',
      detail: 'Percentage of initiated checkouts that reached paid status.',
    },
    {
      label: 'Avg order size',
      value: `NGN ${Math.round(stats.metrics.avgOrderSize).toLocaleString()}`,
      delta: 'Per checkout',
      detail: 'Average revenue generated per verified paid transaction.',
    },
  ];

  return (
    <section
      id="dashboard"
      className={`mx-auto w-full max-w-[1440px] px-4 pb-20 pt-16 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--admin-orange)]">
            Visual chart analysis
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--admin-ink)] md:text-4xl">
            Store performance dashboard
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--admin-muted)] md:text-base">
            A Thewworks overview of conversion, demand, and revenue activity, framed with a
            paper, ink, and warm production palette.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-[14px] bg-[rgba(244,230,214,0.85)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-burgundy)] shadow-[0_16px_28px_rgba(90,26,42,0.08)]">
            Real-time live connect
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {activeMetrics.map((metric) => (
          <article key={metric.label} className={`${dashboardCardSurface} p-5`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--admin-ink)]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm font-semibold text-[var(--admin-burgundy)]">
              {metric.delta}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--admin-muted)]">
              {metric.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <article className={`${dashboardCardSurface} p-5`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--admin-orange)]">
                Revenue and orders
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--admin-ink)]">
                Commercial flow over time
              </h3>
            </div>
            <span className="rounded-[14px] bg-[rgba(244,230,214,0.85)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-burgundy)]">
              GMV + orders
            </span>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.border} vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: palette.muted, fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: palette.muted, fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: palette.muted, fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={palette.orange}
                  fill={palette.orange}
                  fillOpacity={0.16}
                  strokeWidth={2.5}
                />
                <Bar yAxisId="right" dataKey="orders" fill={palette.burgundy} radius={[8, 8, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <div className="grid gap-4">
          <article className={`${dashboardCardSurface} p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--admin-orange)]">
              Category demand
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--admin-ink)]">
              What buyers ask for most
            </h3>

            <div className="mt-5 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryDemand} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={palette.border} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: palette.muted, fontSize: 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="demand" fill={palette.burgundy} radius={[0, 8, 8, 0]} />
                  <Bar dataKey="conversion" fill={palette.orange} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className={`${dashboardCardSurface} p-5`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--admin-orange)]">
                Delivery mix
              </p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Pie
                      data={themedRegionSeries}
                      innerRadius={48}
                      outerRadius={74}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {themedRegionSeries.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {themedRegionSeries.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span style={{ color: palette.muted }}>{entry.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: palette.ink }}>
                      {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${dashboardCardSurface} p-5`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--admin-orange)]">
                Pipeline
              </p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardFunnel} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: palette.muted, fontSize: 12 }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill={palette.burgundyDeep} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-sm leading-relaxed text-[var(--admin-muted)]">
                Print quotes convert faster when paper options, finishing choices and proof status
                are clear.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThewworksICTAnalyticsDashboard;
