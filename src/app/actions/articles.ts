"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";

const ArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul artikel minimal 3 karakter."),
  slug: z.string().min(3, "Slug URL wajib diisi."),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Isi artikel minimal 10 karakter."),
  cover_url: z.string().optional(),
  category_id: z.string().min(1, "Kategori wajib dipilih."),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function saveArticleAction(data: z.infer<typeof ArticleSchema>) {
  const validation = ArticleSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data artikel tidak valid.",
    };
  }

  const { id, title, slug, excerpt, content: rawContent, cover_url, category_id, status } =
    validation.data;

  // Sanitize rich text HTML
  const content = sanitizeHtml(rawContent);

  // Reading time: 200 words per minute as per PRD Bab 6.B
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const reading_time = Math.max(1, Math.ceil(wordCount / 200));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      // Update
      const { error } = await supabase
        .from("articles")
        .update({
          title,
          slug,
          excerpt,
          content,
          cover_url,
          category_id,
          status,
          reading_time,
          updated_at: new Date().toISOString(),
          ...(status === "published"
            ? { published_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", id);

      if (error) return { success: false, error: error.message };
    } else {
      // Insert
      const { error } = await supabase.from("articles").insert({
        title,
        slug,
        excerpt,
        content,
        cover_url,
        category_id,
        status,
        reading_time,
        published_at:
          status === "published" ? new Date().toISOString() : null,
      });

      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath("/artikel");
  revalidatePath("/admin/artikel");
  return { success: true };
}

export async function deleteArticleAction(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/artikel");
  revalidatePath("/admin/artikel");
  return { success: true };
}
