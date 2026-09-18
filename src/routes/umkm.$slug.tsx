import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CircleAlert, ListChecks, MapPin, MessageCircle, Sprout, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { InvestmentChart } from "@/components/investment-chart";
import { getUmkm, umkmList } from "@/lib/umkm-data";

export const Route = createFileRoute("/umkm/$slug")({
  loader: ({ params }) => {
    const item = getUmkm(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} (${loaderData.category}) — Potensi & Investasi Desa Klepu` : "UMKM Tidak Ditemukan — Desa Klepu" },
      { name: "description", content: loaderData ? `${loaderData.name}: ${loaderData.summary} Kebutuhan modal indikatif ${loaderData.investment}. Pelajari fakta usaha & analisa pasarnya.` : "Profil UMKM Desa Klepu tidak ditemukan." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — Peluang Investasi Produk ${loaderData.category}` : "UMKM Tidak Ditemukan" },
      { property: "og:description", content: loaderData ? `${loaderData.summary} Indikasi modal: ${loaderData.investment}. Temukan detail lengkapnya di Showcase UMKM Desa Klepu.` : "Profil UMKM Desa Klepu tidak ditemukan." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData ? `${loaderData.name} — Potensi UMKM ${loaderData.category} Klepu` : "UMKM Tidak Ditemukan" },
      { name: "twitter:description", content: loaderData?.summary ?? "Profil UMKM Desa Klepu tidak ditemukan." },
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
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{item.category}</span><span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{item.product}</span></div>
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
              <h2 className="mt-2 font-display text-3xl font-extrabold">Profil usaha</h2>
              {item.description && <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{item.description}</p>}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Produk utama</p><p className="mt-1 font-semibold">{item.product}</p></div>
                {item.price && <div className="rounded-2xl bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Harga</p><p className="mt-1 font-semibold">{item.price}</p></div>}
                <div className="rounded-2xl bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Pemilik / pengelola</p><p className="mt-1 font-semibold">{item.owner}</p></div>
                <div className="rounded-2xl bg-background p-4 sm:col-span-2"><p className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Target className="size-3.5" /> Pasar yang dituju</p><p className="mt-1 leading-relaxed">{item.market}</p></div>
              </div>
              <div className="mt-8 space-y-3">
                {item.facts.map((fact) => (
                  <div key={fact.label} className="grid gap-2 rounded-2xl border border-border p-4 sm:grid-cols-[1fr_1.4fr] sm:items-center"><p className="text-sm font-bold">{fact.label}</p><p className="text-sm text-muted-foreground">{fact.value}</p></div>
                ))}
              </div>
              {item.operations && item.operations.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-extrabold">Bahan baku, alat, dan penjualan</h3>
                  <div className="mt-5 space-y-3">
                    {item.operations.map((fact) => (
                      <div key={fact.label} className="grid gap-2 rounded-2xl border border-border p-4 sm:grid-cols-[1fr_1.4fr] sm:items-center"><p className="text-sm font-bold">{fact.label}</p><p className="text-sm text-muted-foreground">{fact.value}</p></div>
                    ))}
                  </div>
                </div>
              )}
              {item.potentials && item.potentials.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-extrabold">Potensi desa yang menopang</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {item.potentials.map((potential) => (
                      <div key={potential} className="flex items-start gap-3 rounded-2xl border border-border bg-secondary p-4">
                        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-background text-primary"><Sprout className="size-5" /></div>
                        <p className="text-sm font-semibold leading-relaxed text-secondary-foreground">{potential}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="sticky top-24 overflow-hidden rounded-[2rem] bg-background shadow-clay">
                <div className="bg-primary px-6 py-5 text-primary-foreground"><p className="font-display text-xl font-bold">Ringkasan investasi</p><p className="mt-1 text-xs text-primary-foreground/65">Kisaran investasi awal</p></div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Modal indikatif</p>
                  <p className="mt-1 font-display text-4xl font-extrabold text-primary">{item.investment}</p>
                  <div className="mt-6 border-t border-border pt-5"><p className="text-sm font-bold">Penggunaan dana</p><ul className="mt-3 space-y-2">{item.investmentUse.map((use) => <li key={use} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{use}</li>)}</ul></div>
                  <Button asChild variant="clay" size="lg" className="mt-7 w-full"><a href="https://klepu-sooko.desa.id/" target="_blank" rel="noreferrer">Nyatakan minat <ArrowRight /></a></Button>
                  {(item.whatsapp || item.mapsUrl) && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {item.whatsapp && <Button asChild variant="outline" size="sm"><a href={item.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>}
                      {item.mapsUrl && <Button asChild variant="outline" size="sm"><a href={item.mapsUrl} target="_blank" rel="noreferrer"><MapPin /> Lokasi</a></Button>}
                    </div>
                  )}
                  <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">Informasi investasi bersifat indikatif. Hubungi pemilik usaha untuk detail kerja sama.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <InfoList title="Tantangan yang diatasi" icon={<CircleAlert />} items={item.risks} tone="caution" />
            <InfoList title="Solusi yang disiapkan" icon={<Target />} items={item.mitigations} tone="green" />
            <InfoList title="Persiapan pengembangan" icon={<Check />} items={item.prerequisites} tone="neutral" />
          </div>
        </section>

        {(item.roles || item.gaps || typeof item.priorityRank === "number") && (
          <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
            {typeof item.priorityRank === "number" && item.priorityTotal && (
              <div className="mb-6 rounded-[1.75rem] bg-primary p-6 text-primary-foreground shadow-clay-dark sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-primary-foreground/70">Urutan pengembangan desa</p>
                    <p className="mt-2 font-display text-2xl font-bold">Prioritas {item.priorityRank} dari {item.priorityTotal} peluang desa</p>
                    <p className="mt-2 max-w-2xl leading-relaxed text-primary-foreground/85">{item.prioritySummary}</p>
                  </div>
                  <div className="flex items-baseline gap-1 rounded-2xl bg-primary-foreground/10 px-6 py-4 text-primary-foreground">
                    <span className="font-display text-6xl font-extrabold">{item.priorityRank}</span>
                    <span className="text-2xl font-semibold opacity-75">/</span>
                    <span className="text-2xl font-semibold opacity-75">{item.priorityTotal}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              {item.roles && item.roles.length > 0 && (
                <div className="rounded-[1.75rem] border border-border bg-card p-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Users /></div>
                  <h2 className="mt-4 font-display text-xl font-bold">Siapa yang menjalankan</h2>
                  <div className="mt-4 space-y-3">
                    {item.roles.map((role) => (
                      <div key={role.label} className="rounded-2xl bg-background p-4"><p className="text-sm font-bold">{role.label}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{role.value}</p></div>
                    ))}
                  </div>
                </div>
              )}
              {item.gaps && item.gaps.length > 0 && (
                <div className="rounded-[1.75rem] border border-border bg-card p-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-muted text-foreground"><ListChecks /></div>
                  <h2 className="mt-4 font-display text-xl font-bold">Penguatan berikutnya</h2>
                  <ul className="mt-4 space-y-3">
                    {item.gaps.map((gap) => (
                      <li key={gap} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {item.videos && item.videos.length > 0 && (
          <section className="border-y border-border bg-card">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
              <p className="font-display text-xs font-bold uppercase text-primary">Galeri</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Video {item.name}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Dokumentasi produk dan proses usaha {item.name}.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {item.videos.map((video, index) => (
                  <video key={video.src} src={video.src} poster={video.poster} autoPlay loop muted playsInline className="aspect-[3/4] w-full rounded-2xl border border-border bg-muted object-cover shadow-clay" aria-label={`Video ${item.name} ${index + 1}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
            <p className="font-display text-xs font-bold uppercase text-primary">Peluang produk</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Peluang pengembangan {item.product}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.opportunityContext}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {item.opportunities.map((opportunity) => (
                <div key={opportunity.name} className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-clay">
                  <p className="font-display text-lg font-bold leading-tight">{opportunity.name}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{opportunity.detail}</p>
                  <p className="mt-5 font-display text-lg font-extrabold text-primary">{opportunity.investment}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <h3 className="font-display text-2xl font-extrabold">Perbandingan kebutuhan modal</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Kisaran modal tiap peluang dibanding modal usaha inti.</p>
              <div className="mt-5">
                <InvestmentChart
                  rows={[
                    { label: `${item.name} (usaha inti)`, value: item.investment, highlight: true },
                    ...item.opportunities.map((opportunity) => ({ label: opportunity.name, value: opportunity.investment })),
                  ]}
                  caption="Nilai dalam juta rupiah dan bersifat indikatif."
                />
              </div>
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