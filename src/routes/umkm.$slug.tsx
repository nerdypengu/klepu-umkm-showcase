import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CircleAlert, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getUmkm, umkmList } from "@/lib/umkm-data";

export const Route = createFileRoute("/umkm/$slug")({
  loader: ({ params }) => {
    const item = getUmkm(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Investasi UMKM Desa Klepu` : "UMKM Tidak Ditemukan — Desa Klepu" },
      { name: "description", content: loaderData?.summary ?? "Profil UMKM Desa Klepu tidak ditemukan." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — Investasi Desa Klepu` : "UMKM Tidak Ditemukan" },
      { property: "og:description", content: loaderData?.summary ?? "Profil UMKM Desa Klepu tidak ditemukan." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: UmkmNotFound,
  component: UmkmDetailPage,
});

function UmkmDetailPage() {
  const item = Route.useLoaderData();
  const related = umkmList.filter((candidate) => candidate.slug !== item.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-6">
          <Link to="/" hash="umkm" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"><ArrowLeft className="size-4" /> Kembali ke daftar</Link>
          <div className="mt-7 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{item.category}</span><StatusBadge status={item.investmentStatus} /></div>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl">{item.name}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{item.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm"><span className="rounded-xl bg-card px-4 py-3 shadow-clay"><strong className="block text-xs text-muted-foreground">Status usaha</strong>{item.activeStatus}</span><span className="rounded-xl bg-card px-4 py-3 shadow-clay"><strong className="block text-xs text-muted-foreground">Kesiapan</strong>{item.readiness}</span></div>
            </div>
            <img src={item.image} alt={item.imageAlt} width={900} height={720} className="aspect-[5/4] w-full rounded-[2rem] object-cover shadow-[0_14px_0_var(--shadow-soft)]" />
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="font-display text-xs font-bold uppercase text-primary">Profil usaha</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">Fakta yang sudah tersedia</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Informasi berasal dari draf data Desa Klepu. Label pada setiap angka menunjukkan apakah data sudah tercatat, masih perlu diperiksa, berupa simulasi, atau rekomendasi.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Produk utama</p><p className="mt-1 font-semibold">{item.product}</p></div>
                <div className="rounded-2xl bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Pemilik / pengelola</p><p className="mt-1 font-semibold">{item.owner}</p></div>
                <div className="rounded-2xl bg-background p-4 sm:col-span-2"><p className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><MapPin className="size-3.5" /> Pasar yang dituju</p><p className="mt-1 leading-relaxed">{item.market}</p></div>
              </div>
              <div className="mt-8 space-y-3">
                {item.facts.map((fact) => (
                  <div key={fact.label} className="grid gap-2 rounded-2xl border border-border p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center"><p className="text-sm font-bold">{fact.label}</p><p className="text-sm text-muted-foreground">{fact.value}</p><StatusBadge status={fact.status} /></div>
                ))}
              </div>
            </div>

            <aside>
              <div className="sticky top-24 overflow-hidden rounded-[2rem] bg-background shadow-clay">
                <div className="bg-primary px-6 py-5 text-primary-foreground"><p className="font-display text-xl font-bold">Ringkasan investasi</p><p className="mt-1 text-xs text-primary-foreground/65">Kisaran perencanaan, bukan harga final</p></div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Modal indikatif</p>
                  <p className="mt-1 font-display text-4xl font-extrabold text-primary">{item.investment}</p>
                  <StatusBadge status={item.investmentStatus} className="mt-3" />
                  <div className="mt-6 border-t border-border pt-5"><p className="text-sm font-bold">Penggunaan dana</p><ul className="mt-3 space-y-2">{item.investmentUse.map((use) => <li key={use} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{use}</li>)}</ul></div>
                  <Button asChild variant="clay" size="lg" className="mt-7 w-full"><a href="https://klepu-sooko.desa.id/" target="_blank" rel="noreferrer">Nyatakan minat <ArrowRight /></a></Button>
                  <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">Kontak pemilik hanya dibagikan dengan persetujuan. Tidak ada jaminan hasil investasi.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <InfoList title="Risiko utama" icon={<CircleAlert />} items={item.risks} tone="caution" />
            <InfoList title="Cara mengurangi risiko" icon={<Target />} items={item.mitigations} tone="green" />
            <InfoList title="Syarat sebelum final" icon={<Check />} items={item.prerequisites} tone="neutral" />
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
            <p className="font-display text-xs font-bold uppercase text-primary">Peluang desa</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Peluang pengembangan terkait</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.opportunityContext}</p>
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

        <section className="bg-secondary/55">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6"><div className="flex items-end justify-between gap-4"><div><p className="font-display text-xs font-bold uppercase text-primary">UMKM lainnya</p><h2 className="mt-1 font-display text-3xl font-extrabold">Lanjut menjelajah</h2></div><Link to="/" hash="umkm" className="hidden text-sm font-bold text-primary sm:block">Lihat semua →</Link></div><div className="mt-7 grid gap-4 sm:grid-cols-3">{related.map((candidate) => <Link key={candidate.id} to="/umkm/$slug" params={{ slug: candidate.slug }} className="flex items-center gap-4 rounded-2xl bg-card p-3 transition-transform hover:-translate-y-1"><img src={candidate.image} alt="" width={96} height={96} loading="lazy" className="size-20 rounded-xl object-cover" /><div><p className="font-display text-lg font-bold leading-tight">{candidate.name}</p><p className="mt-1 text-xs text-muted-foreground">{candidate.category} · {candidate.investment}</p></div></Link>)}</div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoList({ title, icon, items, tone }: { title: string; icon: React.ReactNode; items: string[]; tone: "caution" | "green" | "neutral" }) {
  const toneClass = tone === "caution" ? "bg-caution-soft text-caution" : tone === "green" ? "bg-secondary text-primary" : "bg-muted text-foreground";
  return <div className="rounded-[1.75rem] border border-border bg-card p-6"><div className={`grid size-10 place-items-center rounded-xl ${toneClass}`}>{icon}</div><h2 className="mt-4 font-display text-xl font-bold">{title}</h2><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul></div>;
}

function UmkmNotFound() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center"><p className="font-display text-7xl font-extrabold text-primary">404</p><h1 className="mt-3 font-display text-3xl font-bold">UMKM belum ditemukan</h1><p className="mt-3 text-muted-foreground">Profil ini belum tersedia atau alamatnya telah berubah.</p><Button asChild variant="clay" className="mt-7"><Link to="/" hash="umkm">Kembali ke daftar</Link></Button></main><SiteFooter /></div>;
}