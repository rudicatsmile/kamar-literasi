import { createClient } from "@/lib/supabase/server";
import { AdminTipsClient } from "./tips-client";
import { dummyTips, Tip } from "@/lib/dummy-data";

export default async function AdminTipsPage() {
  let tips: Tip[] = dummyTips;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      tips = data.map((t: any) => ({
        id: t.id,
        title: t.title,
        content: t.content,
        icon: t.icon || "BookOpen",
        sort_order: t.sort_order || 1,
        is_active: t.is_active ?? true,
      }));
    }
  } catch {
    tips = dummyTips;
  }

  return <AdminTipsClient initialTips={tips} />;
}
