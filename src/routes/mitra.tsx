import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { getMyMinatListServerFn, type MyMinatItem } from "@/lib/minat.functions";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  Plus,
  Search,
  Building2,
  User,
  Building,
  Phone,
  MapPin,
  RefreshCw,
  Sparkles,
  ArrowRight,
  XCircle,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/mitra")({
  component: MitraDashboardPage,
});

function MitraDashboardPage() {
  const { user, token, isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [minats, setMinats] = React.useState<MyMinatItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const loadData = React.useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await getMyMinatListServerFn({ data: { token } });
      if (res.success && res.data) {
        setMinats(res.data);
      }
    } catch (e) {
      console.error("Gagal memuat minat mitra:", e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        navigate({ to: "/login" });
      } else if (isAdmin) {
        navigate({ to: "/admin" });
      } else {
        loadData();
      }
    }
  }, [authLoading, isLoggedIn, isAdmin, navigate, loadData]);

  const formatRupiah = (val?: number | null) => {
    if (!val) return "Belum ditentukan";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (val: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(val));

  const filteredMinats = minats.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.umkmName.toLowerCase().includes(q) ||
      item.umkmCategory.toLowerCase().includes(q) ||
      (item.targetItem && item.targetItem.toLowerCase().includes(q)) ||
      item.notes.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MyMinatItem["status"]) => {
    switch (status) {
      case "menunggu_konfirmasi":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Clock className="size-3.5" /> Menunggu Konfirmasi
          </span>
        );
      case "dalam_diskusi":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
            <MessageSquare className="size-3.5" /> Dalam Diskusi
          </span>
        );
      case "disetujui":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" /> Disetujui
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
            <XCircle className="size-3.5" /> Ditolak
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
            <Sparkles className="size-3.5" /> Selesai
          </span>
        );
      default:
        return null;
    }
  };

  const getMitraTypeLabel = (type?: string) => {
    if (type === "organisasi") return "Organisasi / Komunitas";
    if (type === "persero") return "Perusahaan / PT / CV";
    return "Personal / Individu";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top Profile Banner */}
          <div className="mb-8 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-clay sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-clay">
                  {user?.mitraType === "organisasi" ? (
                    <Building2 className="size-7" />
                  ) : user?.mitraType === "persero" ? (
                    <Building className="size-7" />
                  ) : (
                    <User className="size-7" />
                  )}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      {user?.fullName}
                    </h1>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {getMitraTypeLabel(user?.mitraType)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    @{user?.username} {user?.organizationName && `· ${user.organizationName}`}
                    {user?.organizationPosition && ` (${user.organizationPosition})`}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5 text-primary" /> {user?.phone}
                    </span>
                    {user?.address && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-primary" /> {user.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="clay" size="sm" className="rounded-xl font-semibold">
                  <Link to="/" hash="katalog">
                    <Plus className="size-4" /> Ajukan Minat Baru
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading} className="rounded-xl">
                  <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  Segarkan
                </Button>
              </div>
            </div>
          </div>

          {/* Header & Filter Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                Riwayat Minat Investasi ({minats.length})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pantau proses verifikasi dan tanggapan pengelola Desa Klepu terhadap proposal Anda
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari proposal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl pl-9 text-xs"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                <option value="dalam_diskusi">Dalam Diskusi</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Minat List */}
          {isLoading ? (
            <div className="rounded-3xl border border-border/80 bg-card p-12 text-center shadow-clay">
              <RefreshCw className="mx-auto size-6 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Memuat data minat investasi...</p>
            </div>
          ) : filteredMinats.length === 0 ? (
            <div className="rounded-3xl border border-border/80 bg-card p-12 text-center shadow-clay">
              <Briefcase className="mx-auto size-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-bold">Belum Ada Pengajuan Minat</h3>
              <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
                {minats.length === 0
                  ? "Anda belum mengajukan minat investasi untuk UMKM Desa Klepu. Jelajahi katalog dan temukan potensi usaha yang siap bertumbuh."
                  : "Tidak ada pengajuan minat investasi yang sesuai dengan filter pencarian Anda."}
              </p>
              {minats.length === 0 && (
                <Button asChild variant="clay" size="sm" className="mt-6 rounded-xl font-semibold">
                  <Link to="/" hash="katalog">
                    Jelajahi Produk & Peluang UMKM <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredMinats.map((m) => (
                <div
                  key={m.id}
                  className="overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-clay transition-all hover:border-primary/40"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      {m.umkmImage ? (
                        <img
                          src={m.umkmImage}
                          alt={m.umkmName}
                          className="size-16 shrink-0 rounded-2xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-secondary text-primary font-bold">
                          {m.umkmName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-foreground">
                            {m.umkmName}
                          </h3>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                            {m.umkmCategory}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Diajukan pada {formatDate(m.createdAt)}
                        </p>
                        {m.umkmSlug && (
                          <Link
                            to="/umkm/$slug"
                            params={{ slug: m.umkmSlug }}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            Lihat Profil Lengkap UMKM <ExternalLink className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div>{getStatusBadge(m.status)}</div>
                  </div>

                  {/* Detail Grid */}
                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-muted/30 p-4 text-xs sm:grid-cols-3">
                    <div>
                      <span className="block text-[11px] font-medium text-muted-foreground">
                        Bentuk Kemitraan / Investasi
                      </span>
                      <span className="mt-0.5 block font-bold capitalize text-foreground">
                        {m.investmentType.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-muted-foreground">
                        Objek / Target Kebutuhan
                      </span>
                      <span className="mt-0.5 block font-bold text-foreground">
                        {m.targetItem || "Investasi Usaha Umum"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-muted-foreground">
                        Perkiraan Nilai Investasi
                      </span>
                      <span className="mt-0.5 block font-bold text-primary">
                        {formatRupiah(m.nominalInvestment)}
                      </span>
                    </div>
                  </div>

                  {/* Catatan Mitra */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Uraian Kebutuhan & Minat:
                    </span>
                    <p className="mt-1 rounded-xl border border-border/60 bg-background/50 p-3 text-xs leading-relaxed text-foreground/90">
                      {m.notes}
                    </p>
                  </div>

                  {/* Proposal File */}
                  {m.proposalUrl && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-muted-foreground">Dokumen Proposal:</span>
                      <a
                        href={m.proposalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10"
                      >
                        <FileText className="size-3.5" />
                        <span className="max-w-[200px] truncate">{m.proposalFilename || "Lihat Proposal"}</span>
                        <Download className="size-3" />
                      </a>
                    </div>
                  )}

                  {/* Admin Feedback Box */}
                  {m.adminNotes && (
                    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <MessageSquare className="size-4" />
                        <span>Tanggapan Pengelola Desa Klepu:</span>
                      </div>
                      <p className="mt-1.5 leading-relaxed text-foreground/90">
                        {m.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
