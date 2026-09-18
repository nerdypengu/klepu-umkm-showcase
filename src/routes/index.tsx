import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { UmkmCard } from "@/components/umkm-card";
import heroImage from "@/assets/klepu-hero.jpg";
import { umkmList, widerOpportunities, type Category } from "@/lib/umkm-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peluang Investasi UMKM Desa Klepu" },
      { name: "description", content: "Jelajahi tujuh UMKM aktif dan peluang investasi berbasis data di Desa Klepu, Sooko, Ponorogo." },
      { property: "og:title", content: "Peluang Investasi UMKM Desa Klepu" },
      { property: "og:description", content: "Jelajahi tujuh UMKM aktif dan peluang investasi berbasis data di Desa Klepu, Sooko, Ponorogo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const categories = ["Semua", "Kopi", "Herbal", "Makanan", "Kerajinan", "Kuliner"] as const;

function HomePage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");
  const filtered = useMemo(() => category === "Semua" ? umkmList : umkmList.filter((item) => item.category === category as Category), [category]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />
      <main>
        <section id="beranda" className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-6 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground shadow-[0_4px_0_var(--shadow-soft)]">
                <span className="size-2 rounded-full bg-accent" /> Peta Investasi UMKM 2026
              </span>
              <h1 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl">
                Investasi yang tumbuh <span className="text-primary">dari desa.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Mengenal potensi tujuh UMKM aktif serta kelompok tani, peternakan, dan wisata Desa Klepu—lengkap dengan kesiapan, kebutuhan, dan status datanya.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="clay" size="lg"><Link to="/" hash="umkm">Lihat UMKM <ArrowRight /></Link></Button>
                <Button asChild variant="outline" size="lg" className="h-11 rounded-2xl shadow-clay"><Link to="/" hash="potensi">Peta Potensi</Link></Button>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["7", "UMKM aktif"],
                  ["3", "Kelompok pendukung"],
                  ["17", "Potensi desa"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl bg-card px-5 py-4 shadow-clay">
                    <p className="font-display text-3xl font-extrabold text-primary">{value}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative pb-4">
              <img src={heroImage} alt="Kopi, keripik tempe, tas anyaman, kelor, dan secang dari ekonomi lokal Desa Klepu" width={1200} height={1104} fetchPriority="high" className="aspect-[6/5] w-full rounded-[2.5rem] object-cover shadow-[0_18px_0_var(--shadow-soft)]" />
              <div className="absolute -bottom-1 left-2 -rotate-2 rounded-2xl bg-accent px-4 py-3 shadow-clay-dark sm:-left-4">
                <p className="font-display text-sm font-bold">Kopi Liberika</p>
                <p className="text-[11px] text-accent-foreground/70">Indikatif Rp20–28 juta</p>
              </div>
            </div>
          </div>
        </section>

        <section id="umkm" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs font-bold uppercase text-primary">Lapak Desa</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Pilih UMKM, lihat potensinya</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Setiap profil memisahkan fakta, data yang perlu diperiksa, dan rekomendasi investasi.</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori UMKM">
              {categories.map((item) => (
                <Button key={item} type="button" size="sm" variant={category === item ? "clay" : "outline"} onClick={() => setCategory(item)} className={cn("rounded-xl", category !== item && "shadow-none")}>{item}</Button>
              ))}
            </div>
          </div>
          <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => <UmkmCard key={item.id} item={item} />)}
          </div>
        </section>

        <section id="potensi" className="scroll-mt-16 border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
            <p className="font-display text-xs font-bold uppercase text-primary">Potensi desa</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Peluang pengembangan berikutnya</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Peluang dari sektor pangan, peternakan, dan hasil desa yang dapat dikembangkan bersama pelaku usaha lokal.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {widerOpportunities.map((opportunity) => (
                <div key={opportunity.name} className="rounded-2xl border border-border bg-background p-5 shadow-clay">
                  <p className="font-display text-lg font-bold">{opportunity.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{opportunity.status}</p>
                  <p className="mt-5 font-display text-lg font-extrabold text-primary">{opportunity.investment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}