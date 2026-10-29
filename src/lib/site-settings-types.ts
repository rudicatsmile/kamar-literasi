export interface FooterSettings {
  title: string;
  description: string;
  tagline: string;
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  title: "Rumah Literasi",
  description:
    "Membangun budaya membaca, menulis, dan berpikir kritis di Indonesia. Menyediakan kurasi bahan bacaan berkualitas, panduan belajar gratis, dan tantangan kebiasaan membaca harian.",
  tagline: "Inisiatif independen nirlaba untuk kemajuan nalar bangsa.",
};

export interface SiteSettingItem {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}
