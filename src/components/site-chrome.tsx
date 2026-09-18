import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Lapak UMKM Klepu, beranda">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-clay-dark">K</span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold">Lapak UMKM Klepu</span>
            <span className="block text-[11px] text-muted-foreground">Desa Klepu · Sooko</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Navigasi utama">
          <Link to="/" hash="beranda" className="rounded-xl px-3 py-2 text-primary hover:bg-secondary">Beranda</Link>
          <Link to="/" hash="umkm" className="rounded-xl px-3 py-2 text-primary hover:bg-secondary">UMKM</Link>
          <Button asChild variant="clay" size="sm" className="ml-2">
            <a href="https://klepu-sooko.desa.id/" target="_blank" rel="noreferrer">Desa Klepu <ArrowUpRight /></a>
          </Button>
        </nav>
        <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Lihat daftar UMKM">
          <Link to="/" hash="umkm"><Menu /></Link>
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-foreground/75">Lapak UMKM Desa Klepu · Sooko, Ponorogo</p>
        <p className="max-w-xl text-xs md:text-right">Nilai investasi bersifat indikatif dan perlu verifikasi—bukan realisasi atau jaminan hasil.</p>
      </div>
    </footer>
  );
}