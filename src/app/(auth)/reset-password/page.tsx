"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Mohon isi kedua kolom kata sandi.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak sesuai.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    const { resetPasswordAction } = await import("@/app/actions/auth");
    const result = await resetPasswordAction(formData);

    setLoading(false);
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru.");
      router.push("/login");
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="font-serif text-2xl font-bold text-foreground">
          Atur Ulang Kata Sandi
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Buat kata sandi baru yang kuat untuk melindungi akun dan riwayat bacaan Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2 font-semibold">
            <span>{loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          Sudah ingat kata sandi Anda?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Kembali ke Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
