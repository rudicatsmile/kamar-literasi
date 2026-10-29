import { createAdminClient } from "@/lib/supabase/admin";
import { AdminArtikelListClient } from "./artikel-list-client";
import { dummyArticles, Article } from "@/lib/dummy-data";

export default async function AdminArtikelPage() {
  let articles: Article[] = dummyArticles;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(full_name, avatar_url, role)")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      articles = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || "",
        content: item.content,
        cover_url: item.cover_url || dummyArticles[0].cover_url,
        category_id: item.category_id,
        category_name: item.categories?.name || "Umum",
        category_slug: item.categories?.slug || "umum",
        author_id: item.author_id,
        author_name: item.profiles?.full_name || "Admin Redaksi",
        author_role:
          item.profiles?.role === "admin"
            ? "Redaksi"
            : item.profiles?.role === "member"
            ? "Penulis Tamu"
            : "Penulis Redaksi",
        author_avatar: item.profiles?.avatar_url || null,
        status: item.status,
        reading_time: item.reading_time || 3,
        published_at: item.published_at || item.created_at,
        created_at: item.created_at,
      }));
    }
  } catch {
    articles = dummyArticles;
  }

  return <AdminArtikelListClient initialArticles={articles} />;
}
