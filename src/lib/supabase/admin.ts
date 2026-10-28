import { createClient } from "@supabase/supabase-js";

// Ensure this module is never imported on client side
if (typeof window !== "undefined") {
  throw new Error("Supabase admin client cannot be instantiated in client-side code.");
}

export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-role-key";

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
