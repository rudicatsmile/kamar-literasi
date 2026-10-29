"use client";

import * as React from "react";
import {
  DEFAULT_READING_PREFERENCES,
  READING_STORAGE_KEY,
  sanitizeReadingPreferences,
  type ReadingPreferences,
} from "@/lib/reading-preferences";

interface ReadingModeContextValue {
  prefs: ReadingPreferences;
  /** true saat mode membaca fokus (Zen) sedang aktif */
  zen: boolean;
  /** navbar/footer muncul kembali saat kursor atau sentuhan di tepi atas */
  chromeRevealed: boolean;
  updatePref: <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => void;
  resetPrefs: () => void;
  toggleZen: () => void;
  setZen: (value: boolean) => void;
}

const ReadingModeContext = React.createContext<ReadingModeContextValue | null>(null);

export function useReadingMode() {
  const ctx = React.useContext(ReadingModeContext);
  if (!ctx) {
    throw new Error("useReadingMode harus dipakai di dalam <ReadingModeProvider>");
  }
  return ctx;
}

function readStoredPreferences(): ReadingPreferences {
  try {
    const raw = window.localStorage.getItem(READING_STORAGE_KEY);
    if (raw) return sanitizeReadingPreferences(JSON.parse(raw));
  } catch {
    /* storage tidak tersedia (mode privat) — pakai bawaan */
  }
  return DEFAULT_READING_PREFERENCES;
}

function applyToDocument(prefs: ReadingPreferences) {
  const el = document.documentElement;
  el.dataset.readingTheme = prefs.theme;
  el.dataset.readingFont = prefs.font;
  el.style.setProperty("--rd-font-size", `${prefs.fontSize}px`);
  el.style.setProperty("--rd-line-height", String(prefs.lineHeight));
}

export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  // Nilai awal: bawaan saat SSR, preferensi tersimpan saat di client.
  const [prefs, setPrefs] = React.useState<ReadingPreferences>(() =>
    typeof window === "undefined"
      ? DEFAULT_READING_PREFERENCES
      : readStoredPreferences(),
  );
  const [zen, setZenState] = React.useState(false);
  const [chromeRevealed, setChromeRevealed] = React.useState(false);

  // Sinkronkan preferensi ke <html> + penyimpanan tiap kali berubah.
  React.useEffect(() => {
    applyToDocument(prefs);
    try {
      window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* abaikan bila storage penuh/dinonaktifkan */
    }
  }, [prefs]);

  // Zen mode: atribut pada <html> pengatur visibilitas chrome situs.
  React.useEffect(() => {
    const el = document.documentElement;
    if (zen) {
      el.dataset.zen = "true";
    } else {
      delete el.dataset.zen;
      delete el.dataset.zenReveal;
    }
  }, [zen]);

  // Kembalikan navigasi saat kursor/jari diarahkan ke tepi atas; Esc untuk keluar.
  React.useEffect(() => {
    if (!zen) return;

    let raf = 0;
    const revealChrome = (next: boolean) =>
      setChromeRevealed((prev) => (prev === next ? prev : next));

    const handleMouseMove = (e: MouseEvent) => {
      const nearTop = e.clientY <= 24 || (window.scrollY < 80 && e.clientY <= 96);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => revealChrome(nearTop));
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      revealChrome(touch.clientY <= window.innerHeight * 0.12);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZenState(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zen]);

  React.useEffect(() => {
    const el = document.documentElement;
    if (zen && chromeRevealed) el.dataset.zenReveal = "true";
    else delete el.dataset.zenReveal;
  }, [zen, chromeRevealed]);

  const updatePref = React.useCallback<ReadingModeContextValue["updatePref"]>((key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetPrefs = React.useCallback(() => {
    setPrefs(DEFAULT_READING_PREFERENCES);
  }, []);

  const setZen = React.useCallback((value: boolean) => {
    setZenState(value);
    if (!value) setChromeRevealed(false);
  }, []);

  const toggleZen = React.useCallback(() => setZen(!zen), [setZen, zen]);

  const value = React.useMemo<ReadingModeContextValue>(
    () => ({ prefs, zen, chromeRevealed, updatePref, resetPrefs, toggleZen, setZen }),
    [prefs, zen, chromeRevealed, updatePref, resetPrefs, toggleZen, setZen],
  );

  return <ReadingModeContext.Provider value={value}>{children}</ReadingModeContext.Provider>;
}

/**
 * Script inline di <head> agar tema & tipografi langsung terpakai sebelum paint
 * (tidak ada kedipan default saat hard reload). nilainya identik dengan yang
 * dibaca provider dari localStorage.
 */
export const READING_BOOTSTRAP_SCRIPT = `(function(){try{var d=document.documentElement;var k=${JSON.stringify(
  READING_STORAGE_KEY,
)};var p=JSON.parse(localStorage.getItem(k)||"null")||{};var t=["paper","light","dark"].indexOf(p.theme)>-1?p.theme:"paper";var f=p.font==="sans"?"sans":"serif";var s=typeof p.fontSize==="number"&&p.fontSize>=14&&p.fontSize<=22?Math.round(p.fontSize):18;var l=typeof p.lineHeight==="number"&&p.lineHeight>=1.6&&p.lineHeight<=2.1?p.lineHeight:1.75;d.dataset.readingTheme=t;d.dataset.readingFont=f;d.style.setProperty("--rd-font-size",s+"px");d.style.setProperty("--rd-line-height",String(l));}catch(e){}})();`;
