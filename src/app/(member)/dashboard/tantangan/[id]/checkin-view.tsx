"use client";

import * as React from "react";
import {
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Challenge, UserChallengeProgress } from "@/lib/dummy-data";
import { checkinChallengeAction } from "@/app/actions/challenges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CheckinInteractiveView({
  challenge,
  initialProgress,
}: {
  challenge: Challenge;
  initialProgress: UserChallengeProgress;
}) {
  const [progress, setProgress] = React.useState<UserChallengeProgress>(initialProgress);
  const [selectedDayNumber, setSelectedDayNumber] = React.useState<number>(5); // default to next pending day
  const [reflectionInput, setReflectionInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedDay =
    challenge.days.find((d) => d.day_number === selectedDayNumber) ||
    challenge.days[0];

  const isSelectedDayCompleted = progress.completed_days.includes(selectedDayNumber);
  const savedReflection = progress.checkins.find(
    (c) => c.day_number === selectedDayNumber
  )?.reflection;

  const progressPercentage = Math.round(
    (progress.completed_days.length / challenge.duration_days) * 100
  );

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) {
      toast.error("Mohon tuliskan minimal satu kalimat catatan refleksi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await checkinChallengeAction(
        progress.id,
        selectedDayNumber,
        reflectionInput.trim()
      );

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan check-in.");
        setIsSubmitting(false);
        return;
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const newCompleted = [...new Set([...progress.completed_days, selectedDayNumber])];
      const newCheckins = [
        ...progress.checkins.filter((c) => c.day_number !== selectedDayNumber),
        {
          day_number: selectedDayNumber,
          date: todayStr,
          reflection: reflectionInput.trim(),
        },
      ];

      setProgress({
        ...progress,
        completed_days: newCompleted,
        current_streak: progress.current_streak + 1,
        checkins: newCheckins,
      });

      setReflectionInput("");
      toast.success(
        `Check-in Hari ke-${selectedDayNumber} berhasil dicatat! Streak bertambah menjadi ${
          progress.current_streak + 1
        } hari.`
      );
    } catch {
      toast.error("Terjadi kendala saat menyimpan check-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" className="font-bold text-xs">
                {challenge.duration_days} Hari
              </Badge>
              <Badge variant="outline" className="text-xs">
                Mulai: 24 Okt 2026
              </Badge>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {challenge.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
              <Flame className="h-5 w-5 fill-amber-500 text-amber-600" />
              <span>{progress.current_streak} Hari Streak</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Progres: {progress.completed_days.length} dari {challenge.duration_days} Hari Selesai
            </span>
            <span className="font-bold text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} max={100} className="h-2.5" />
        </div>
      </div>

      {/* Main Check-in Canvas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Interactive Calendar Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Kalender Hari Tantangan
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Klik hari untuk melihat tugas
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-4 gap-2.5">
            {Array.from({ length: challenge.duration_days }, (_, i) => {
              const dayNum = i + 1;
              const isDone = progress.completed_days.includes(dayNum);
              const isSelected = selectedDayNumber === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDayNumber(dayNum)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md p-3 border text-center transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 border-primary bg-primary/5"
                      : "hover:border-primary/40",
                    isDone
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                      : "bg-white border-border text-foreground"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Hari
                  </span>
                  <span className="font-serif text-lg font-bold">{dayNum}</span>
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 text-primary stroke-[3] mt-0.5" />
                  ) : (
                    <span className="text-[9px] text-muted-foreground mt-0.5">•</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="rounded-md border border-border bg-surface p-3.5 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">Panduan Check-in Harian</p>
            <p className="text-[11px] leading-relaxed">
              Satu hari hanya dapat divalidasi satu kali (WIB). Streak akan bertambah
              setiap kali Anda menyelesaikan tugas dan menyimpan catatan refleksi harian.
            </p>
          </div>
        </div>

        {/* Right: Selected Day Task & Reflection Input */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <Badge variant={isSelectedDayCompleted ? "success" : "accent"} className="text-xs">
                  {isSelectedDayCompleted ? "Hari Sudah Diselesaikan" : `Target Hari ke-${selectedDayNumber}`}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Hari ke-{selectedDayNumber} dari {challenge.duration_days}
                </span>
              </div>
              <CardTitle className="font-serif text-xl font-bold text-foreground pt-1">
                {selectedDay?.task_title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Instruksi Tugas:
                </h4>
                <p className="text-sm text-foreground leading-relaxed bg-surface rounded-md p-4 border border-border">
                  {selectedDay?.task_description}
                </p>
              </div>

              {/* Reflection Area */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Catatan Refleksi Bacaan
                  </h4>
                  {isSelectedDayCompleted && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Tercatat
                    </span>
                  )}
                </div>

                {isSelectedDayCompleted && savedReflection ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                    <p className="text-sm text-emerald-950 italic">
                      &ldquo;{savedReflection}&rdquo;
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      Tersimpan pada check-in hari ini.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCheckin} className="space-y-3">
                    <Textarea
                      rows={4}
                      placeholder="Apa satu ide, gagasan baru, atau kutipan yang paling berkesan dari bacaan Anda hari ini? (1-3 kalimat)..."
                      value={reflectionInput}
                      onChange={(e) => setReflectionInput(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 font-semibold"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {isSubmitting
                          ? "Menyimpan Check-in..."
                          : `Selesaikan Check-in Hari ke-${selectedDayNumber}`}
                      </span>
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Previous Reflections Log */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-foreground">
              Riwayat Refleksi Tersimpan ({progress.checkins.length})
            </h3>
            <div className="space-y-2">
              {progress.checkins.map((item) => (
                <div
                  key={item.day_number}
                  className="rounded-md border border-border bg-white p-3.5 text-xs space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span className="font-semibold text-foreground">
                      Hari ke-{item.day_number}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-foreground italic leading-relaxed">
                    &ldquo;{item.reflection}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
