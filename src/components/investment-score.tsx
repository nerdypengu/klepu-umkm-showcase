import { Boxes, Cog, Sprout, Truck, Wallet } from "lucide-react";
import type { InvestmentScore as Score } from "@/lib/umkm-data";
import { scoreTotal } from "@/lib/umkm-data";

const ITEMS: { key: keyof Score; label: string; icon: typeof Truck }[] = [
  { key: "distribution", label: "Distribusi", icon: Truck },
  { key: "technology", label: "Teknologi & alat", icon: Cog },
  { key: "market", label: "Pasar", icon: Boxes },
  { key: "finance", label: "Keuangan", icon: Wallet },
  { key: "materials", label: "Bahan baku", icon: Sprout },
];

function verdict(total: number) {
  if (total >= 80) return "Sangat siap untuk investasi";
  if (total >= 70) return "Siap untuk investasi";
  if (total >= 60) return "Cukup siap, potensi tumbuh cepat";
  return "Berkembang, cocok untuk pendampingan";
}

export function InvestmentScoreCard({ score }: { score: Score }) {
  const total = scoreTotal(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-[1.75rem] bg-primary p-6 text-primary-foreground shadow-clay-dark sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto size-36 shrink-0 sm:mx-0">
          <svg viewBox="0 0 130 130" className="size-full -rotate-90">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="14" />
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(total / 100) * circumference} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-4xl font-extrabold leading-none">{total}</p>
              <p className="text-xs font-semibold text-primary-foreground/70">/ 100</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase text-primary-foreground/70">Skor kesiapan investasi</p>
          <p className="mt-1 font-display text-2xl font-bold">{verdict(total)}</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {ITEMS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="size-4 shrink-0 opacity-80" />
                <span className="w-28 shrink-0 text-xs font-semibold">{label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-primary-foreground/20">
                  <span className="block h-full rounded-full bg-primary-foreground" style={{ width: `${score[key]}%` }} />
                </span>
                <span className="w-7 shrink-0 text-right text-xs font-bold">{score[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-primary-foreground/75">
        Skor dihitung dari lima aspek: kemudahan distribusi, teknologi dan alat, pasar, kesiapan keuangan, serta ketersediaan bahan baku. Angka bersifat indikatif sebagai gambaran awal bagi calon investor.
      </p>
    </div>
  );
}
