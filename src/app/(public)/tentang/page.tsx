import { Metadata } from "next";
import Image from "next/image";
import {
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getStaticPage,
  getOrganizationValues,
  getTeamMembers,
} from "@/lib/data";
import { dummyStaticPages } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Tentang Kami - Visi, Misi & Tim Penggerak",
  description:
    "Mengenal visi, misi, nilai-nilai, dan cerita latar belakang gerakan Rumah Literasi di Indonesia.",
  openGraph: {
    title: "Tentang Kami - Visi, Misi & Tim Penggerak Rumah Literasi",
    description:
      "Mengenal visi, misi, nilai-nilai, dan cerita latar belakang gerakan Rumah Literasi di Indonesia.",
  },
};

export const dynamic = "force-dynamic";

interface DisplayValue {
  id?: string;
  title: string;
  desc: string;
  order?: number;
}

interface DisplayTeam {
  id?: string;
  name: string;
  role: string;
  avatar?: string | null;
  bio?: string;
  order?: number;
}

export default async function TentangPage() {
  const [pageData, organizationValues, teamMembers] = await Promise.all([
    getStaticPage("tentang"),
    getOrganizationValues(),
    getTeamMembers(),
  ]);

  const tentang = pageData || dummyStaticPages.tentang;
  const values: DisplayValue[] =
    organizationValues && organizationValues.length > 0
      ? organizationValues
      : (tentang.values || []).map((v: any, i: number) => ({
        title: v.title,
        desc: v.desc,
        order: i + 1,
      }));

  const team: DisplayTeam[] =
    teamMembers && teamMembers.length > 0
      ? teamMembers
      : (tentang.team || []).map((t: any, i: number) => ({
        name: t.name,
        role: t.role,
        avatar: t.avatar,
        order: i + 1,
      }));

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge
            variant="outline"
            className="text-xs uppercase tracking-wider mb-2 font-semibold"
          >
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

        {/* Nilai-Nilai Inti (Dynamic dari tabel nilai) */}
        <div className="space-y-6 border-t border-border pt-10">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {tentang.values_title || "Nilai-Nilai yang Kami Pegang Teguh"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {tentang.values_subtitle ||
                "Prinsip dan integritas yang kami jadikan kompas dalam setiap langkah dan kurasi bacaan."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((val, idx: number) => (
              <div
                key={val.id || idx}
                className="rounded-md border border-border bg-white p-6 shadow-xs space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="text-primary font-semibold text-xs mb-1">
                  Prinsip #{val.order || idx + 1}
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

        {/* Tim Redaksi & Penggerak (Dynamic dari tabel team_members) */}
        <div className="space-y-6 border-t border-border pt-10">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {tentang.team_title || "Pengurus Tim Penggerak & Redaksi"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {tentang.team_subtitle ||
                "Daftar profil dan foto kurator/redaksi yang tampil di rute publik /tentang"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {team.map((member, idx: number) => (
              <div
                key={member.id || idx}
                className="group flex flex-col items-center text-center rounded-md border border-border bg-white p-6 transition-all hover:border-primary/40 shadow-xs"
              >
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors bg-muted flex items-center justify-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <h4 className="mt-4 font-serif text-base font-bold text-foreground">
                  {member.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="mt-2 text-[11px] text-muted-foreground/80 line-clamp-2">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
