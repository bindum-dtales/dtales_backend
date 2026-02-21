import { createClient } from "@supabase/supabase-js";

let supabase = null;

export function getSupabaseClient() {
  if (supabase) {
    return supabase;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Supabase environment variables missing");
    return null; // IMPORTANT: do NOT throw
  }

  supabase = createClient(url, key);
  return supabase;
}
