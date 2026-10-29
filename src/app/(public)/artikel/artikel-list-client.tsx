"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article, Category } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ArtikelListClient({
  initialCategories,
  initialArticles,
}: {
  initialCategories: Category[];
  initialArticles: Article[];
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredArticles = initialArticles.filter((art) => {
    const matchesCategory =
      selectedCategory === "all" || art.category_slug === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Katalog Tulisan
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Artikel, Esai & Wawasan Literasi
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Eksplorasi wawasan kritis, panduan kebiasaan membaca mendalam, dan literasi
            digital untuk membentengi nalar Anda di era disrupsi informasi.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-y border-border py-4">
          {/* Categories Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Semua Topik ({initialArticles.length})
            </button>
            {initialCategories.map((cat) => {
              const count = initialArticles.filter(
                (a) => a.category_slug === cat.slug || a.category_id === cat.id
              ).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari artikel atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="my-16 text-center py-12 rounded-md border border-dashed border-border bg-surface/50">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
              Tidak Ada Artikel yang Cocok
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba sesuaikan kata kunci pencarian atau pilih kategori lain.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-white transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <Link
                  href={`/artikel/${article.slug}`}
                  className="relative aspect-16/10 overflow-hidden bg-muted"
                >
                  <img
                    src={article.cover_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-xs font-medium text-xs">
                      {article.category_name}
                    </Badge>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time} menit
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link href={`/artikel/${article.slug}`}>
                    <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                    <div className="flex items-center gap-2.5">
                      {article.author_avatar ? (
                        <div className="relative h-7 w-7 shrink-0 rounded-full overflow-hidden border border-border shadow-2xs bg-muted">
                          <Image
                            src={article.author_avatar}
                            alt={article.author_name}
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] border border-primary/20 uppercase tracking-wider">
                          {getInitials(article.author_name)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                          {article.author_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {article.author_role}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1"
                    >
                      <span>Baca</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Mock */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>Menampilkan 1 - {filteredArticles.length} dari {filteredArticles.length} artikel</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="default" size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
