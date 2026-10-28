import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getArticles } from "@/lib/data";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default async function AdminArtikelEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();

  let article = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (data) {
      article = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        cover_url: data.cover_url,
        category_id: data.category_id,
        category_name: data.categories?.name || "Umum",
        category_slug: data.categories?.slug || "umum",
        author_name: "Admin Redaksi",
        author_role: "Penulis Redaksi",
        author_avatar: "",
        status: data.status,
        reading_time: data.reading_time || 3,
        published_at: data.published_at || data.created_at,
        created_at: data.created_at,
      };
    }
  } catch {
    article = null;
  }

  if (!article) {
    const all = await getArticles();
    article = all.find((a) => a.id === id || a.slug === id) || null;
  }

  if (!article) {
    return notFound();
  }

  return <ArticleForm initialData={article} isEdit={true} categories={categories} />;
}
