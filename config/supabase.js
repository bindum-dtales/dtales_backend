import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn("Supabase environment variables missing.");
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key);
  }

  return cachedClient;
}
