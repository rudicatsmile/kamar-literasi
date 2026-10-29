import { Metadata } from "next";
import {
  BookOpen,
  Compass,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStaticPage } from "@/lib/data";
import { dummyStaticPages } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Tentang Kami - Visi, Misi & Tim Penggerak",
  description:
    "Mengenal visi, misi, nilai-nilai, dan cerita latar belakang gerakan Masyarakat Literasi di Indonesia.",
  openGraph: {
    title: "Tentang Kami - Visi, Misi & Tim Penggerak Masyarakat Literasi",
    description:
      "Mengenal visi, misi, nilai-nilai, dan cerita latar belakang gerakan Masyarakat Literasi di Indonesia.",
  },
};

export default async function TentangPage() {
  const pageData = await getStaticPage("tentang");
  const tentang = pageData || dummyStaticPages.tentang;

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Mengenal Kami
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {tentang.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed font-serif italic">
            &ldquo;{tentang.subtitle}&rdquo;
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-6 border-t border-border pt-10">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Latar Belakang & Cerita Kami
          </h2>
          <div className="max-w-[68ch] space-y-4 text-base leading-relaxed text-foreground">
            {(tentang.story || "").split("\n\n").map((para: string, idx: number) => {
              const trimmed = para.trim();
              if (!trimmed) return null;
              return <p key={idx}>{trimmed}</p>;
            })}
          </div>
        </div>

        {/* Visi & Misi Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Visi */}
          <div className="rounded-lg border border-border bg-white p-8 shadow-xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Visi Kami
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {tentang.visi}
            </p>
          </div>

          {/* Misi */}
          <div className="rounded-lg border border-border bg-white p-8 shadow-xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Misi Kami
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
              {(tentang.misi || []).map((m: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nilai-Nilai Inti */}
        <div className="space-y-6 border-t border-border pt-10">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Nilai-Nilai yang Kami Pegang Teguh
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(tentang.values || []).map((val: { title: string; desc: string }, idx: number) => (
              <div
                key={idx}
                className="rounded-md border border-border bg-white p-6 shadow-xs space-y-2"
              >
                <div className="text-primary font-semibold text-xs mb-1">
                  Prinsip #{idx + 1}
                </div>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  {val.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tim Redaksi & Penggerak */}
        <div className="space-y-6 border-t border-border pt-10">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Tim Penggerak & Redaksi
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Kolaborasi lintas disiplin antara kurator buku, pendidik, dan pegiat literasi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {(tentang.team || []).map((member: { name: string; role: string; avatar: string }, idx: number) => (
              <div
                key={idx}
                className="group flex flex-col items-center text-center rounded-md border border-border bg-white p-6 transition-all hover:border-primary/40"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                />
                <h4 className="mt-4 font-serif text-base font-bold text-foreground">
                  {member.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
