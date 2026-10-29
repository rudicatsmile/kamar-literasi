import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReadingBeaconPayload } from "@/lib/reading-analytics-types";

export async function POST(req: NextRequest) {
  try {
    let body: Partial<ReadingBeaconPayload>;

    // Handle both JSON text and text/plain (sendBeacon sends text/plain or blob)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    }

    const {
      articleId,
      sessionId,
      scrollDepth = 0,
      durationSeconds = 0,
      isCompleted = false,
      referrer,
    } = body;

    // Basic payload validation
    if (!articleId || !sessionId) {
      return NextResponse.json(
        { error: "Parameter articleId dan sessionId wajib disertakan." },
        { status: 400 }
      );
    }

    const cleanScroll = Math.max(0, Math.min(100, Math.round(Number(scrollDepth) || 0)));
    const cleanDuration = Math.max(0, Math.min(86400, Math.round(Number(durationSeconds) || 0)));
    const cleanCompleted = Boolean(isCompleted);

    // Kirim / Upsert ke Supabase
    try {
      const supabase = createAdminClient();
      const userAgent = req.headers.get("user-agent") || null;

      const { error } = await supabase.from("article_reading_sessions").upsert(
        {
          article_id: articleId,
          session_id: sessionId,
          scroll_depth: cleanScroll,
          reading_duration_seconds: cleanDuration,
          is_completed: cleanCompleted,
          referrer: referrer ? String(referrer).slice(0, 500) : null,
          user_agent: userAgent ? String(userAgent).slice(0, 500) : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "article_id,session_id",
        }
      );

      if (error) {
        // Jika tabel belum terpasang di Supabase, jangan gagalkan client, cukup catat log
        console.warn("[Reading Analytics] Supabase upsert error:", error.message);
        return NextResponse.json({
          success: true,
          notice: "Data diterima namun tabel belum aktif di database.",
        });
      }

      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn("[Reading Analytics] DB connection exception:", dbErr?.message || dbErr);
      return NextResponse.json({ success: true, mode: "fallback" });
    }
  } catch (err: any) {
    console.error("[Reading Analytics] Error parsing beacon request:", err);
    return NextResponse.json(
      { error: "Format request tidak valid." },
      { status: 400 }
    );
  }
}

