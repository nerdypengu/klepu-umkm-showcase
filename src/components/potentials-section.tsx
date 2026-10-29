import * as React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Sprout } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FadeImage } from "@/components/fade-image";
import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import rempahImage from "@/assets/rempah-rempah.jpg";
import { submitPotentialInterestServerFn, type UmkmPotential } from "@/lib/potentials.functions";

// Shown until the umkm_potentials table is populated, so the section never disappears.
const fallbackPotentials: UmkmPotential[] = [
  {
    id: "",
    slug: "rempah-rempah",
    title: "Rempah-rempah Klepu",
    description:
      "Perkebunan Desa Klepu menghasilkan beragam rempah, tetapi belum ada UMKM yang mengolahnya menjadi produk. Peluang terbuka bagi pelaku usaha atau mitra yang ingin memulai.",
    imageUrl: null,
    ideas: ["Bumbu dan rempah kering kemasan", "Minuman jamu dan wedang rempah", "Wisata edukasi kebun rempah"],
  },
];

export function PotentialsSection({ potentials: fetched }: { potentials: UmkmPotential[] }) {
  const potentials = fetched.length > 0 ? fetched : fallbackPotentials;
  // A lone card spans the full width as a horizontal feature; more cards flow into a grid.
  const single = potentials.length === 1;

  return (
    <section id="peluang" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 sm:px-6 sm:py-16">
      <Reveal>
        <p className="font-display text-xs font-bold uppercase text-primary">Peluang UMKM Baru</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
          Hasil bumi desa yang <Highlight>belum ada pengolahnya</Highlight>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Desa Klepu kaya hasil bumi, tetapi sebagian belum punya UMKM yang mengolahnya. Jadilah{" "}
          <Highlight>yang pertama merintis</Highlight>, atau danai mereka yang siap memulai. Peluang baru akan terus
          kami tambahkan.
        </p>
      </Reveal>

      <div className={cn("mt-8 grid gap-6 sm:mt-9 sm:gap-7", !single && "sm:grid-cols-2 lg:grid-cols-3")}>
        {potentials.map((item, index) => (
          <Reveal key={item.id || item.slug} delay={index * 90} className="h-full">
            <article
              className={cn(
                "flex h-full flex-col rounded-[1.75rem] bg-card p-4 shadow-clay",
                single && "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-6 md:p-5",
              )}
            >
              <div className="overflow-hidden rounded-2xl">
                <FadeImage
                  src={item.imageUrl ?? (item.slug === "rempah-rempah" ? rempahImage : undefined)}
                  alt={item.title}
                  width={800}
                  height={640}
                  className={cn("aspect-[4/3] w-full object-cover", single && "md:h-full md:aspect-auto")}
                />
              </div>
              <div className="flex flex-1 flex-col p-3 md:p-2">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
                  <Sprout className="size-3" aria-hidden /> Belum ada UMKM
                </span>
                <h3 className="mt-3 font-display text-xl font-bold leading-tight sm:text-2xl">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                {item.ideas.length > 0 && (
                  <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                    {item.ideas.map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 border-t border-border pt-3">
                  <PotentialInterestDialog potential={item} />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PotentialInterestDialog({ potential }: { potential: UmkmPotential }) {
  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!potential.id) {
      setError("Peluang ini belum aktif di sistem. Silakan coba lagi nanti.");
      return;
    }
    setIsSubmitting(true);
    const res = await submitPotentialInterestServerFn({
      data: {
        potentialId: potential.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null,
      },
    });
    setIsSubmitting(false);
    if (res.success) setIsSuccess(true);
    else setError(res.error || "Gagal mengirim minat.");
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isSuccess) {
      setIsSuccess(false);
      setFullName("");
      setPhone("");
      setEmail("");
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="clay" className="w-full font-bold">
          Saya mau terlibat <ArrowRight className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-3xl sm:p-8">
        {isSuccess ? (
          <div className="py-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </span>
            <DialogTitle className="font-display text-2xl font-bold">Minat Anda sudah kami terima</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Terima kasih. Kami akan segera menghubungi Anda.
            </DialogDescription>
            <div className="mt-6">
              <Button variant="clay" onClick={() => handleOpenChange(false)}>
                Tutup
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-xl font-bold">Minat pada {potential.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tinggalkan kontak Anda, pengelola akan menghubungi untuk membahas peluang ini.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="my-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor={`pi-name-${potential.id}`} className="text-xs font-semibold">
                  Nama lengkap *
                </Label>
                <Input
                  id={`pi-name-${potential.id}`}
                  required
                  maxLength={120}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`pi-phone-${potential.id}`} className="text-xs font-semibold">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id={`pi-phone-${potential.id}`}
                    type="tel"
                    required
                    maxLength={40}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`pi-email-${potential.id}`} className="text-xs font-semibold">
                    Email
                  </Label>
                  <Input
                    id={`pi-email-${potential.id}`}
                    type="email"
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`pi-notes-${potential.id}`} className="text-xs font-semibold">
                  Catatan
                </Label>
                <Textarea
                  id={`pi-notes-${potential.id}`}
                  rows={3}
                  maxLength={1500}
                  placeholder="Bentuk keterlibatan yang Anda bayangkan: merintis usaha, mendanai, membeli hasil olahan, dll."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
              <Button type="submit" variant="clay" disabled={isSubmitting} className="w-full font-bold">
                {isSubmitting ? "Mengirim..." : "Kirim Minat"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
