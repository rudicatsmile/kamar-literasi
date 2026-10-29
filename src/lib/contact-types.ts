export interface ContactInfoItem {
  id: string;
  key: string;
  label: string;
  value: string;
  icon?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_CONTACT_INFO: ContactInfoItem[] = [
  {
    id: "default-email",
    key: "email",
    label: "Surel Resmi",
    value: "rudi.catsmile@gmail.com",
    icon: "Mail",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "default-whatsapp",
    key: "whatsapp",
    label: "WhatsApp Gateway Info",
    value: "+62 813-6715-5656 (Hanya pesan)",
    icon: "MessageSquare",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "default-address",
    key: "address",
    label: "Sekretariat Gerakan",
    value: "Jl. Kurnia No.16 RT 007/17 Tugu Utara - Koja Jakarta Utara",
    icon: "MapPin",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "default-response-time",
    key: "response_time",
    label: "Waktu Respon",
    value: "Senin - Jumat: 09.00 - 17.00 WIB",
    icon: "Clock",
    sort_order: 4,
    is_active: true,
  },
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "default-faq-1",
    question: "Apakah seluruh materi di website ini gratis?",
    answer:
      "Ya, 100% materi dan tantangan di Rumah Literasi bebas diakses tanpa pungutan biaya.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "default-faq-2",
    question: "Bagaimana cara mengirim tulisan saya?",
    answer:
      'Kirimkan naskah esai berbobot (600-1.200 kata) ke surel redaksi kami dengan subjek "Pengajuan Esai Tamu".',
    sort_order: 2,
    is_active: true,
  },
];
