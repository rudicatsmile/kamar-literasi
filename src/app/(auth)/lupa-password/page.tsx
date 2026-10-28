"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function LupaPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Mohon masukkan email Anda.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);

    const { forgotPasswordAction } = await import("@/app/actions/auth");
    const result = await forgotPasswordAction(formData);

    setLoading(false);
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success("Tautan instruksi atur ulang kata sandi telah dikirim ke email Anda.");
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="font-serif text-2xl font-bold text-foreground">
          Pemulihan Kata Sandi
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {sent ? (
          <div className="space-y-4 text-center py-2">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h4 className="font-serif text-lg font-bold text-foreground">
              Periksa Kotak Masuk Anda
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instruksi pemulihan telah dikirim ke <strong>{email}</strong>.
              Jika tidak menemukan email di kotak masuk, periksa folder spam Anda.
            </p>
            <div className="pt-2">
              <Link href="/reset-password">
                <Button variant="outline" size="sm" className="text-xs">
                  Buka Halaman Setel Kata Sandi Baru
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Alamat Email Akun
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

            <Button type="submit" disabled={loading} className="w-full gap-2">
              <span>{loading ? "Mengirim..." : "Kirim Tautan Pemulihan"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
