import { useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from '../BrandLogo';
import ThewworksICTAdminLoginPage from './ThewworksICTAdminLoginPage';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminDashboardPage = () => {
  const { isAdmin, isLoading, user } = useAdminAuth();

  useEffect(() => {
    // If admin is authenticated, redirect to the full Studio Dashboard
    if (isAdmin) {
      const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000/admin';
      
      // Delay slightly for visual confirmation of the handoff
      const timer = setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="admin-thewworksict flex min-h-screen items-center justify-center bg-[var(--admin-surface)]">
        <div className="flex flex-col items-center gap-3">
          <BrandLogo markClassName="h-12 w-[86px]" textTone="brand" showTagline />
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-orange)]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--admin-muted)]">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <ThewworksICTAdminLoginPage />;
  }

  return (
    <div className="admin-thewworksict flex min-h-screen items-center justify-center bg-[var(--admin-surface)] p-6 font-store">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-[var(--admin-stroke)] bg-white p-10 text-center shadow-[0_24px_50px_rgba(90,26,42,0.12)]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--admin-orange)] to-[var(--admin-burgundy)]" />
        
        <BrandLogo className="mb-6 justify-center" markClassName="h-16 w-28" showText={false} />

        <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-ink)]">
          Redirecting to Studio
        </h2>
        
        <p className="mt-4 text-sm leading-relaxed text-[var(--admin-muted)]">
          Signed in as <span className="font-bold text-[var(--admin-ink)]">{user?.email}</span>.
          We are transferring you to the full Thewworks Dashboard.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--admin-orange)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--admin-orange)]">
              Establishing Secure Connection
            </span>
          </div>

          <a 
            href={import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000/admin'}
            className="group flex items-center gap-2 rounded-xl bg-[var(--admin-surface-strong)] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--admin-burgundy)] transition-all hover:bg-[var(--admin-burgundy)] hover:text-white"
          >
            <span>Launch Manually</span>
            <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--admin-stroke)]">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--admin-muted)] opacity-50">
            Thewworks Control Room
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
