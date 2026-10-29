"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ReadingAnalyticsSummary,
  ArticleReadingPerformance,
  ReadingFunnelStage,
} from "@/lib/reading-analytics-types";
import { getArticles } from "@/lib/data";

function formatDuration(seconds: number): string {
  const safeSec = Math.max(0, Math.round(seconds));
  if (safeSec < 60) return `${safeSec} detik`;
  const mins = Math.floor(safeSec / 60);
  const remSec = safeSec % 60;
  return remSec > 0 ? `${mins}m ${remSec}s` : `${mins} menit`;
}

export async function getReadingAnalyticsSummary(
  timeRange: "7d" | "30d" | "all" = "30d"
): Promise<ReadingAnalyticsSummary> {
  const articles = await getArticles();

  try {
    const supabase = createAdminClient();

    // Query ke tabel nyata Supabase
    let query = supabase.from("article_reading_sessions").select("*");

    if (timeRange === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      query = query.gte("created_at", d.toISOString());
    } else if (timeRange === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      query = query.gte("created_at", d.toISOString());
    }

    const { data: sessions, error } = await query;

    // Jika terjadi error query (misal tabel belum dibuat) atau data masih 0 baris:
    // Kembalikan Empty State murni (0 sesi) tanpa data palsu/fiktif!
    if (error || !sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        averageCompletionRate: 0,
        averageActualDurationSeconds: 0,
        averageActualDurationFormatted: "0 detik",
        averageEstimatedMinutes: 0,
        readingPaceRatio: 0,
        topDropoffPoint: {
          milestone: 0,
          label: "Belum Ada Data Sesi",
          dropPercentage: 0,
          description:
            "Belum ada sesi membaca yang tercatat pada rentang waktu ini. Data akan otomatis terakumulasi saat pembaca publik membuka dan menggulir artikel.",
        },
        globalFunnel: [
          { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: 0, percentage: 0, dropoffRate: 0 },
        ],
        articles: articles.map((art) => ({
          articleId: art.id,
          title: art.title,
          slug: art.slug,
          categoryName: art.category_name || "Umum",
          authorName: art.author_name || "Redaksi",
          authorAvatar: art.author_avatar || null,
          estimatedTimeMinutes: art.reading_time || 3,
          actualDurationSeconds: 0,
          actualDurationFormatted: "0s",
          totalSessions: 0,
          completionRate: 0,
          completedSessions: 0,
          topDropoffMilestone: 0,
          dropoffLabel: "Belum ada pembaca",
          funnel: [
            { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: 0, percentage: 0, dropoffRate: 0 },
          ],
          status: "good",
        })),
        timeRange,
        isLive: true,
      };
    }

    // HITUNG AGREGASI NYATA DARI SUPABASE DATABASE
    const sessionMap = new Map<string, any[]>();
    for (const s of sessions) {
      if (!sessionMap.has(s.article_id)) {
        sessionMap.set(s.article_id, []);
      }
      sessionMap.get(s.article_id)!.push(s);
    }

    const performances: ArticleReadingPerformance[] = articles.map((art) => {
      const artSessions = sessionMap.get(art.id) || [];
      const count0 = artSessions.length;

      if (count0 === 0) {
        return {
          articleId: art.id,
          title: art.title,
          slug: art.slug,
          categoryName: art.category_name || "Umum",
          authorName: art.author_name || "Redaksi",
          authorAvatar: art.author_avatar || null,
          estimatedTimeMinutes: art.reading_time || 3,
          actualDurationSeconds: 0,
          actualDurationFormatted: "0s",
          totalSessions: 0,
          completionRate: 0,
          completedSessions: 0,
          topDropoffMilestone: 0,
          dropoffLabel: "Belum ada pembaca",
          funnel: [
            { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: 0, percentage: 0, dropoffRate: 0 },
            { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: 0, percentage: 0, dropoffRate: 0 },
          ],
          status: "good",
        };
      }

      const count25 = artSessions.filter((s) => s.scroll_depth >= 25).length;
      const count50 = artSessions.filter((s) => s.scroll_depth >= 50).length;
      const count75 = artSessions.filter((s) => s.scroll_depth >= 75).length;
      const count100 = artSessions.filter((s) => s.is_completed || s.scroll_depth >= 90).length;

      const drop25 = Math.max(0, Math.round(((count0 - count25) / count0) * 100));
      const drop50 = count25 > 0 ? Math.max(0, Math.round(((count25 - count50) / count25) * 100)) : 0;
      const drop75 = count50 > 0 ? Math.max(0, Math.round(((count50 - count75) / count50) * 100)) : 0;
      const drop100 = count75 > 0 ? Math.max(0, Math.round(((count75 - count100) / count75) * 100)) : 0;

      const completionRate = Math.round((count100 / count0) * 100);

      const totalSec = artSessions.reduce((acc, s) => acc + (s.reading_duration_seconds || 0), 0);
      const avgSec = Math.round(totalSec / count0);

      // Cari titik putus terbesar secara dinamis
      const drops = [
        { milestone: 25, drop: drop25, label: "Drop di Pengantar (25%)" },
        { milestone: 50, drop: drop50, label: "Drop di Paragraf Inti (50%)" },
        { milestone: 75, drop: drop75, label: "Drop di Analisis Mendalam (75%)" },
        { milestone: 100, drop: drop100, label: "Drop Sebelum Kesimpulan" },
      ];
      drops.sort((a, b) => b.drop - a.drop);
      const topDrop = drops[0].drop > 0 ? drops[0] : { milestone: 100, drop: 0, label: "100% Pembaca Tuntas" };

      let status: ArticleReadingPerformance["status"] = "good";
      if (completionRate >= 60) status = "excellent";
      else if (completionRate < 40) status = "needs_attention";

      return {
        articleId: art.id,
        title: art.title,
        slug: art.slug,
        categoryName: art.category_name || "Umum",
        authorName: art.author_name || "Redaksi",
        authorAvatar: art.author_avatar || null,
        estimatedTimeMinutes: art.reading_time || 3,
        actualDurationSeconds: avgSec,
        actualDurationFormatted: formatDuration(avgSec),
        totalSessions: count0,
        completionRate,
        completedSessions: count100,
        topDropoffMilestone: topDrop.milestone,
        dropoffLabel: topDrop.label,
        funnel: [
          { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: count0, percentage: 100, dropoffRate: 0 },
          { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: count25, percentage: Math.round((count25 / count0) * 100), dropoffRate: drop25 },
          { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: count50, percentage: Math.round((count50 / count0) * 100), dropoffRate: drop50 },
          { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: count75, percentage: Math.round((count75 / count0) * 100), dropoffRate: drop75 },
          { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: count100, percentage: Math.round((count100 / count0) * 100), dropoffRate: drop100 },
        ],
        status,
      };
    });

    // Urutkan artikel: artikel yang memiliki sesi membaca ditaruh paling atas
    performances.sort((a, b) => b.totalSessions - a.totalSessions);

    // Global aggregations nyata
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.is_completed || s.scroll_depth >= 90).length;
    const avgCompletion = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    const totalDuration = sessions.reduce((acc, s) => acc + (s.reading_duration_seconds || 0), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    const totalEstMinutes = performances.reduce((acc, p) => acc + (p.estimatedTimeMinutes * p.totalSessions), 0);
    const avgEstMinutes = totalSessions > 0 ? Number((totalEstMinutes / totalSessions).toFixed(1)) : 3;
    const readingPaceRatio = Number((avgDuration / Math.max(1, avgEstMinutes * 60)).toFixed(2));

    const gCount25 = sessions.filter((s) => s.scroll_depth >= 25).length;
    const gCount50 = sessions.filter((s) => s.scroll_depth >= 50).length;
    const gCount75 = sessions.filter((s) => s.scroll_depth >= 75).length;

    const gDrop25 = Math.round(((totalSessions - gCount25) / totalSessions) * 100);
    const gDrop50 = gCount25 > 0 ? Math.round(((gCount25 - gCount50) / gCount25) * 100) : 0;
    const gDrop75 = gCount50 > 0 ? Math.round(((gCount50 - gCount75) / gCount50) * 100) : 0;
    const gDrop100 = gCount75 > 0 ? Math.round(((gCount75 - completedSessions) / gCount75) * 100) : 0;

    // Evaluasi titik putus global secara dinamis
    const globalDrops = [
      { milestone: 25, label: "Pengantar (25%)", drop: gDrop25, desc: "Penurunan pembaca di paragraf pembuka. Evaluasi ketertarikan judul dan hook pembuka." },
      { milestone: 50, label: "Paragraf Inti (50%)", drop: gDrop50, desc: "Penurunan di pertengahan esai. Pertimbangkan pemecahan dinding paragraf dengan subjudul atau kutipan." },
      { milestone: 75, label: "Analisis Mendalam (75%)", drop: gDrop75, desc: "Penurunan menjelang akhir. Buat pembahasan lebih ringkas dan berorientasi aksi." },
      { milestone: 100, label: "Sebelum Kesimpulan", drop: gDrop100, desc: "Pembaca berhenti sebelum kesimpulan. Buat penutup yang lebih memikat." },
    ];
    globalDrops.sort((a, b) => b.drop - a.drop);
    const topGlobalDrop = globalDrops[0].drop > 0
      ? {
          milestone: globalDrops[0].milestone,
          label: globalDrops[0].label,
          dropPercentage: globalDrops[0].drop,
          description: globalDrops[0].desc,
        }
      : {
          milestone: 100,
          label: "Retensi Sangat Tinggi",
          dropPercentage: 0,
          description: "Seluruh pembaca pada sesi ini membaca artikel hingga tuntas tanpa titik lepas baca yang signifikan.",
        };

    const globalFunnel: ReadingFunnelStage[] = [
      { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: totalSessions, percentage: 100, dropoffRate: 0 },
      { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: gCount25, percentage: Math.round((gCount25 / totalSessions) * 100), dropoffRate: gDrop25 },
      { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: gCount50, percentage: Math.round((gCount50 / totalSessions) * 100), dropoffRate: gDrop50 },
      { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: gCount75, percentage: Math.round((gCount75 / totalSessions) * 100), dropoffRate: gDrop75 },
      { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: completedSessions, percentage: Math.round((completedSessions / totalSessions) * 100), dropoffRate: gDrop100 },
    ];

    return {
      totalSessions,
      completedSessions,
      averageCompletionRate: avgCompletion,
      averageActualDurationSeconds: avgDuration,
      averageActualDurationFormatted: formatDuration(avgDuration),
      averageEstimatedMinutes: avgEstMinutes,
      readingPaceRatio,
      topDropoffPoint: topGlobalDrop,
      globalFunnel,
      articles: performances,
      timeRange,
      isLive: true,
    };
  } catch (err) {
    console.warn("[Reading Analytics Action] DB fetch error:", err);
    return {
      totalSessions: 0,
      completedSessions: 0,
      averageCompletionRate: 0,
      averageActualDurationSeconds: 0,
      averageActualDurationFormatted: "0 detik",
      averageEstimatedMinutes: 0,
      readingPaceRatio: 0,
      topDropoffPoint: {
        milestone: 0,
        label: "Belum Ada Data",
        dropPercentage: 0,
        description: "Gagal terhubung ke database atau belum ada sesi.",
      },
      globalFunnel: [
        { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: 0, percentage: 0, dropoffRate: 0 },
        { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: 0, percentage: 0, dropoffRate: 0 },
        { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: 0, percentage: 0, dropoffRate: 0 },
        { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: 0, percentage: 0, dropoffRate: 0 },
        { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: 0, percentage: 0, dropoffRate: 0 },
      ],
      articles: articles.map((art) => ({
        articleId: art.id,
        title: art.title,
        slug: art.slug,
        categoryName: art.category_name || "Umum",
        authorName: art.author_name || "Redaksi",
        authorAvatar: art.author_avatar || null,
        estimatedTimeMinutes: art.reading_time || 3,
        actualDurationSeconds: 0,
        actualDurationFormatted: "0s",
        totalSessions: 0,
        completionRate: 0,
        completedSessions: 0,
        topDropoffMilestone: 0,
        dropoffLabel: "Belum ada pembaca",
        funnel: [
          { milestone: 0, label: "Mulai Baca", description: "Pengunjung membuka artikel", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 25, label: "Pengantar (25%)", description: "Melewati judul & pendahuluan", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 50, label: "Isi Inti (50%)", description: "Membaca gagasan utama", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 75, label: "Pendalaman (75%)", description: "Membaca contoh & data pendukung", count: 0, percentage: 0, dropoffRate: 0 },
          { milestone: 100, label: "Selesai Tuntas (100%)", description: "Mencapai kesimpulan akhir", count: 0, percentage: 0, dropoffRate: 0 },
        ],
        status: "good",
      })),
      timeRange,
      isLive: false,
    };
  }
}

export async function clearAllReadingSessionsAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("article_reading_sessions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/analitik-bacaan");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengosongkan data." };
  }
}
