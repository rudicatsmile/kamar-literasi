/**
 * Preference readers untuk Mode Membaca Fokus (Zen Mode) & Kustomisasi Tipografi.
 * Selaras cetak biru fitur 2.2 (docs/rekomendasi-fitur.md).
 */

export type ReadingTheme = "paper" | "light" | "dark";
export type ReadingFont = "serif" | "sans";

export interface ReadingPreferences {
  /** Tema warna latar membaca: Paper Warm / Pure Light / Dark OLED */
  theme: ReadingTheme;
  /** Jenis font konten: Serif Klasik vs Sans-serif Modern */
  font: ReadingFont;
  /** Ukuran teks body dalam px (14–22) */
  fontSize: number;
  /** Kelipatan line-height (1.6–2.1) */
  lineHeight: number;
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  theme: "paper",
  font: "serif",
  fontSize: 18,
  lineHeight: 1.75,
};

export const FONT_SIZE_MIN = 14;
export const FONT_SIZE_MAX = 22;
export const LINE_HEIGHT_MIN = 1.6;
export const LINE_HEIGHT_MAX = 2.1;
export const LINE_HEIGHT_STEP = 0.05;

export const READING_THEME_LABELS: Record<ReadingTheme, { label: string; swatch: string }> = {
  paper: { label: "Paper Warm", swatch: "#FBF9F5" },
  light: { label: "Pure Light", swatch: "#FFFFFF" },
  dark: { label: "Dark OLED", swatch: "#0F172A" },
};

export const READING_FONT_LABELS: Record<ReadingFont, string> = {
  serif: "Serif Klasik",
  sans: "Sans-serif Modern",
};

/** Kunci localStorage preference pembaca. */
export const READING_STORAGE_KEY = "rl-reading-prefs";

/**
 * Membersihkan nilai tidak valid dari hasil baca localStorage / inline script.
 */
export function sanitizeReadingPreferences(raw: unknown): ReadingPreferences {
  if (typeof raw !== "object" || raw === null) return DEFAULT_READING_PREFERENCES;
  const p = raw as Partial<ReadingPreferences>;
  return {
    theme:
      p.theme === "paper" || p.theme === "light" || p.theme === "dark"
        ? p.theme
        : DEFAULT_READING_PREFERENCES.theme,
    font: p.font === "serif" || p.font === "sans" ? p.font : DEFAULT_READING_PREFERENCES.font,
    fontSize:
      typeof p.fontSize === "number" &&
      Number.isFinite(p.fontSize) &&
      p.fontSize >= FONT_SIZE_MIN &&
      p.fontSize <= FONT_SIZE_MAX
        ? Math.round(p.fontSize)
        : DEFAULT_READING_PREFERENCES.fontSize,
    lineHeight:
      typeof p.lineHeight === "number" &&
      Number.isFinite(p.lineHeight) &&
      p.lineHeight >= LINE_HEIGHT_MIN &&
      p.lineHeight <= LINE_HEIGHT_MAX
        ? p.lineHeight
        : DEFAULT_READING_PREFERENCES.lineHeight,
  };
}
