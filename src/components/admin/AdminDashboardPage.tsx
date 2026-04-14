import { Suspense, lazy, useState } from 'react';
import { BarChart2, Package, ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import StankingsAdminLoginPage from './StankingsAdminLoginPage';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const StankingsAnalyticsDashboard = lazy(() => import('./StankingsAnalyticsDashboard'));
const StankingsAdminProductManager = lazy(() => import('./StankingsAdminProductManager'));

type AdminTab = 'analytics' | 'products';

const AdminTabLoadingState = ({ label }: { label: string }) => (
  <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
    <div className="rounded-[1.5rem] border border-[color:var(--admin-stroke)] bg-[var(--admin-surface-strong)] px-6 py-5 text-center shadow-[0_20px_40px_rgba(90,26,42,0.10)]">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--admin-orange)]" />
      <p className="mt-3 text-sm font-medium text-[var(--admin-muted)]">{label}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const { isAdmin, isLoading, logout, user } = useAdminAuth();

  const handleSignOut = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="admin-stankings flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-orange)]" />
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--admin-muted)]">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <StankingsAdminLoginPage />;
  }

  const desktopTabClassName =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition';
  const activeDesktopTabClassName =
    'bg-[var(--admin-burgundy)] text-white shadow-[0_16px_30px_rgba(90,26,42,0.16)]';
  const inactiveDesktopTabClassName =
    'text-[var(--admin-muted)] hover:text-[var(--admin-burgundy)]';

  return (
    <div className="admin-stankings min-h-screen font-store">
      <header className="sticky top-0 z-40 border-b border-[color:var(--admin-stroke)] bg-[rgba(255,250,243,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px] shadow-[0_16px_28px_rgba(90,26,42,0.18)]"
              style={{
                backgroundColor: 'var(--admin-burgundy)',
              }}
            >
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--admin-orange)]">
                Stankings Trade Hub
              </p>
              <h1 className="text-base font-bold tracking-[-0.03em] text-[var(--admin-ink)]">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 rounded-[1rem] bg-[rgba(221,198,171,0.35)] p-1 sm:flex">
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`${desktopTabClassName} ${
                  activeTab === 'analytics'
                    ? activeDesktopTabClassName
                    : inactiveDesktopTabClassName
                }`}
              >
                <BarChart2 size={14} />
                Analytics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`${desktopTabClassName} ${
                  activeTab === 'products'
                    ? activeDesktopTabClassName
                    : inactiveDesktopTabClassName
                }`}
              >
                <Package size={14} />
                Products
              </button>
            </div>

            <div className="hidden h-8 w-[1px] bg-[rgba(221,198,171,0.9)] sm:block" />

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-[1rem] bg-[var(--admin-burgundy)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-[0_16px_28px_rgba(90,26,42,0.16)] transition-all hover:bg-[var(--admin-burgundy-deep)] active:scale-95"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[rgba(221,198,171,0.9)] sm:hidden">
          <div className="mx-auto flex max-w-[1440px] gap-0 px-4">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                activeTab === 'analytics'
                  ? 'border-[var(--admin-orange)] text-[var(--admin-burgundy)]'
                  : 'border-transparent text-[var(--admin-muted)]'
              }`}
            >
              <BarChart2 size={14} />
              Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                activeTab === 'products'
                  ? 'border-[var(--admin-orange)] text-[var(--admin-burgundy)]'
                  : 'border-transparent text-[var(--admin-muted)]'
              }`}
            >
              <Package size={14} />
              Products
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(90,26,42,0.12)]">
            <ShieldCheck size={12} className="text-[var(--admin-burgundy)]" />
          </div>
          <p className="text-[11px] font-medium text-[var(--admin-muted)]">
            <span className="font-bold text-[var(--admin-burgundy)]">Verified admin session.</span>{' '}
            Signed in as{' '}
            <span className="font-bold tracking-tight text-[var(--admin-ink)]">
              {user?.email ?? 'admin@stankings.com'}
            </span>
          </p>
        </div>
      </div>

      <main className="pb-10">
        {activeTab === 'analytics' ? (
          <Suspense fallback={<AdminTabLoadingState label="Loading analytics..." />}>
            <StankingsAnalyticsDashboard />
          </Suspense>
        ) : null}
        {activeTab === 'products' ? (
          <Suspense fallback={<AdminTabLoadingState label="Loading products..." />}>
            <StankingsAdminProductManager />
          </Suspense>
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
