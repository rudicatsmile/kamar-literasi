import { createClient } from "@/lib/supabase/server";
import {
  dummyArticles,
  dummyCategories,
  dummyResources,
  dummyStatistics,
  dummyTips,
  dummyChallenges,
  dummyUserProfile,
  dummyUserProgress,
  dummyStaticPages,
  dummySubscribers,
  dummyContactMessages,
  Article,
  Category,
  Resource,
  StatisticItem,
  Tip,
  Challenge,
  UserChallengeProgress,
} from "@/lib/dummy-data";

function isSupabaseLive(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("supabase.co") && !url.includes("dummy-project");
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseLive()) return dummyCategories;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) return dummyCategories;
    return data;
  } catch {
    return dummyCategories;
  }
}

export async function getArticles(categorySlug?: string, query?: string): Promise<Article[]> {
  if (!isSupabaseLive()) {
    return dummyArticles.filter((a) => {
      const matchCat = !categorySlug || categorySlug === "all" || a.category_slug === categorySlug;
      const matchQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }

  try {
    const supabase = await createClient();
    let q = supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(full_name, avatar_url)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (query) {
      q = q.ilike("title", `%${query}%`);
    }

    const { data, error } = await q;
    if (error || !data || data.length === 0) return dummyArticles;

    return data
      .map((item: any) => ({
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
        author_avatar:
          item.profiles?.avatar_url || dummyArticles[0].author_avatar,
        status: item.status,
        reading_time: item.reading_time || 3,
        published_at: item.published_at || item.created_at,
        created_at: item.created_at,
      }))
      .filter((a: Article) => {
        if (!categorySlug || categorySlug === "all") return true;
        return a.category_slug === categorySlug;
      });
  } catch {
    return dummyArticles;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const foundDummy = dummyArticles.find((a) => a.slug === slug);
  if (!isSupabaseLive()) return foundDummy || null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(full_name, avatar_url)")
      .eq("slug", slug)
      .single();

    if (error || !data) return foundDummy || null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || "",
      content: data.content,
      cover_url: data.cover_url || dummyArticles[0].cover_url,
      category_id: data.category_id,
      category_name: data.categories?.name || "Umum",
      category_slug: data.categories?.slug || "umum",
      author_name: data.profiles?.full_name || "Admin Redaksi",
      author_role: "Penulis Redaksi",
      author_avatar:
        data.profiles?.avatar_url || dummyArticles[0].author_avatar,
      status: data.status,
      reading_time: data.reading_time || 3,
      published_at: data.published_at || data.created_at,
      created_at: data.created_at,
    };
  } catch {
    return foundDummy || null;
  }
}

export async function getResources(): Promise<Resource[]> {
  if (!isSupabaseLive()) return dummyResources;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return dummyResources;
    return data;
  } catch {
    return dummyResources;
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const foundDummy = dummyResources.find((r) => r.slug === slug);
  if (!isSupabaseLive()) return foundDummy || null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return foundDummy || null;
    return data;
  } catch {
    return foundDummy || null;
  }
}

export async function getStatistics(): Promise<StatisticItem[]> {
  if (!isSupabaseLive()) return dummyStatistics;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return dummyStatistics;
    return data;
  } catch {
    return dummyStatistics;
  }
}

export async function getTips(): Promise<Tip[]> {
  if (!isSupabaseLive()) return dummyTips;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return dummyTips;
    return data;
  } catch {
    return dummyTips;
  }
}

export async function getChallenges(): Promise<Challenge[]> {
  if (!isSupabaseLive()) return dummyChallenges;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("challenges")
      .select("*, challenge_days(*)")
      .eq("status", "published")
      .order("duration_days", { ascending: true });

    if (error || !data || data.length === 0) return dummyChallenges;
    return data.map((ch: any) => ({
      ...ch,
      days: (ch.challenge_days || []).sort(
        (a: any, b: any) => a.day_number - b.day_number
      ),
    }));
  } catch {
    return dummyChallenges;
  }
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  const foundDummy = dummyChallenges.find((c) => c.slug === slug || c.id === slug);
  if (!isSupabaseLive()) return foundDummy || null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("challenges")
      .select("*, challenge_days(*)")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error || !data) return foundDummy || null;
    return {
      ...data,
      days: (data.challenge_days || []).sort(
        (a: any, b: any) => a.day_number - b.day_number
      ),
    };
  } catch {
    return foundDummy || null;
  }
}

export async function getUserParticipationForChallenge(
  challengeId: string
): Promise<UserChallengeProgress | null> {
  if (!isSupabaseLive()) return dummyUserProgress;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return dummyUserProgress;

    const { data: part, error } = await supabase
      .from("challenge_participations")
      .select("*, challenges(*)")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .maybeSingle();

    if (error || !part) return null;

    const { data: checkins } = await supabase
      .from("challenge_checkins")
      .select("*")
      .eq("participation_id", part.id)
      .order("day_number", { ascending: true });

    return {
      id: part.id,
      challenge_id: part.challenge_id,
      challenge_title: part.challenges?.title || "Tantangan Literasi",
      duration_days: part.challenges?.duration_days || 7,
      status: part.status,
      current_streak: part.current_streak || 0,
      completed_days: (checkins || []).map((c) => c.day_number),
      checkins: (checkins || []).map((c) => ({
        day_number: c.day_number,
        date: c.checkin_date,
        reflection: c.reflection || "",
      })),
      started_at: part.started_at,
    };
  } catch {
    return dummyUserProgress;
  }
}

export async function getStaticPage(slug: string) {
  if (!isSupabaseLive()) {
    if (slug === "tentang") return dummyStaticPages.tentang;
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("static_pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      if (slug === "tentang") return dummyStaticPages.tentang;
      return null;
    }

    if (slug === "tentang") {
      return {
        ...dummyStaticPages.tentang,
        title: data.title || dummyStaticPages.tentang.title,
        story: data.content || dummyStaticPages.tentang.story,
      };
    }

    return data;
  } catch {
    if (slug === "tentang") return dummyStaticPages.tentang;
    return null;
  }
}

// ==============================================================================
// MEMBER DATA ACCESS HELPERS
// ==============================================================================

export async function getCurrentUserProfile() {
  if (!isSupabaseLive()) return dummyUserProfile;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return dummyUserProfile;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Query active streak
    const { data: participations } = await supabase
      .from("challenge_participations")
      .select("current_streak")
      .eq("user_id", user.id)
      .eq("status", "active");

    const maxStreak =
      participations && participations.length > 0
        ? Math.max(...participations.map((p) => p.current_streak || 0))
        : 0;

    // Query favorite resource ids
    const { data: favs } = await supabase
      .from("resource_favorites")
      .select("resource_id")
      .eq("user_id", user.id);

    return {
      id: user.id,
      email: user.email || dummyUserProfile.email,
      full_name:
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Anggota Literasi",
      whatsapp: profile?.whatsapp || "",
      avatar_url:
        profile?.avatar_url ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      role: profile?.role || "member",
      reminder_enabled: profile?.reminder_enabled ?? false,
      streak: maxStreak,
      favorite_resource_ids: favs ? favs.map((f) => f.resource_id) : [],
    };
  } catch {
    return dummyUserProfile;
  }
}

export async function getUserActiveChallengeProgress(): Promise<UserChallengeProgress | null> {
  if (!isSupabaseLive()) return dummyUserProgress;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return dummyUserProgress;

    // Find first active participation
    const { data: part, error } = await supabase
      .from("challenge_participations")
      .select("*, challenges(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !part) {
      return null;
    }

    // Get checkins
    const { data: checkins } = await supabase
      .from("challenge_checkins")
      .select("*")
      .eq("participation_id", part.id)
      .order("day_number", { ascending: true });

    const completedDays = checkins ? checkins.map((c) => c.day_number) : [];

    return {
      id: part.id,
      challenge_id: part.challenge_id,
      challenge_title: part.challenges?.title || "Tantangan Literasi",
      duration_days: part.challenges?.duration_days || 7,
      status: part.status,
      current_streak: part.current_streak || 0,
      completed_days: completedDays,
      checkins:
        checkins?.map((c) => ({
          day_number: c.day_number,
          date: c.checkin_date,
          reflection: c.reflection || "",
        })) || [],
      started_at: part.started_at,
    };
  } catch {
    return dummyUserProgress;
  }
}

export async function getUserAllParticipations() {
  if (!isSupabaseLive()) return [dummyUserProgress];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [dummyUserProgress];

    const { data: parts, error } = await supabase
      .from("challenge_participations")
      .select("*, challenges(*), challenge_checkins(*)")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false });

    if (error || !parts || parts.length === 0) return [];

    return parts.map((part: any) => ({
      id: part.id,
      challenge_id: part.challenge_id,
      challenge_title: part.challenges?.title || "Tantangan Literasi",
      duration_days: part.challenges?.duration_days || 7,
      status: part.status,
      current_streak: part.current_streak || 0,
      completed_days: (part.challenge_checkins || []).map((c: any) => c.day_number),
      checkins: (part.challenge_checkins || []).map((c: any) => ({
        day_number: c.day_number,
        date: c.checkin_date,
        reflection: c.reflection || "",
      })),
      started_at: part.started_at,
    }));
  } catch {
    return [dummyUserProgress];
  }
}

export async function getUserFavoriteResourcesList(): Promise<Resource[]> {
  if (!isSupabaseLive()) return dummyResources.slice(0, 2);

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return dummyResources.slice(0, 2);

    const { data: favs } = await supabase
      .from("resource_favorites")
      .select("resources(*)")
      .eq("user_id", user.id);

    if (!favs || favs.length === 0) return [];

    return favs.map((f: any) => f.resources).filter(Boolean);
  } catch {
    return dummyResources.slice(0, 2);
  }
}

// ==============================================================================
// ADMIN METRICS HELPER
// ==============================================================================

export async function getAdminMetricsData() {
  if (!isSupabaseLive()) {
    return {
      totalArticles: dummyArticles.length,
      publishedArticles: dummyArticles.filter((a) => a.status === "published").length,
      activeSubscribers: dummySubscribers.filter((s) => s.status === "active").length,
      totalSubscribers: dummySubscribers.length,
      unreadMessages: dummyContactMessages.filter((m) => !m.is_read).length,
      totalParticipants: dummyChallenges.reduce((acc, c) => acc + c.participants_count, 0),
      recentArticles: dummyArticles.slice(0, 4),
      recentSubscribers: dummySubscribers.slice(0, 4),
    };
  }

  try {
    const supabase = await createClient();

    const [
      { count: totalArticles },
      { count: publishedArticles },
      { count: activeSubscribers },
      { count: totalSubscribers },
      { count: unreadMessages },
      { data: recentArticles },
      { data: recentSubscribers },
    ] = await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      supabase
        .from("articles")
        .select("id, title, slug, status, reading_time, published_at, created_at, categories(name)")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("subscribers")
        .select("id, whatsapp, name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    return {
      totalArticles: totalArticles || 0,
      publishedArticles: publishedArticles || 0,
      activeSubscribers: activeSubscribers || 0,
      totalSubscribers: totalSubscribers || 0,
      unreadMessages: unreadMessages || 0,
      totalParticipants: (activeSubscribers || 0) + 120,
      recentArticles: (recentArticles || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
        reading_time: a.reading_time || 3,
        category_name: a.categories?.name || "Umum",
        created_at: a.created_at,
      })),
      recentSubscribers: recentSubscribers || [],
    };
  } catch {
    return {
      totalArticles: 0,
      publishedArticles: 0,
      activeSubscribers: 0,
      totalSubscribers: 0,
      unreadMessages: 0,
      totalParticipants: 0,
      recentArticles: [],
      recentSubscribers: [],
    };
  }
}
