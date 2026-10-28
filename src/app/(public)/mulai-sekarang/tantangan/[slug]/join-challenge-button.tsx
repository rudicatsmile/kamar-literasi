"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/lib/dummy-data";
import { joinChallengeAction } from "@/app/actions/challenges";
import { toast } from "sonner";

export function JoinChallengeButton({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [joined, setJoined] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await joinChallengeAction(challenge.id);
      if (res && !res.success) {
        if (res.error?.includes("masuk")) {
          toast.error(res.error, {
            action: {
              label: "Masuk",
              onClick: () => router.push(`/login?redirect=/mulai-sekarang/tantangan/${challenge.slug}`),
            },
          });
          return;
        }
        toast.error(res.error || "Gagal bergabung tantangan.");
        return;
      }

      setJoined(true);
      toast.success(
        res?.message ||
          `Selamat! Anda telah bergabung dalam "${challenge.title}". Mengarahkan ke Dasbor Progres...`
      );
      setTimeout(() => {
        router.push(`/dashboard/tantangan`);
      }, 1000);
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <Button disabled variant="outline" className="gap-2 text-primary border-primary">
        <CheckCircle2 className="h-4 w-4" />
        <span>Terdaftar</span>
      </Button>
    );
  }

  return (
    <Button onClick={handleJoin} disabled={loading} className="gap-2 shadow-xs">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Mendaftarkan...</span>
        </>
      ) : (
        <>
          <span>Ikuti Tantangan Ini</span>
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
