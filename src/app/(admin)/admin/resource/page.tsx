import { createClient } from "@/lib/supabase/server";
import { AdminResourceClient } from "./resource-client";
import { dummyResources, Resource } from "@/lib/dummy-data";

export default async function AdminResourcePage() {
  let resources: Resource[] = dummyResources;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      resources = data.map((r: any) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        description: r.description || "",
        type: r.type,
        age_category: r.age_category || "semua",
        publisher: r.publisher || "Rumah Literasi",
        cover_url: r.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
        download_count: r.download_count || 0,
        status: r.status || "published",
        external_url: r.external_url || undefined,
        file_path: r.file_path || undefined,
      }));
    }
  } catch {
    resources = dummyResources;
  }

  return <AdminResourceClient initialResources={resources} />;
}
