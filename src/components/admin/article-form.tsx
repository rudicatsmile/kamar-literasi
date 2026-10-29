"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { dummyCategories, Article, Category } from "@/lib/dummy-data";
import { toast } from "sonner";

interface ArticleFormProps {
  initialData?: Article;
  isEdit?: boolean;
  categories?: Category[];
}

export function ArticleForm({
  initialData,
  isEdit = false,
  categories = dummyCategories,
}: ArticleFormProps) {
  const router = useRouter();

  const categoryList = categories.length > 0 ? categories : dummyCategories;
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = React.useState(
    initialData?.category_id || categoryList[0].id
  );
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [coverUrl, setCoverUrl] = React.useState(
    initialData?.cover_url ||
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop"
  );
  const [authorName, setAuthorName] = React.useState(
    initialData?.author_name || "Dewi Lestari"
  );
  const [authorId, setAuthorId] = React.useState(
    initialData?.author_id || ""
  );
  const [status, setStatus] = React.useState<"draft" | "published">(
    initialData?.status || "published"
  );

  // Auto-generate slug when title changes (if new article)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Estimate reading time (200 words per minute)
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const insertFormatting = (tag: string) => {
    let prefix = "";
    let suffix = "";
    switch (tag) {
      case "bold":
        prefix = "**";
        suffix = "**";
        break;
      case "italic":
        prefix = "*";
        suffix = "*";
        break;
      case "h2":
        prefix = "\n\n## ";
        break;
      case "h3":
        prefix = "\n\n### ";
        break;
      case "quote":
        prefix = "\n\n> ";
        break;
      case "list":
        prefix = "\n- ";
        break;
    }
    setContent((prev) => prev + prefix + "Teks baru di sini" + suffix);
  };

  const handleSave = async (publishStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      toast.error("Judul dan isi artikel wajib diisi.");
      return;
    }

    setStatus(publishStatus);
    const { saveArticleAction } = await import("@/app/actions/articles");
    const result = await saveArticleAction({
      id: initialData?.id,
      title,
      slug,
      excerpt,
      content,
      cover_url: coverUrl,
      category_id: categoryId,
      status: publishStatus,
      author_id: authorId || undefined,
    });

    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        isEdit
          ? `Artikel "${title}" berhasil diperbarui!`
          : `Artikel baru "${title}" berhasil diterbitkan!`
      );
      setTimeout(() => {
        router.push("/admin/artikel");
      }, 600);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/admin/artikel"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Kelola Artikel</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            {isEdit ? "Edit Naskah Artikel" : "Tulis Artikel & Esai Baru"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            className="gap-1.5 text-xs"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Draf</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave("published")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Send className="h-4 w-4" />
            <span>{isEdit ? "Perbarui & Terbitkan" : "Publikasikan Sekarang"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Editor Body */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Judul Artikel <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Mengapa Membaca 15 Menit Sehari Merevolusi Otak"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-base font-serif font-bold py-6"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Ringkasan Pembuka (Excerpt) <span className="text-destructive">*</span>
            </label>
            <Textarea
              rows={3}
              placeholder="Satu atau dua kalimat pembuka yang merangkum esensi tulisan..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="text-xs leading-relaxed"
            />
          </div>

          {/* Rich Content Editor Toolbar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Isi Konten Artikel <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Estimasi baca: {readingTime} Menit ({wordCount} kata)
              </span>
            </div>

            <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
              {/* Editor Formatting Toolbar */}
              <div className="flex items-center gap-1 border-b border-border bg-surface p-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => insertFormatting("bold")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Tebal (Bold)"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("italic")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Miring (Italic)"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("h2")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Judul Bab (H2)"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("h3")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Sub-judul (H3)"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("quote")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Kutipan (Blockquote)"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("list")}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Daftar Poin"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan naskah lengkap Anda di sini..."
                className="border-0 rounded-none focus-visible:ring-0 p-4 font-sans text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-md border border-border bg-white p-5 space-y-4 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-foreground">
              Pengaturan Penerbitan
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kategori Artikel
              </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="text-xs"
              >
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Slug URL (Unik)
              </label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs font-mono"
                required
              />
              <p className="text-[10px] text-muted-foreground">
                Akan muncul di /artikel/{slug || "slug-artikel"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Penulis Terpilih
              </label>
              <Input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                URL Gambar Sampul (Cover)
              </label>
              <Input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Live Cover Preview */}
            {coverUrl && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Pratinjau Sampul:
                </span>
                <div className="overflow-hidden rounded-md border border-border bg-muted">
                  <img
                    src={coverUrl}
                    alt="Preview cover"
                    className="aspect-16/10 w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
