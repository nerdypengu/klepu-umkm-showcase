import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { UmkmCard } from "@/components/umkm-card";
import heroImage from "@/assets/klepu-hero.jpg";
import { umkmList, type Category } from "@/lib/umkm-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desa Klepu — Potensi & Peluang Investasi UMKM Unggulan Ponorogo" },
      { name: "description", content: "Jelajahi peluang investasi lokal paling prospektif di Desa Klepu, Ponorogo. Temukan Kopi Liberika khas, Herbal Kelor-Secang, Keripik Tempe, dan Kerajinan Anyaman." },
      { property: "og:title", content: "Katalog & Peluang Investasi UMKM Desa Klepu, Ponorogo" },
      { property: "og:description", content: "Dukung pertumbuhan ekonomi desa melalui produk-produk unggulan Klepu: Kopi Liberika, Minuman Herbal, Kerajinan Anyaman, & Kuliner Lokal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Desa Klepu — Potensi & Peluang Investasi UMKM Unggulan Ponorogo" },
      { name: "twitter:description", content: "Jelajahi peluang investasi UMKM aktif & potensi ekonomi kreatif Desa Klepu, Sooko, Ponorogo." },
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
              <h1 className="max-w-xl font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl">
                Investasi yang tumbuh <span className="text-primary">dari desa.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Mengenal potensi tujuh UMKM aktif serta kelompok tani, peternakan, dan wisata Desa Klepu—lengkap dengan kesiapan, kebutuhan, dan peluang pengembangannya.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="clay" size="lg"><Link to="/" hash="umkm">Lihat UMKM <ArrowRight /></Link></Button>
                <Button asChild variant="outline" size="lg" className="h-11 rounded-2xl shadow-clay"><a href="https://klepu-sooko.desa.id/" target="_blank" rel="noreferrer">Website Desa</a></Button>
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
            <HeroCarousel />
          </div>
        </section>

        <section id="umkm" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs font-bold uppercase text-primary">Lapak Desa</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Pilih UMKM, lihat potensinya</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Setiap profil memuat fakta usaha, kebutuhan modal, serta peluang pengembangan produknya.</p>
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

      </main>
      <SiteFooter />
    </div>
  );
}

const slides = [
  { image: heroImage, alt: "Ragam produk unggulan Desa Klepu", title: "Produk Desa Klepu", note: "Tujuh UMKM aktif" },
  ...umkmList
    .filter((item, index, all) => all.findIndex((other) => other.image === item.image) === index && item.image !== heroImage)
    .map((item) => ({ image: item.image, alt: item.imageAlt, title: item.name, note: `Indikatif ${item.investment}` })),
];

function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const go = (step: number) => setActive((current) => (current + step + slides.length) % slides.length);
  const current = slides[active]!;

  return (
    <div className="relative pb-4">
      <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_18px_0_var(--shadow-soft)]" aria-roledescription="carousel" aria-label="Galeri produk Desa Klepu">
        {slides.map((slide, index) => (
          <img
            key={slide.title}
            src={slide.image}
            alt={slide.alt}
            width={1200}
            height={1000}
            fetchPriority={index === 0 ? "high" : "low"}
            className={cn("absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none", index === active ? "opacity-100" : "opacity-0")}
            aria-hidden={index === active ? undefined : true}
          />
        ))}
        <button type="button" onClick={() => go(-1)} aria-label="Gambar sebelumnya" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-clay transition hover:bg-card">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Gambar berikutnya" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-clay transition hover:bg-card">
          <ChevronRight className="size-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Tampilkan ${slide.title}`}
              aria-current={index === active}
              className={cn("h-2 rounded-full bg-card/70 transition-all", index === active ? "w-6 bg-card" : "w-2")}
            />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 left-2 -rotate-2 rounded-2xl bg-accent px-4 py-3 shadow-clay-dark sm:-left-4">
        <p className="font-display text-sm font-bold text-accent-foreground">{current.title}</p>
        <p className="text-[11px] text-accent-foreground/70">{current.note}</p>
      </div>
    </div>
  );
}