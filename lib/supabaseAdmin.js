import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminEnabled = Boolean(url && serviceKey);

// Only ever import this from server code (API routes). It bypasses Row Level
// Security using the service role key, which must stay out of the browser bundle.
export const supabaseAdmin = supabaseAdminEnabled
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;
