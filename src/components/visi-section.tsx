import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";

const steps = [
  { title: "Cari pembeli", detail: "Bangun pesanan satuan dan grosir, serta hubungan dengan distributor." },
  { title: "Penguatan produksi", detail: "Identifikasi kebutuhan bahan baku, peralatan, dan kualitas kemasan." },
  { title: "Modal sesuai kebutuhan", detail: "Pendanaan datang dengan rencana penggunaan yang bisa Anda periksa." },
  { title: "Tumbuh terukur", detail: "Pantau penjualan, pembelian ulang, kapasitas, dan kemitraan baru." },
];

export function VisiSection() {
  return (
    <section id="visi" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
        <div>
          <p className="font-display text-xs font-bold uppercase text-primary">Visi Pengembangan</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Dari produksi lokal menuju <Highlight>jaringan bisnis</Highlight>.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Lapak ini menghubungkan pelaku usaha dengan pembeli, distributor, dan calon mitra pendanaan. Langkah pertama
            adalah pasar Ponorogo, lalu <Highlight>menjangkau lebih luas</Highlight>.
          </p>
        </div>
        </Reveal>
        <ol className="divide-y divide-border border-y border-border">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 100} className="flex gap-5 py-5">
              <span className="w-8 shrink-0 font-display text-xl font-extrabold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold leading-snug">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
