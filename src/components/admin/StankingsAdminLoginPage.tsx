import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Box,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface StankingsAdminLoginPageProps {
  onAuthenticated?: () => void;
}

const StankingsAdminLoginPage = ({ onAuthenticated }: StankingsAdminLoginPageProps) => {
  const { error, isLoading, login } = useAdminAuth();
  const approvedEmail = import.meta.env.VITE_ADMIN_EMAILS || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
    onAuthenticated?.();
  };

  const featurePills = [
    { label: 'Live sales tracking', icon: <Box size={16} /> },
    { label: 'Protected admin access', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="admin-stankings flex min-h-screen w-full overflow-hidden font-store">
      <div className="admin-hero admin-grid relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12 text-white">
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.26, 0.44, 0.26],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -left-[12%] -top-[16%] h-[72%] w-[72%] rounded-full bg-[rgba(249,115,22,0.28)] blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.18, 0.34, 0.18],
              x: [0, -40, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-[12%] bottom-[2%] h-[62%] w-[62%] rounded-full bg-[rgba(255,255,255,0.12)] blur-[110px]"
          />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_18px_40px_rgba(249,115,22,0.28)]"
              style={{
                backgroundColor: 'var(--admin-orange)',
              }}
            >
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/60">
                Stankings
              </p>
              <span className="text-2xl font-semibold tracking-[-0.04em] text-white">
                Trade Hub Admin
              </span>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-6 text-5xl font-bold leading-[1.02] text-white">
              Run the Stankings back office with
              <span className="block text-[#ffe8d3]">
                warmer, sharper control.
              </span>
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-white/72">
              Sign in with the approved Google account to monitor live sales, adjust
              catalog inventory, and manage the storefront from one control room.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {featurePills.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-md"
              >
                <div className="text-[var(--admin-orange)]">{item.icon}</div>
                <span className="text-sm font-medium text-white/80">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium text-white/48">
            2026 Stankings. All administrative actions are logged for security.
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-[rgba(249,115,22,0.08)]" />

        <div className="admin-panel relative w-full max-w-[460px] rounded-[2rem] p-8 sm:p-10">
          <div className="mb-10 flex flex-col items-center text-center lg:hidden">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.4rem] shadow-[0_18px_38px_rgba(90,26,42,0.18)]"
              style={{
                backgroundColor: 'var(--admin-burgundy)',
              }}
            >
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--admin-ink)]">Admin Access</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">
              Sign in with your approved Google account
            </p>
          </div>

          <div className="mb-10 hidden lg:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--admin-orange)]">
              Stankings control room
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--admin-ink)]">
              Welcome back
            </h1>
            <p className="mt-3 text-sm text-[var(--admin-muted)]">
              Admin access now runs through Google OAuth only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-[1.25rem] border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm font-semibold text-red-600">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="rounded-[1.5rem] border border-[color:var(--admin-stroke)] bg-white/80 p-5 shadow-[0_18px_40px_rgba(90,26,42,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--admin-orange)]">
                Google Sign-In Only
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--admin-muted)]">
                Use the Google account approved for this dashboard. Password-based admin
                sign-in has been removed from the storefront.
              </p>
              {approvedEmail ? (
                <p className="mt-3 text-sm font-semibold text-[var(--admin-ink)]">
                  Approved admin email: {approvedEmail}
                </p>
              ) : null}
              <div className="mt-4 flex items-center gap-3 rounded-[1rem] bg-[rgba(249,115,22,0.08)] px-4 py-3 text-sm text-[var(--admin-burgundy)]">
                <Sparkles size={18} />
                <span>Google OAuth will open and return you here automatically.</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-[1.35rem] bg-[var(--admin-burgundy)] py-4 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[0_20px_40px_rgba(90,26,42,0.18)] transition-all hover:bg-[var(--admin-burgundy-deep)] hover:shadow-[0_24px_46px_rgba(90,26,42,0.24)] disabled:opacity-70"
              style={{
                backgroundColor: 'var(--admin-burgundy)',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Continue with Google
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 text-center">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--admin-muted)]">
              Official Admin Entrance
            </p>
            <div className="flex items-center justify-center gap-8 opacity-70">
              <div className="flex items-center gap-1 text-[var(--admin-burgundy)]">
                <Box size={16} />
                <span className="text-xs font-bold uppercase tracking-tighter">Inventory</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--admin-burgundy)]">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase tracking-tighter">Security</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--admin-burgundy)]">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-tighter">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StankingsAdminLoginPage;
