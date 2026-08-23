import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

// If env vars aren't set yet, `supabase` is null and the app falls back to
// local-only (localStorage) storage — see lib/store.js.
export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
