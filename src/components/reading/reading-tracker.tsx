"use client";

import * as React from "react";
import { ReadingBeaconPayload } from "@/lib/reading-analytics-types";

interface ReadingTrackerProps {
  articleId: string;
  estimatedTimeMinutes?: number;
}

export function ReadingTracker({
  articleId,
  estimatedTimeMinutes = 3,
}: ReadingTrackerProps) {
  const [scrollPercentage, setScrollPercentage] = React.useState(0);
  const sessionIdRef = React.useRef<string>("");
  const durationSecondsRef = React.useRef<number>(0);
  const maxScrollDepthRef = React.useRef<number>(0);
  const isCompletedRef = React.useRef<boolean>(false);
  const lastInteractionTimeRef = React.useRef<number>(Date.now());
  const hasSentCompletionRef = React.useRef<boolean>(false);
  const lastSentPayloadRef = React.useRef<string>("");

  // Inisialisasi sessionId di browser
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = `rl_read_sess_${articleId}`;
      let sid = window.sessionStorage.getItem(storageKey);
      if (!sid) {
        sid =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        window.sessionStorage.setItem(storageKey, sid);
      }
      sessionIdRef.current = sid;
    } catch {
      sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  }, [articleId]);

  // Fungsi pengiriman beacon analitik
  const sendBeacon = React.useCallback(
    (force: boolean = false) => {
      if (typeof window === "undefined" || !sessionIdRef.current) return;

      const payload: ReadingBeaconPayload = {
        articleId,
        sessionId: sessionIdRef.current,
        scrollDepth: maxScrollDepthRef.current,
        durationSeconds: durationSecondsRef.current,
        isCompleted: isCompletedRef.current,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      };

      const payloadStr = JSON.stringify(payload);
      if (!force && payloadStr === lastSentPayloadRef.current) {
        return; // Tidak ada perubahan, lewati
      }
      lastSentPayloadRef.current = payloadStr;

      const endpoint = "/api/analytics/reading";

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          const blob = new Blob([payloadStr], { type: "application/json" });
          const sent = navigator.sendBeacon(endpoint, blob);
          if (sent) return;
        } catch {
          // Fallback ke fetch keepalive
        }
      }

      try {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadStr,
          keepalive: true,
        }).catch(() => {
          // Abaikan error jaringan saat page unloading
        });
      } catch {
        // Abaikan
      }
    },
    [articleId]
  );

  // 1. Timer Waktu Baca Aktif (mengabaikan saat tab tidak fokus atau idle > 60 detik)
  React.useEffect(() => {
    const handleUserActivity = () => {
      lastInteractionTimeRef.current = Date.now();
    };

    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });

    const interval = setInterval(() => {
      // Periksa apakah tab sedang aktif
      if (document.visibilityState !== "visible") return;

      // Periksa idle: jika tidak ada interaksi selama 60 detik, jangan hitung durasi
      const idleTimeMs = Date.now() - lastInteractionTimeRef.current;
      if (idleTimeMs > 60000) return;

      durationSecondsRef.current += 1;

      // Evaluasi apakah artikel dapat dinyatakan selesai
      // Syarat: sudah mencapai 90% scroll dan waktu baca minimal 25 detik atau 20% estimasi
      const minReadSeconds = Math.max(20, Math.floor((estimatedTimeMinutes * 60) * 0.2));
      if (
        maxScrollDepthRef.current >= 90 &&
        durationSecondsRef.current >= minReadSeconds &&
        !isCompletedRef.current
      ) {
        isCompletedRef.current = true;
        if (!hasSentCompletionRef.current) {
          hasSentCompletionRef.current = true;
          sendBeacon(true);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [estimatedTimeMinutes, sendBeacon]);

  // 2. Pendeteksi Kedalaman Scroll (Milestones: 25%, 50%, 75%, 100%)
  React.useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - windowHeight;

      if (totalScrollable <= 0) return;

      const rawPercent = Math.min(100, Math.max(0, (scrollY / totalScrollable) * 100));
      setScrollPercentage(Math.round(rawPercent));

      // Milestone mapping
      let milestone = 0;
      if (rawPercent >= 90) {
        milestone = 100;
      } else if (rawPercent >= 70) {
        milestone = 75;
      } else if (rawPercent >= 45) {
        milestone = 50;
      } else if (rawPercent >= 20) {
        milestone = 25;
      }

      if (milestone > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = milestone;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 3. Heartbeat berkala & Pengiriman saat user keluar
  React.useEffect(() => {
    // Heartbeat setiap 30 detik untuk memperbarui progres
    const heartbeat = setInterval(() => {
      if (durationSecondsRef.current > 0) {
        sendBeacon(false);
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendBeacon(true);
      }
    };

    const handlePageHide = () => {
      sendBeacon(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      clearInterval(heartbeat);
      sendBeacon(true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [sendBeacon]);

  return (
    <>
      {/* Visual Top Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>
    </>
  );
}
