import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Daftar sebagai mitra", detail: "Buat akun sebagai perorangan, organisasi, atau perusahaan." },
  { title: "Pilih UMKM", detail: "Telusuri profil dan pilih usaha yang sesuai minat Anda, atau ajukan permintaan grosir tanpa akun." },
  { title: "Ajukan minat", detail: "Sampaikan bentuk kerja sama, objek, dan estimasi nominal yang Anda rencanakan." },
  { title: "Diskusi dengan pengelola", detail: "Admin desa menghubungi Anda melalui WhatsApp untuk tindak lanjut." },
];

export function PartnerStepsSection() {
  return (
    <section id="bermitra" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
        <div>
          <p className="font-display text-xs font-bold uppercase text-primary">Cara Bermitra</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Empat langkah menuju <Highlight>kerja sama nyata</Highlight>.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Menyatakan minat tidak mengikat Anda. Seluruh kesepakatan dibahas langsung dengan pengelola UMKM.
          </p>
          <Button asChild variant="clay" size="lg" className="mt-6">
            <Link to="/register">Daftar Jadi Mitra</Link>
          </Button>
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
