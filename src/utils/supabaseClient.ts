import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lrvhrdvpaywowecfncxj.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydmhyZHZwYXl3b3dlY2ZuY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MTg2ODYsImV4cCI6MjA0NjI5NDY4Nn0.0afTedHSPuBd62DLmJTnKIohMmStvkk0B_gpW9uD4XU";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key are required!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);