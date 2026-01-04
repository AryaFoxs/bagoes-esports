import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time to prevent errors
    // This will be replaced with real client at runtime
    return null as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
