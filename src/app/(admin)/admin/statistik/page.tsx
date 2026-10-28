import { createClient } from "@/lib/supabase/server";
import { AdminStatistikClient } from "./statistik-client";
import { dummyStatistics, StatisticItem } from "@/lib/dummy-data";

export default async function AdminStatistikPage() {
  let statistics: StatisticItem[] = dummyStatistics;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      statistics = data.map((s: any) => ({
        id: s.id,
        label: s.label,
        type: s.type,
        value: s.value || undefined,
        description: s.description || undefined,
        source_name: s.source_name,
        source_url: s.source_url || undefined,
        year: s.year || 2025,
        sort_order: s.sort_order || 1,
        is_active: s.is_active ?? true,
      }));
    }
  } catch {
    statistics = dummyStatistics;
  }

  return <AdminStatistikClient initialStatistics={statistics} />;
}
