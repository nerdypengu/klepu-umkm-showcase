import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Briefcase, LogOut, Menu, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { hash: "visi", label: "Visi" },
  { hash: "umkm", label: "UMKM" },
  { hash: "peluang", label: "Peluang" },
  { hash: "grosir", label: "Grosir" },
  { hash: "bermitra", label: "Cara Bermitra" },
] as const;

const VILLAGE_URL = "https://klepu-sooko.desa.id/";

// Highlights the nav link of the home-page section currently in view.
function useActiveSection(enabled: boolean) {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const sections = navItems
      .map((item) => document.getElementById(item.hash))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActive(visible[0]!.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

function ScrollProgress() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-primary" />
    </div>
  );
}

export function SiteHeader() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const active = useActiveSection(pathname === "/");

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Lapak UMKM Klepu, beranda">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-clay-dark">
            K
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold">Lapak UMKM Klepu</span>
            <span className="block text-[11px] text-muted-foreground">Desa Klepu · Sooko</span>
          </span>
        </Link>

        <nav
          className="mx-auto hidden items-center gap-0.5 rounded-full border border-border/80 bg-card/70 p-1 text-sm font-semibold lg:flex"
          aria-label="Navigasi utama"
        >
          {navItems.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              aria-current={active === item.hash ? "location" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition-colors",
                active === item.hash
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={VILLAGE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Website Desa <ArrowUpRight className="size-3.5" />
          </a>
          <span className="h-5 w-px bg-border" aria-hidden />
          <AccountControls />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Buka menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-lg font-bold">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col" aria-label="Navigasi seluler">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.hash}>
                    <Link
                      to="/"
                      hash={item.hash}
                      className="border-b border-border/70 py-3 text-sm font-semibold text-foreground/80 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <a
                  href={VILLAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 border-b border-border/70 py-3 text-sm font-semibold text-muted-foreground hover:text-primary"
                >
                  Website Desa <ArrowUpRight className="size-3.5" />
                </a>
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <AccountControls stacked />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}

function AccountControls({ stacked = false }: { stacked?: boolean }) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className={cn("flex items-center gap-2", stacked && "flex-col items-stretch")}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/register">Daftar</Link>
        </Button>
        <Button asChild variant="clay" size="sm">
          <Link to="/login">Masuk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", stacked && "flex-col items-stretch")}>
      {isAdmin ? (
        <Button asChild variant="clay" size="sm">
          <Link to="/admin">
            <ShieldCheck className="size-4" /> Admin
          </Link>
        </Button>
      ) : (
        <Button asChild variant="clay" size="sm">
          <Link to="/mitra">
            <Briefcase className="size-4" /> Minat Saya
          </Link>
        </Button>
      )}
      <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs">
        <User className="size-3.5 text-primary" />
        <span className="max-w-[9rem] truncate font-semibold">{user?.fullName}</span>
        <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-bold uppercase text-primary">
          {user?.role === "admin" ? "Admin" : user?.mitraType}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout} title="Keluar" className="text-muted-foreground hover:text-destructive">
        <LogOut className="size-4" />
        {stacked && "Keluar"}
      </Button>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3" aria-label="Lapak UMKM Klepu, beranda">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-clay-dark">
              K
            </span>
            <span className="font-display text-base font-bold">Lapak UMKM Klepu</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Etalase UMKM dan peluang kemitraan Desa Klepu, Kecamatan Sooko, Kabupaten Ponorogo, Jawa Timur.
          </p>
        </div>

        <FooterColumn title="Jelajahi">
          {navItems.map((item) => (
            <Link key={item.hash} to="/" hash={item.hash} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Akun Mitra">
          <Link to="/login" className="hover:text-primary">
            Masuk
          </Link>
          <Link to="/register" className="hover:text-primary">
            Daftar Mitra
          </Link>
        </FooterColumn>

        <FooterColumn title="Tautan">
          <a href={VILLAGE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
            Website Desa Klepu <ArrowUpRight className="size-3.5" />
          </a>
        </FooterColumn>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Lapak UMKM Desa Klepu. Hak cipta dilindungi.</p>
          <p className="md:text-right">Nilai investasi bersifat indikatif, bukan realisasi atau jaminan hasil.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase text-foreground">{title}</h2>
      <nav className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground" aria-label={title}>
        {children}
      </nav>
    </div>
  );
}
