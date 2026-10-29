import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";

const dataGroups = [
  "Fakta usaha",
  "Produk dan harga",
  "Kebutuhan modal",
  "Rencana penggunaan dana",
  "Skor kelayakan",
  "Simulasi ROI",
  "Target pasar",
  "Operasional",
  "Peran pengelola",
  "Risiko dan mitigasi",
  "Prasyarat investasi",
  "Peluang pengembangan",
  "Foto dan video proses",
  "Kontak dan lokasi",
];

export function UmkmSummarySection() {
  return (
    <section id="data" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="font-display text-xs font-bold uppercase text-primary">Data yang Tersedia</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Sebelum menanam modal, <Highlight>kenali datanya</Highlight>.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Setiap UMKM punya profil dengan data berikut, siap Anda periksa. Seluruh angka bersifat indikatif, bukan realisasi atau jaminan hasil.
          </p>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {dataGroups.map((label, index) => (
            <li key={label} className="border-b border-border">
              <Reveal delay={(index % 2) * 80 + Math.floor(index / 2) * 40} className="flex items-baseline gap-3 py-3 text-sm font-semibold">
                <span className="w-6 font-display text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
