import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const VILLAGE_URL = "https://klepu-sooko.desa.id/";

export function VillageBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20">
      <Reveal>
        <div className="flex flex-col gap-6 rounded-[2rem] bg-primary p-7 text-primary-foreground shadow-clay-dark sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-xs font-bold uppercase text-primary-foreground/80">Website Resmi Desa</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Kenali Desa Klepu <span className="text-[1.18em] font-black">lebih dekat.</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              Baca berita terbaru dan profil Desa Klepu, Kecamatan Sooko, di website resmi desa.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="h-12 shrink-0 rounded-2xl px-7 text-base font-bold">
            <a href={VILLAGE_URL} target="_blank" rel="noreferrer">
              Kunjungi Website Desa <ArrowUpRight className="size-5" />
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
