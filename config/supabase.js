import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("=== ENV DEBUG ===");
  console.log("SUPABASE_URL:", supabaseUrl ? "LOADED" : "MISSING");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "LOADED" : "MISSING");
  console.log("=================");

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export function getSupabaseStatus() {
  return {
    supabaseUrlLoaded: !!process.env.SUPABASE_URL,
    supabaseKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}
