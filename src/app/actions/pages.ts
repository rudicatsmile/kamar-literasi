"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateStaticPageAction(
  slug: string,
  title: string,
  content: string
) {
  if (!slug || !title || !content) {
    return { success: false, error: "Semua data halaman wajib diisi." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("static_pages")
      .upsert({ slug, title, content, updated_at: new Date().toISOString() }, { onConflict: "slug" });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}
