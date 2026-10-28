"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Bookmark,
  BookOpen,
  FileText,
  Wrench,
  Book,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Resource } from "@/lib/dummy-data";
import { toggleFavoriteResourceAction } from "@/app/actions/resources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ResourceListClient({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const [search, setSearch] = React.useState("");
  const [selectedAge, setSelectedAge] = React.useState<string>("semua");
  const [selectedType, setSelectedType] = React.useState<string>("semua");
  const [favorites, setFavorites] = React.useState<string[]>(["res-1", "res-2"]);

  const toggleFavorite = async (id: string, title: string) => {
    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites(favorites.filter((f) => f !== id));
      toast.info(`"${title}" dihapus dari favorit.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success(`"${title}" disimpan ke resource favorit Anda!`);
    }

    try {
      await toggleFavoriteResourceAction(id);
    } catch {
      // Optimistic state handles it smoothly
    }
  };

  const filteredResources = initialResources.filter((res) => {
    const matchesAge = selectedAge === "semua" || res.age_category === selectedAge;
    const matchesType = selectedType === "semua" || res.type === selectedType;
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.publisher.toLowerCase().includes(search.toLowerCase());

    return matchesAge && matchesType && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Pusat Sumber Belajar
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Resource Hub Terbuka
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Kurasi materi bacaan berkualitas, lembar kerja nalar kritis, dan perkakas
            digital yang dapat diakses secara gratis oleh keluarga, guru, dan komunitas.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-10 rounded-md border border-border bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari judul, penerbit, atau kata kunci materi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Quick reset */}
            {(selectedAge !== "semua" || selectedType !== "semua" || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedAge("semua");
                  setSelectedType("semua");
                  setSearch("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset Semua Filter
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-border">
            {/* Age Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Kelompok Usia:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "semua", label: "Semua Usia" },
                  { id: "anak", label: "Anak (PAUD - SD)" },
                  { id: "remaja", label: "Remaja (SMP - SMA)" },
                  { id: "dewasa", label: "Dewasa & Mahasiswa" },
                ].map((age) => (
                  <button
                    key={age.id}
                    type="button"
                    onClick={() => setSelectedAge(age.id)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      selectedAge === age.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-surface text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Jenis Materi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "semua", label: "Semua Format" },
                  { id: "pdf", label: "Dokumen PDF" },
                  { id: "tool", label: "Alat / Platform Web" },
                  { id: "book", label: "Buku Rekomendasi" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      selectedType === type.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-surface text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Cards Grid */}
        {filteredResources.length === 0 ? (
          <div className="my-16 text-center py-12 rounded-md border border-dashed border-border bg-surface/50">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
              Materi Tidak Ditemukan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tidak ada sumber daya yang sesuai dengan kombinasi filter saat ini.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((res) => {
              const isFav = favorites.includes(res.id);
              return (
                <Card
                  key={res.id}
                  className="flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Top tags and favorite button */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          {res.type === "pdf" && <FileText className="h-3 w-3 mr-1 text-rose-600" />}
                          {res.type === "tool" && <Wrench className="h-3 w-3 mr-1 text-sky-600" />}
                          {res.type === "book" && <Book className="h-3 w-3 mr-1 text-emerald-600" />}
                          {res.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="capitalize text-[10px]">
                          {res.age_category}
                        </Badge>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(res.id, res.title)}
                        className={cn(
                          "rounded-md p-1.5 transition-colors hover:bg-muted cursor-pointer",
                          isFav ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                        )}
                        title={isFav ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                      >
                        <Bookmark
                          className={cn("h-4 w-4", isFav && "fill-amber-500 text-amber-500")}
                        />
                      </button>
                    </div>

                    <Link href={`/resource/${res.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {res.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {res.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground text-[11px] truncate max-w-[130px]">
                        {res.publisher}
                      </span>
                      <Link href={`/resource/${res.slug}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                          <span>Detail</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
