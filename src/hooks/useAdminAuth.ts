import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { buildAdminRedirectUrl } from '../lib/admin-auth';

const ADMIN_TOKEN_KEY = 'thewworksict_admin_token';

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

interface AdminMeResponse {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
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

async function fetchAdminSession(token: string) {
  const response = await fetch('/api/admin/me', {
    credentials: 'same-origin',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json().catch(() => null)) as AdminMeResponse | null;

  if (!response.ok || !payload?.user) {
    throw new Error(payload?.message || 'This Google account does not have admin access.');
  }

  return payload.user;
}

export function useAdminAuth(): UseAdminAuth {
  const rejectedSessionMessageRef = useRef('');
  const [state, setState] = useState<AdminAuthState>({
    session: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    error: '',
  });

  const syncSession = useCallback((
    session: Session | null,
    isAdmin: boolean,
    error = '',
  ) => {
    storeToken(isAdmin ? session?.access_token ?? null : null);
    setState((prev) => ({
      ...prev,
      session,
      isAuthenticated: Boolean(session?.access_token),
      isAdmin,
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

      if (!session?.access_token) {
        const rejectedMessage = rejectedSessionMessageRef.current;
        rejectedSessionMessageRef.current = '';
        syncSession(null, false, rejectedMessage);
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: '' }));

      try {
        await fetchAdminSession(session.access_token);

        if (!isMounted) {
          return;
        }

        syncSession(session, true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'This Google account does not have admin access.';
        rejectedSessionMessageRef.current = message;
        await supabase.auth.signOut();

        if (!isMounted) {
          return;
        }

        syncSession(null, false, message);
      }
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
          redirectTo: buildAdminRedirectUrl(window.location.origin),
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

      syncSession(null, false);
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
