import { Metadata } from "next";
import {
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Phone,
  Globe,
  HelpCircle,
  Building,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getContactInfo, getFaqs } from "@/lib/data";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan",
  description:
    "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Rumah Literasi.",
  openGraph: {
    title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan - Rumah Literasi",
    description:
      "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Rumah Literasi.",
  },
};

export const dynamic = "force-dynamic";

function ContactIcon({ name }: { name?: string | null }) {
  const iconClass = "h-4 w-4 text-primary shrink-0 mt-0.5";
  switch (name?.toLowerCase()) {
    case "mail":
    case "email":
      return <Mail className={iconClass} />;
    case "messagesquare":
    case "whatsapp":
    case "chat":
      return <MessageSquare className={iconClass} />;
    case "mappin":
    case "address":
    case "location":
      return <MapPin className={iconClass} />;
    case "clock":
    case "time":
      return <Clock className={iconClass} />;
    case "phone":
    case "telepon":
      return <Phone className={iconClass} />;
    case "globe":
    case "web":
      return <Globe className={iconClass} />;
    case "building":
      return <Building className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
}

export default async function KontakPage() {
  const [contactList, faqList] = await Promise.all([
    getContactInfo(),
    getFaqs(),
  ]);

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl">
          <Badge
            variant="outline"
            className="text-xs uppercase tracking-wider mb-2 font-semibold"
          >
            Hubungi Kami
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Mari Berkolaborasi untuk Nalar Bangsa
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Punya gagasan tulisan, ingin mendonasikan buku ke taman bacaan terbuka,
            atau mengundang fasilitator pelatihan berpikir kritis di sekolah Anda?
            Kami siap mendengar.
          </p>
        </div>

        {/* Main Grid: Form & Info */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Contact Details & FAQ Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic Contact Details Card */}
            <div className="rounded-lg border border-border bg-white p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Informasi Kontak Resmi
              </h3>
              <div className="space-y-4 text-xs">
                {contactList && contactList.length > 0 ? (
                  contactList.map((c) => (
                    <div key={c.id || c.key} className="flex items-start gap-3">
                      <ContactIcon name={c.icon} />
                      <div>
                        <p className="font-semibold text-foreground">{c.label}</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {c.value}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs italic">
                    Informasi kontak resmi belum ditambahkan.
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic FAQ Card */}
            <div className="rounded-lg border border-border bg-surface p-6 space-y-3">
              <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Pertanyaan Umum (FAQ)</span>
              </div>
              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed divide-y divide-border/60">
                {faqList && faqList.length > 0 ? (
                  faqList.map((faq, idx) => (
                    <div key={faq.id || idx} className={idx > 0 ? "pt-3" : ""}>
                      <p className="font-semibold text-foreground mb-1">
                        {faq.question}
                      </p>
                      <p className="leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs italic">
                    Belum ada butir pertanyaan umum.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
