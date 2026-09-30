import { createClient } from '@supabase/supabase-js';

/**
 * The public, anon-only Supabase client.
 *
 * Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` may ever reach the
 * browser. The service-role key bypasses Row Level Security entirely and must
 * never be placed in a `VITE_` variable or any bundled code.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * False when the environment variables are absent, e.g. before `supabase init`
 * has been run. UI checks this and shows setup guidance rather than throwing,
 * so a missing env file degrades into a readable message instead of a blank
 * page.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
