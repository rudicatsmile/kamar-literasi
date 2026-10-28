import { createClient } from "@/lib/supabase/server";
import { AdminKategoriClient, CategoryWithCount } from "./kategori-client";
import { dummyCategories } from "@/lib/dummy-data";

export default async function AdminKategoriPage() {
  let categories: CategoryWithCount[] = dummyCategories;

  try {
    const supabase = await createClient();
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("*, articles(id)")
      .order("name", { ascending: true });

    if (!catError && catData && catData.length > 0) {
      categories = catData.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        article_count: Array.isArray(c.articles) ? c.articles.length : 0,
      }));
    }
  } catch {
    categories = dummyCategories.map((c) => ({ ...c, article_count: 0 }));
  }

  return <AdminKategoriClient initialCategories={categories} />;
}
