import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: fetch
    }
  });
}

export function getSupabaseStatus() {
  return {
    supabaseUrlLoaded: !!process.env.SUPABASE_URL,
    supabaseKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}
