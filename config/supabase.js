import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("PROCESS ENV DEBUG:");
  console.log("SUPABASE_URL:", supabaseUrl);
  console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!supabaseKey);
  console.log("SUPABASE_BUCKET:", process.env.SUPABASE_BUCKET);

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase environment variables missing");
    return null;
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}
