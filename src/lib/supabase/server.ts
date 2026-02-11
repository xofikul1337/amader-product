import { createClient } from "@supabase/supabase-js";

const fallbackUrl = "https://fikmoemoatiuvvrdxwcm.supabase.co";
const fallbackAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa21vZW1vYXRpdXZ2cmR4d2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDk0NjAsImV4cCI6MjA4NTc4NTQ2MH0.JMcBAMulTKnGACXM9d6PA5bQ5fvDgmYcDBfYc_rjh0U";

export const createServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackUrl;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? fallbackAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
