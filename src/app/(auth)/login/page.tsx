"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("siti.rahmawati@contoh.id");
  const [password, setPassword] = React.useState("Literasi2026!");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Silakan lengkapi email dan kata sandi.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const { loginAction } = await import("@/app/actions/auth");
    const result = await loginAction(formData);

    setIsLoading(false);
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Berhasil masuk! Selamat datang kembali.");
      router.push("/dashboard");
    }
  };

  const handleDemoAdmin = () => {
    toast.success("Masuk sebagai Admin Redaksi...");
    router.push("/admin");
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="font-serif text-2xl font-bold text-foreground">
          Masuk ke Akun Anda
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Lanjutkan progres tantangan membaca dan kelola materi favorit Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Kata Sandi
              </label>
              <Link
                href="/lupa-password"
                className="text-xs text-primary hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
            />
            <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
              Ingat sesi saya di perangkat ini
            </label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full gap-2 font-semibold">
            <span>{isLoading ? "Memproses..." : "Masuk ke Akun"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          Belum memiliki akun?{" "}
          <Link href="/daftar" className="font-semibold text-primary hover:underline">
            Daftar Anggota Baru
          </Link>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="pt-3 border-t border-dashed border-border flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">Akses Cepat Pengujian:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDemoAdmin}
            className="text-[11px] h-7 gap-1"
          >
            <ShieldCheck className="h-3 w-3 text-amber-600" />
            <span>Masuk Panel Admin</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
