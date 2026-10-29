"use client";

import * as React from "react";
import { ALargeSmall, Check, Focus, Minus, Plus, RotateCcw, Shrink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReadingMode } from "./reading-mode-provider";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  LINE_HEIGHT_MAX,
  LINE_HEIGHT_MIN,
  LINE_HEIGHT_STEP,
  READING_FONT_LABELS,
  READING_THEME_LABELS,
  type ReadingFont,
  type ReadingTheme,
} from "@/lib/reading-preferences";

const THEMES = Object.keys(READING_THEME_LABELS) as ReadingTheme[];
const FONTS = Object.keys(READING_FONT_LABELS) as ReadingFont[];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-rd-muted">
      {children}
    </p>
  );
}

function TypographyPanel({ onClose }: { onClose: () => void }) {
  const { prefs, updatePref, resetPrefs } = useReadingMode();

  return (
    <div
      role="dialog"
      aria-label="Pengaturan tipografi baca"
      className="max-h-[70vh] w-[17.5rem] overflow-y-auto rounded-lg border border-rd-border bg-rd-surface p-4 shadow-xl backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-rd-fg">
          Pengaturan Baca
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panel tipografi"
          className="rounded-md p-1 text-rd-muted transition-colors hover:bg-rd-border hover:text-rd-fg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tema warna latar */}
      <div className="mb-5">
        <SectionLabel>Tema Warna Latar</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => {
            const active = prefs.theme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => updatePref("theme", theme)}
                aria-pressed={active}
                title={READING_THEME_LABELS[theme].label}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-md border p-2 transition-all",
                  active
                    ? "border-rd-accent ring-1 ring-rd-accent"
                    : "border-rd-border hover:border-rd-muted",
                )}
              >
                <span
                  className="h-6 w-full rounded-sm border border-rd-border"
                  style={{ backgroundColor: READING_THEME_LABELS[theme].swatch }}
                />
                <span
                  className={cn(
                    "text-[9.5px] font-medium leading-tight text-rd-muted",
                    active && "text-rd-fg",
                  )}
                >
                  {READING_THEME_LABELS[theme].label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Jenis font */}
      <div className="mb-5">
        <SectionLabel>Jenis Font</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => {
            const active = prefs.font === font;
            return (
              <button
                key={font}
                type="button"
                onClick={() => updatePref("font", font)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-md border px-2 py-2 text-xs transition-all",
                  font === "serif" ? "font-rd-serif" : "font-rd-sans",
                  active
                    ? "border-rd-accent ring-1 ring-rd-accent text-rd-fg"
                    : "border-rd-border text-rd-muted hover:border-rd-muted",
                )}
              >
                <span className="mr-1 text-base leading-none">Aa</span>
                {READING_FONT_LABELS[font]}
                {active && (
                  <Check className="absolute right-1.5 top-1.5 h-3 w-3 text-rd-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skala ukuran teks */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Ukuran Teks</SectionLabel>
          <span className="text-[10px] font-semibold tabular-nums text-rd-fg">
            {prefs.fontSize}px
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Perkecil ukuran teks"
            disabled={prefs.fontSize <= FONT_SIZE_MIN}
            onClick={() => updatePref("fontSize", Math.max(FONT_SIZE_MIN, prefs.fontSize - 1))}
            className="rounded-md border border-rd-border p-1.5 text-rd-fg transition-colors hover:bg-rd-border disabled:opacity-40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="range"
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            step={1}
            value={prefs.fontSize}
            aria-label="Skala ukuran teks"
            onChange={(e) => updatePref("fontSize", Number(e.target.value))}
            className="rd-range h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-rd-border"
          />
          <button
            type="button"
            aria-label="Perbesar ukuran teks"
            disabled={prefs.fontSize >= FONT_SIZE_MAX}
            onClick={() => updatePref("fontSize", Math.min(FONT_SIZE_MAX, prefs.fontSize + 1))}
            className="rounded-md border border-rd-border p-1.5 text-rd-fg transition-colors hover:bg-rd-border disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Jarak baris */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Jarak Baris</SectionLabel>
          <span className="text-[10px] font-semibold tabular-nums text-rd-fg">
            {prefs.lineHeight.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={LINE_HEIGHT_MIN}
          max={LINE_HEIGHT_MAX}
          step={LINE_HEIGHT_STEP}
          value={prefs.lineHeight}
          aria-label="Jarak baris teks"
          onChange={(e) => updatePref("lineHeight", Number(e.target.value))}
          className="rd-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-rd-border"
        />
      </div>

      <button
        type="button"
        onClick={resetPrefs}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-rd-border py-1.5 text-[11px] font-medium text-rd-muted transition-colors hover:bg-rd-border hover:text-rd-fg"
      >
        <RotateCcw className="h-3 w-3" />
        Kembalikan ke Bawaan
      </button>
    </div>
  );
}

export function ReadingControls() {
  const { zen, toggleZen } = useReadingMode();
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const baseButton =
    "flex items-center justify-center gap-1.5 rounded-full border border-rd-border bg-rd-surface/95 px-3 py-2.5 text-xs font-semibold text-rd-fg shadow-md backdrop-blur transition-all hover:border-rd-accent hover:text-rd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rd-accent";

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "fixed z-50 flex flex-col items-end gap-2 print:hidden",
        zen ? "bottom-6 right-6" : "bottom-6 right-4 sm:right-6",
      )}
    >
      {open && (
        <div className="rd-panel mb-1">
          <TypographyPanel onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Pengaturan tipografi baca"
        title="Pengaturan Tipografi"
        className={cn(baseButton, open && "border-rd-accent text-rd-accent")}
      >
        <ALargeSmall className="h-4 w-4" />
        <span aria-hidden className="font-rd-serif text-[13px] leading-none tracking-tight">
          Aa
        </span>
      </button>

      <button
        type="button"
        onClick={toggleZen}
        aria-pressed={zen}
        aria-label={zen ? "Keluar mode membaca fokus" : "Masuk mode membaca fokus"}
        title={zen ? "Keluar Mode Fokus" : "Mode Fokus (Zen)"}
        className={cn(
          baseButton,
          zen && "border-rd-accent bg-rd-accent text-rd-accent-fg hover:text-rd-accent-fg",
        )}
      >
        {zen ? <Shrink className="h-4 w-4" /> : <Focus className="h-4 w-4" />}
        <span>{zen ? "Keluar Fokus" : "Mode Fokus"}</span>
      </button>
    </div>
  );
}
