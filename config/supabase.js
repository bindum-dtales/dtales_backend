import { createClient } from "@supabase/supabase-js";

let client = null;

export function getSupabaseClient() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Supabase env missing");
    return null;
  }

  client = createClient(url, key);
  return client;
}
