import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase env vars missing");
      return null;
    }

    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Supabase client creation failed:", error);
    return null;
  }
}

export function getSupabaseStatus() {
  return {
    supabaseUrlLoaded: !!process.env.SUPABASE_URL,
    supabaseKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    configured: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}
