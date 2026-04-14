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
import {
  regionSeries,
  dashboardFunnel,
} from '../../lib/marketplace-data';

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #ebebeb',
  borderRadius: '14px',
  color: '#222222',
  boxShadow:
    'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px',
};

const dashboardCardSurface = 'rounded-[20px] bg-white shadow-airbnb-card';

interface StoreAnalyticsDashboardProps {
  className?: string;
}

const StoreAnalyticsDashboard = ({
  className = '',
}: StoreAnalyticsDashboardProps) => {
  const { stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="store-airbnb font-store flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c1c1c1] border-t-[#222222]" />
          <p className="text-sm font-medium text-[#6a6a6a]">Loading store analytics…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="store-airbnb font-store my-10 rounded-[20px] border border-[#c13515]/25 bg-[#fff5f3] p-8 text-center shadow-airbnb-card">
        <h3 className="text-lg font-semibold text-[#222222]">Dashboard unavailable</h3>
        <p className="mt-2 text-sm text-[#c13515]">
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
      delta: stats.metrics.gmv > 0 ? '+ Live' : '0.0%',
      detail: 'Aggregated from all verified paid orders in Supabase.',
    },
    {
      label: 'Verified Orders',
      value: `${stats.metrics.totalOrders}`,
      delta: 'Active',
      detail: 'Total volume of RFQs and checkouts recorded.',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.metrics.conversionRate.toFixed(1)}%`,
      delta: 'Performance',
      detail: 'Percentage of initiated checkouts that reached "paid" status.',
    },
    {
      label: 'Avg Order Size',
      value: `NGN ${Math.round(stats.metrics.avgOrderSize).toLocaleString()}`,
      delta: 'Per checkout',
      detail: 'Average revenue generated per verified paid transaction.',
    },
  ];

  const activeRevenueSeries = stats.revenueSeries;
  const activeDemandSeries = stats.categoryDemand;

  return (
    <section
      id="dashboard"
      className={`store-airbnb font-store mx-auto w-full max-w-[1440px] px-4 pb-20 pt-16 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
            Visual chart analysis
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#222222] md:text-4xl">
            Store performance dashboard
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#6a6a6a] md:text-base">
            Analytics for the same marketplace experience as the public store—white canvas,
            photography-forward listings, and secure checkout underneath.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-[14px] bg-[#f2f2f2] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#222222] shadow-airbnb-card">
            Real-time live connect
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {activeMetrics.map((metric) => (
          <article key={metric.label} className={`${dashboardCardSurface} p-5`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6a6a6a]">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#222222]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm font-semibold text-[#460479]">{metric.delta}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#6a6a6a]">{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <article className={`${dashboardCardSurface} p-5`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                Revenue and orders
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#222222]">
                Commercial flow over time
              </h3>
            </div>
            <span className="rounded-[14px] bg-[#f2f2f2] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#222222]">
              GMV + orders
            </span>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6a6a6a', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6a6a6a', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6a6a6a', fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff385c"
                  fill="#ff385c"
                  fillOpacity={0.14}
                  strokeWidth={2.5}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="#222222"
                  radius={[8, 8, 0, 0]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <div className="grid gap-4">
          <article className={`${dashboardCardSurface} p-5`}>
            <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
              Category demand
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#222222]">
              What buyers ask for most
            </h3>

            <div className="mt-5 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeDemandSeries}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ebebeb"
                    vertical={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6a6a6a', fontSize: 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="demand" fill="#222222" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="conversion" fill="#ff385c" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className={`${dashboardCardSurface} p-5`}>
              <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                Delivery mix
              </p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Pie
                      data={regionSeries}
                      innerRadius={48}
                      outerRadius={74}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {regionSeries.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {regionSeries.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-[#6a6a6a]">{entry.name}</span>
                    </div>
                    <span className="font-semibold text-[#222222]">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${dashboardCardSurface} p-5`}>
              <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                Pipeline
              </p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardFunnel}
                    layout="vertical"
                    margin={{ left: 10, right: 10 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6a6a6a', fontSize: 12 }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="#222222" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-sm leading-relaxed text-[#6a6a6a]">
                RFQs convert faster when room packages and appliance bundles are merchandised
                clearly.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreAnalyticsDashboard;
