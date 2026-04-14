import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const ADMIN_TOKEN_KEY = 'stankings_admin_token';
const approvedAdminEmails = new Set(
  (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean),
);

interface AdminAuthState {
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string;
}

interface UseAdminAuth extends AdminAuthState {
  user: User | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

function storeToken(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      return;
    }

    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // sessionStorage can be unavailable in some browsers/privacy modes
  }
}

function hasAdminAccess(user: User | null): boolean {
  if (!user) {
    return false;
  }

  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;
  const email = user.email?.trim().toLowerCase() || '';

  return (
    appRole === 'admin' ||
    userRole === 'admin' ||
    approvedAdminEmails.has(email)
  );
}

export function useAdminAuth(): UseAdminAuth {
  const [state, setState] = useState<AdminAuthState>({
    session: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    error: '',
  });

  const syncSession = useCallback((session: Session | null, error = '') => {
    storeToken(session?.access_token ?? null);
    setState((prev) => ({
      ...prev,
      session,
      isAuthenticated: Boolean(session?.access_token),
      isAdmin: hasAdminAccess(session?.user ?? null),
      isLoading: false,
      error,
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: Session | null) => {
      if (!isMounted) {
        return;
      }

      if (session?.user && !hasAdminAccess(session.user)) {
        await supabase.auth.signOut();

        if (!isMounted) {
          return;
        }

        syncSession(null, 'This Google account does not have admin access.');
        return;
      }

      syncSession(session);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      void handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  const login = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: '' }));

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        session: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to start Google sign-in right now.',
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: '' }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      syncSession(null);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAdmin: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sign out of the admin session.',
      }));
    }
  }, [syncSession]);

  return {
    ...state,
    user: state.session?.user ?? null,
    accessToken: state.session?.access_token ?? null,
    login,
    logout,
  };
}
