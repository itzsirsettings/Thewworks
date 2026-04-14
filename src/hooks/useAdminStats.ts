import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from './useAdminAuth';

export interface DashboardStats {
  metrics: {
    gmv: number;
    totalOrders: number;
    conversionRate: number;
    avgOrderSize: number;
  };
  revenueSeries: Array<{ label: string; revenue: number; orders: number }>;
  categoryDemand: Array<{ category: string; demand: number; conversion: number }>;
}

export function useAdminStats() {
  const {
    accessToken,
    isAdmin,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!accessToken) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(
          payload?.message || 'Failed to fetch dashboard statistics.',
        );
      }

      const data = (await response.json()) as DashboardStats;
      setStats(data);
    } catch (err) {
      setStats(null);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthLoading) {
      setIsLoading(true);
      return;
    }

    if (!isAuthenticated || !isAdmin) {
      setStats(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    void fetchStats();
  }, [fetchStats, isAdmin, isAuthenticated, isAuthLoading]);

  return { stats, isLoading, error, refresh: fetchStats };
}
