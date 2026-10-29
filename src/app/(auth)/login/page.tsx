"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { loginAction } from "@/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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

    const result = await loginAction(formData);

    setIsLoading(false);
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Berhasil masuk! Selamat datang kembali.");

      // Role-based redirection:
      // If user has 'admin' role, redirect to /admin (or next if next is an admin route)
      // If user has 'member' role, redirect to /dashboard (or next if next is a member route)
      if (result.role === "admin") {
        const destination = nextParam && nextParam.startsWith("/admin") ? nextParam : "/admin";
        router.push(destination);
      } else {
        const destination = nextParam && !nextParam.startsWith("/admin") ? nextParam : "/dashboard";
        router.push(destination);
      }

      router.refresh();
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="font-serif text-2xl font-bold text-foreground">
          Masuk ke Akun Anda
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Akses dasbor anggota atau panel administrasi redaksi.
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
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<Card className="border-border shadow-md min-h-[300px]" />}>
      <LoginForm />
    </React.Suspense>
  );
}
