import { createClient } from "@/lib/supabase/server";
import { AdminTantanganClient } from "./tantangan-client";
import { dummyChallenges, Challenge } from "@/lib/dummy-data";

export default async function AdminTantanganPage() {
  let challenges: Challenge[] = dummyChallenges;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("challenges")
      .select("*, challenge_days(*), challenge_participations(id)")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      challenges = data.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description || "",
        duration_days: c.duration_days,
        cover_url: c.cover_url || "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
        status: c.status || "published",
        participants_count: Array.isArray(c.challenge_participations) ? c.challenge_participations.length : 0,
        days: Array.isArray(c.challenge_days)
          ? c.challenge_days
              .sort((a: any, b: any) => a.day_number - b.day_number)
              .map((d: any) => ({
                id: d.id,
                challenge_id: d.challenge_id,
                day_number: d.day_number,
                task_title: d.task_title,
                task_description: d.task_description,
              }))
          : [],
      }));
    }
  } catch {
    challenges = dummyChallenges;
  }

  return <AdminTantanganClient initialChallenges={challenges} />;
}
