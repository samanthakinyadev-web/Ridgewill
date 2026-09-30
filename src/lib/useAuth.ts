import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isStaff, signOut as signOutRequest } from './api';
import { supabase } from './supabase';

export interface AuthState {
  session: Session | null;
  loading: boolean;
  staff: boolean;
  signOut: () => Promise<void>;
}

/**
 * Resolves the current session and whether that user is on the staff table.
 *
 * Both checks matter: Supabase Auth accepts any valid credential, but RLS
 * silently returns nothing for non-staff, so a non-staff user would otherwise
 * land on a permanently empty dashboard instead of being told why.
 *
 * Lives outside the component file so Fast Refresh keeps working: a module that
 * exports both components and plain functions only hot-reloads the components.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [staff, setStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const resolve = async (current: Session | null) => {
      if (!active) return;
      setSession(current);
      if (!current) {
        setStaff(false);
        setLoading(false);
        return;
      }
      try {
        const allowed = await isStaff(current.user.id);
        if (!active) return;
        setStaff(allowed);
        if (!allowed) await signOutRequest();
      } catch {
        if (active) setStaff(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setLoading(true);
      resolve(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    staff,
    signOut: async () => {
      await signOutRequest();
      setSession(null);
      setStaff(false);
    },
  };
}
