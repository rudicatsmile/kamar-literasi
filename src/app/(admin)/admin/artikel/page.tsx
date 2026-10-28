import { createClient } from "@/lib/supabase/server";
import { AdminArtikelListClient } from "./artikel-list-client";
import { dummyArticles, Article } from "@/lib/dummy-data";

export default async function AdminArtikelPage() {
  let articles: Article[] = dummyArticles;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(full_name)")
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
        author_name: item.profiles?.full_name || "Admin Redaksi",
        author_role: "Penulis Redaksi",
        author_avatar: dummyArticles[0].author_avatar,
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
