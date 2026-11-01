import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { AdminUmkmEditor } from "@/components/admin-umkm-dialog";
import { AdminMinatDetailDialog } from "@/components/admin-minat-detail-dialog";
import { fetchUmkmList } from "@/lib/umkm.functions";
import { scoreTotal, type Umkm } from "@/lib/umkm-data";
import {
  getAdminDashboardStatsServerFn,
  getAdminMitraListServerFn,
  getAdminMinatListServerFn,
  getAdminWholesaleListServerFn,
  updateMinatStatusServerFn,
  updateWholesaleStatusServerFn,
  saveUmkmServerFn,
  deleteUmkmServerFn,
  type AdminDashboardStats,
  type AdminMitraItem,
  type AdminMinatItem,
  type AdminWholesaleItem,
} from "@/lib/admin.functions";
import {
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Building,
  ExternalLink,
  Phone,
  RefreshCw,
  FileText,
  Download,
  Package,
  Mail,
  Store,
  Edit3,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user, token, isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<"overview" | "minat" | "grosir" | "mitra" | "umkm">("overview");
  const [stats, setStats] = React.useState<AdminDashboardStats | null>(null);
  const [mitras, setMitras] = React.useState<AdminMitraItem[]>([]);
  const [minats, setMinats] = React.useState<AdminMinatItem[]>([]);
  const [wholesales, setWholesales] = React.useState<AdminWholesaleItem[]>([]);
  const [umkms, setUmkms] = React.useState<Umkm[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<string | null>(null);

  // Filters
  const [searchMinat, setSearchMinat] = React.useState("");
  const [filterMinatStatus, setFilterMinatStatus] = React.useState<string>("all");
  const [searchMitra, setSearchMitra] = React.useState("");
  const [filterMitraType, setFilterMitraType] = React.useState<string>("all");
  const [searchWholesale, setSearchWholesale] = React.useState("");
  const [filterWholesaleStatus, setFilterWholesaleStatus] = React.useState<string>("all");
  const [searchUmkm, setSearchUmkm] = React.useState("");
  const [filterUmkmCategory, setFilterUmkmCategory] = React.useState<string>("all");

  // UMKM CRUD page state (1 halaman penuh)
  const [isEditingUmkm, setIsEditingUmkm] = React.useState(false);
  const [editingUmkm, setEditingUmkm] = React.useState<Partial<Umkm> | null>(null);
  const [isSavingUmkm, setIsSavingUmkm] = React.useState(false);
  const [umkmFormError, setUmkmFormError] = React.useState<string | null>(null);

  // Minat Detail modal state
  const [selectedMinat, setSelectedMinat] = React.useState<AdminMinatItem | null>(null);

  const loadData = React.useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsRes, mitrasRes, minatsRes, wholesalesRes, umkmList] = await Promise.all([
        getAdminDashboardStatsServerFn({ data: { adminToken: token } }),
        getAdminMitraListServerFn({ data: { adminToken: token } }),
        getAdminMinatListServerFn({ data: { adminToken: token } }),
        getAdminWholesaleListServerFn({ data: { adminToken: token } }),
        fetchUmkmList().catch(() => []),
      ]);

      if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      if (mitrasRes.success && mitrasRes.mitras) setMitras(mitrasRes.mitras);
      if (minatsRes.success && minatsRes.minats) setMinats(minatsRes.minats);
      if (wholesalesRes.success && wholesalesRes.requests) setWholesales(wholesalesRes.requests);
      if (umkmList) setUmkms(umkmList);
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn || !isAdmin || !token) {
        navigate({ to: "/login" });
      } else {
        loadData();
      }
    }
  }, [authLoading, isLoggedIn, isAdmin, token, navigate, loadData]);

  const handleUpdateStatus = async (minatId: string, newStatus: string) => {
    if (!token) return;
    setIsUpdatingStatus(minatId);
    try {
      const res = await updateMinatStatusServerFn({ data: { adminToken: token, minatId, status: newStatus } });
      if (res.success) {
        setMinats((prev) =>
          prev.map((item) =>
            item.id === minatId ? { ...item, status: newStatus as AdminMinatItem["status"] } : item,
          ),
        );
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSaveMinatNotes = async (minatId: string, status: string, notes: string) => {
    if (!token) return;
    setIsUpdatingStatus(minatId);
    try {
      const res = await updateMinatStatusServerFn({
        data: {
          adminToken: token,
          minatId,
          status,
          adminNotes: notes,
        },
      });
      if (res.success) {
        setMinats((prev) =>
          prev.map((item) =>
            item.id === minatId ? { ...item, status: status as AdminMinatItem["status"], adminNotes: notes } : item,
          ),
        );
        if (selectedMinat?.id === minatId) {
          setSelectedMinat((prev) => (prev ? { ...prev, status: status as AdminMinatItem["status"], adminNotes: notes } : null));
        }
        toast.success("Status minat berhasil diperbarui", {
          description: `Status diubah menjadi: ${status.replace(/_/g, " ")}`,
        });
      } else {
        toast.error("Gagal memperbarui status minat", {
          description: res.error || "Terjadi kesalahan pada server",
        });
      }
    } catch (e) {
      console.error("Gagal update status & catatan:", e);
      toast.error("Terjadi kesalahan saat memperbarui status minat");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSaveUmkm = async (formData: Partial<Umkm>) => {
    if (!token) return;
    setIsSavingUmkm(true);
    setUmkmFormError(null);
    try {
      const res = await saveUmkmServerFn({
        data: {
          adminToken: token,
          umkm: formData,
        },
      });
      if (res.success) {
        setIsEditingUmkm(false);
        setEditingUmkm(null);
        const updated = await fetchUmkmList();
        setUmkms(updated);
        toast.success("Data UMKM berhasil disimpan!", {
          description: `Profil "${formData.name || "UMKM"}" dan peringkat skor kelayakan otomatis telah diperbarui.`,
        });
      } else {
        const errMsg = res.error || "Gagal menyimpan data UMKM";
        setUmkmFormError(errMsg);
        toast.error("Gagal menyimpan data UMKM", {
          description: errMsg,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan";
      setUmkmFormError(errMsg);
      toast.error("Terjadi kesalahan sistem", {
        description: errMsg,
      });
    } finally {
      setIsSavingUmkm(false);
    }
  };

  const handleDeleteUmkm = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Apakah Anda yakin ingin menonaktifkan / menghapus UMKM "${name}"?`)) {
      return;
    }
    try {
      const res = await deleteUmkmServerFn({ data: { adminToken: token, id } });
      if (res.success) {
        const updated = await fetchUmkmList();
        setUmkms(updated);
        toast.success(`UMKM "${name}" berhasil dinonaktifkan`, {
          description: "Data UMKM telah dihapus dari daftar aktif.",
        });
      } else {
        toast.error("Gagal menonaktifkan UMKM", {
          description: res.error || "Terjadi kesalahan server",
        });
      }
    } catch (e) {
      toast.error("Terjadi kesalahan saat menonaktifkan UMKM");
    }
  };

  const handleUpdateWholesaleStatus = async (requestId: string, newStatus: string) => {
    if (!token) return;
    setIsUpdatingStatus(requestId);
    try {
      const res = await updateWholesaleStatusServerFn({ data: { adminToken: token, requestId, status: newStatus } });
      if (res.success) {
        setWholesales((prev) =>
          prev.map((item) =>
            item.id === requestId ? { ...item, status: newStatus as AdminWholesaleItem["status"] } : item,
          ),
        );
        toast.success("Status pesanan grosir diperbarui", {
          description: `Status diubah menjadi: ${newStatus}`,
        });
      } else {
        toast.error("Gagal memperbarui status grosir");
      }
    } catch (e) {
      console.error("Failed to update wholesale status:", e);
      toast.error("Terjadi kesalahan saat memperbarui status grosir");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const formatDate = (val: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(val));

  const formatRupiah = (val?: number | null) => {
    if (!val) return "Rp0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  // Filtered lists
  const filteredMinats = minats.filter((item) => {
    const matchesSearch =
      item.mitraFullName.toLowerCase().includes(searchMinat.toLowerCase()) ||
      item.mitraUsername.toLowerCase().includes(searchMinat.toLowerCase()) ||
      item.umkmName.toLowerCase().includes(searchMinat.toLowerCase()) ||
      (item.organizationName && item.organizationName.toLowerCase().includes(searchMinat.toLowerCase()));
    const matchesStatus = filterMinatStatus === "all" || item.status === filterMinatStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredMitras = mitras.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchMitra.toLowerCase()) ||
      item.username.toLowerCase().includes(searchMitra.toLowerCase()) ||
      (item.organizationName && item.organizationName.toLowerCase().includes(searchMitra.toLowerCase())) ||
      item.phone.includes(searchMitra);
    const matchesType = filterMitraType === "all" || item.mitraType === filterMitraType;
    return matchesSearch && matchesType;
  });

  const filteredWholesales = wholesales.filter((item) => {
    const q = searchWholesale.toLowerCase();
    const matchesSearch =
      item.fullName.toLowerCase().includes(q) ||
      (item.organizationName && item.organizationName.toLowerCase().includes(q)) ||
      item.phone.includes(searchWholesale) ||
      item.items.some((product) => product.productName.toLowerCase().includes(q));
    const matchesStatus = filterWholesaleStatus === "all" || item.status === filterWholesaleStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUmkms = umkms.filter((u) => {
    const q = searchUmkm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.owner.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q);
    const matchesCategory = filterUmkmCategory === "all" || u.category === filterUmkmCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading || (!isAdmin && isLoggedIn)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-semibold text-muted-foreground">Memverifikasi hak akses admin...</p>
      </div>
    );
  }

  // Tampilan 1 Halaman Penuh untuk Tambah & Edit UMKM
  if (isEditingUmkm) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 px-4 py-8 sm:px-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <AdminUmkmEditor
              umkm={editingUmkm}
              onBack={() => {
                setIsEditingUmkm(false);
                setEditingUmkm(null);
                setUmkmFormError(null);
              }}
              onSave={handleSaveUmkm}
              isSaving={isSavingUmkm}
              error={umkmFormError}
            />
          </div>
        </main>
        <SiteFooter compact />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-clay">
                  <ShieldCheck className="size-5" />
                </span>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard Admin Klepu</h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Pengawasan komprehensif mitra, penawaran minat investasi, dan aktivitas UMKM desa.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading} className="gap-2 self-start">
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} /> Muat Ulang
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="size-4" /> Ringkasan & Statistik
            </button>
            <button
              onClick={() => setActiveTab("minat")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "minat"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="size-4" /> Minat Investasi ({minats.length})
            </button>
            <button
              onClick={() => setActiveTab("grosir")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "grosir"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="size-4" /> Permintaan Grosir ({wholesales.length})
            </button>
            <button
              onClick={() => setActiveTab("mitra")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "mitra"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-4" /> Data Mitra ({mitras.length})
            </button>
            <button
              onClick={() => setActiveTab("umkm")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "umkm"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="size-4" /> Kelola UMKM ({umkms.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total UMKM */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-clay">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase tracking-wider">Total UMKM</span>
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div className="mt-3 font-display text-3xl font-extrabold text-foreground">
                    {stats?.totalUmkm ?? 7}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Entitas usaha aktif terdaftar</p>
                </div>

                {/* Total Mitra */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-clay">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Mitra</span>
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="mt-3 font-display text-3xl font-extrabold text-foreground">
                    {stats?.totalMitra ?? mitras.length}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stats?.mitraPersonal ?? 0} Personal · {stats?.mitraOrganisasi ?? 0} Org · {stats?.mitraPersero ?? 0} Persero
                  </p>
                </div>

                {/* Total Minat */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-clay">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase tracking-wider">Proposal Minat</span>
                    <Briefcase className="size-5 text-primary" />
                  </div>
                  <div className="mt-3 font-display text-3xl font-extrabold text-foreground">
                    {stats?.totalMinat ?? minats.length}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stats?.minatMenunggu ?? 0} Baru · {stats?.minatDiskusi ?? 0} Diskusi · {stats?.minatDisetujui ?? 0} Disetujui
                  </p>
                </div>

                {/* Total Nominal Investasi */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-clay">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Estimasi Modal</span>
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                  <div className="mt-3 font-display text-2xl font-extrabold text-primary">
                    {formatRupiah(stats?.totalNominalInvestasi)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Akumulasi minat investasi</p>
                </div>
              </div>

              {/* Quick Preview Minat Terkini */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-clay">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold">Aktivitas Minat Investasi Terbaru</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("minat")}>
                    Lihat Semua
                  </Button>
                </div>

                {minats.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada proposal minat investasi yang diajukan oleh mitra.
                  </p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {minats.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{m.mitraFullName}</span>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                              {m.mitraType}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tertarik pada <strong className="text-foreground">{m.umkmName}</strong> · Tipe: {m.investmentType}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary">{formatRupiah(m.nominalInvestment)}</span>
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                            {m.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MINAT INVESTASI */}
          {activeTab === "minat" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari mitra / UMKM..."
                    value={searchMinat}
                    onChange={(e) => setSearchMinat(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <select
                    value={filterMinatStatus}
                    onChange={(e) => setFilterMinatStatus(e.target.value)}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
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

              {filteredMinats.length === 0 ? (
                <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-sm text-muted-foreground shadow-clay">
                  Tidak ada data minat investasi yang sesuai kriteria.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-clay">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Mitra & Organisasi</th>
                        <th className="px-4 py-3">UMKM Tujuan</th>
                        <th className="px-4 py-3">Bentuk & Objek Investasi</th>
                        <th className="px-4 py-3">Nominal & Dokumen</th>
                        <th className="px-4 py-3">Catatan Proposal</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredMinats.map((m) => (
                        <tr key={m.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{m.mitraFullName}</div>
                            <div className="text-[11px] text-muted-foreground">@{m.mitraUsername}</div>
                            {m.organizationName && (
                              <div className="text-[11px] font-medium text-primary">{m.organizationName}</div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{m.umkmName}</div>
                            <div className="text-[11px] text-muted-foreground">{m.umkmCategory}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="capitalize font-semibold text-foreground">{m.investmentType.replace("_", " ")}</div>
                            {m.targetItem && (
                              <div className="mt-0.5 text-[11px] text-muted-foreground">
                                Objek: <span className="font-medium text-foreground">{m.targetItem}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-primary">{formatRupiah(m.nominalInvestment)}</div>
                            {m.proposalUrl ? (
                              <a
                                href={m.proposalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20"
                              >
                                <FileText className="size-3" />
                                <span className="max-w-[120px] truncate">{m.proposalFilename || "Proposal"}</span>
                                <Download className="size-2.5" />
                              </a>
                            ) : m.proposalFilename ? (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                <FileText className="size-3" /> {m.proposalFilename}
                              </span>
                            ) : null}
                          </td>
                          <td className="max-w-xs px-4 py-3.5">
                            <p className="line-clamp-2 text-foreground/80">{m.notes}</p>
                            {m.adminNotes && (
                              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-primary">
                                <MessageSquare className="size-3" /> Respon admin tersedia
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={m.status}
                              disabled={isUpdatingStatus === m.id}
                              onChange={(e) => handleUpdateStatus(m.id, e.target.value)}
                              className="rounded-lg border border-input bg-background px-2 py-1 text-xs font-medium"
                            >
                              <option value="menunggu_konfirmasi">Menunggu</option>
                              <option value="dalam_diskusi">Diskusi</option>
                              <option value="disetujui">Disetujui</option>
                              <option value="ditolak">Ditolak</option>
                              <option value="selesai">Selesai</option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMinat(m)}
                                className="h-8 gap-1 text-xs"
                              >
                                <Eye className="size-3.5" /> Detail
                              </Button>
                              <Button asChild variant="clay" size="sm" className="h-8 gap-1 text-xs">
                                <a
                                  href={`https://wa.me/${m.contactPhone.replace(/^0/, "62")}?text=Halo%20${encodeURIComponent(
                                    m.mitraFullName,
                                  )}%2C%20terima%20kasih%20telah%20mengajukan%20minat%20investasi%20untuk%20${encodeURIComponent(
                                    m.umkmName,
                                  )}%20melalui%20Lapak%20UMKM%20Desa%20Klepu.`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Phone className="size-3.5" /> WhatsApp
                                </a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: PERMINTAAN GROSIR */}
          {activeTab === "grosir" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari pemohon / produk..."
                    value={searchWholesale}
                    onChange={(e) => setSearchWholesale(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <select
                    value={filterWholesaleStatus}
                    onChange={(e) => setFilterWholesaleStatus(e.target.value)}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="all">Semua Status</option>
                    <option value="baru">Baru</option>
                    <option value="dihubungi">Sudah Dihubungi</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {filteredWholesales.length === 0 ? (
                <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-sm text-muted-foreground shadow-clay">
                  {wholesales.length === 0
                    ? "Belum ada permintaan grosir yang masuk."
                    : "Tidak ada permintaan grosir yang sesuai kriteria."}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-clay">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Pemohon</th>
                        <th className="px-4 py-3">Kontak</th>
                        <th className="px-4 py-3">Produk Dibutuhkan</th>
                        <th className="px-4 py-3">Catatan</th>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredWholesales.map((w) => (
                        <tr key={w.id} className="align-top hover:bg-muted/20">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{w.fullName}</div>
                            <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                              {w.requesterType === "organisasi" ? "Organisasi" : "Perorangan"}
                            </span>
                            {w.organizationName && (
                              <div className="mt-0.5 text-[11px] font-medium text-primary">{w.organizationName}</div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="inline-flex items-center gap-1 font-semibold text-foreground">
                              <Phone className="size-3 text-muted-foreground" /> {w.phone}
                            </div>
                            {w.email && (
                              <a
                                href={`mailto:${w.email}`}
                                className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
                              >
                                <Mail className="size-3" /> {w.email}
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <ul className="space-y-0.5">
                              {w.items.map((product) => (
                                <li key={product.id} className="text-foreground">
                                  <span className="font-bold text-primary">
                                    {Number(product.quantity).toLocaleString("id-ID")} {product.unit}
                                  </span>{" "}
                                  · {product.productName}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="max-w-xs px-4 py-3.5">
                            {w.notes ? (
                              <p className="line-clamp-3 text-foreground/80" title={w.notes}>
                                {w.notes}
                              </p>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                            {formatDate(w.createdAt)}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={w.status}
                              disabled={isUpdatingStatus === w.id}
                              onChange={(e) => handleUpdateWholesaleStatus(w.id, e.target.value)}
                              className="rounded-lg border border-input bg-background px-2 py-1 text-xs font-medium"
                            >
                              <option value="baru">Baru</option>
                              <option value="dihubungi">Dihubungi</option>
                              <option value="selesai">Selesai</option>
                              <option value="dibatalkan">Dibatalkan</option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Button asChild variant="clay" size="sm" className="h-8 gap-1 text-xs">
                              <a
                                href={`https://wa.me/${w.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(
                                  `Halo ${w.fullName}, terima kasih telah mengajukan permintaan grosir melalui Lapak UMKM Desa Klepu.`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Phone className="size-3.5" /> WhatsApp
                              </a>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATA MITRA */}
          {activeTab === "mitra" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari nama / username / PT..."
                    value={searchMitra}
                    onChange={(e) => setSearchMitra(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <select
                    value={filterMitraType}
                    onChange={(e) => setFilterMitraType(e.target.value)}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="all">Semua Tipe Mitra</option>
                    <option value="personal">Personal / Perorangan</option>
                    <option value="organisasi">Organisasi / Komunitas</option>
                    <option value="persero">Persero / PT / CV</option>
                  </select>
                </div>
              </div>

              {filteredMitras.length === 0 ? (
                <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-sm text-muted-foreground shadow-clay">
                  Belum ada mitra yang terdaftar.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-clay">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Mitra</th>
                        <th className="px-4 py-3">Tipe</th>
                        <th className="px-4 py-3">Organisasi / Perusahaan</th>
                        <th className="px-4 py-3">Kontak WhatsApp</th>
                        <th className="px-4 py-3">Alamat / Asal</th>
                        <th className="px-4 py-3 text-center">Total Minat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredMitras.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{u.fullName}</div>
                            <div className="text-[11px] text-muted-foreground">@{u.username}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase text-primary">
                              {u.mitraType}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {u.organizationName ? (
                              <div>
                                <div className="font-semibold text-foreground">{u.organizationName}</div>
                                {u.organizationPosition && (
                                  <div className="text-[11px] text-muted-foreground">{u.organizationPosition}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <a
                              href={`https://wa.me/${u.phone.replace(/^0/, "62")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                            >
                              <Phone className="size-3" /> {u.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5 text-foreground/80">{u.address || "-"}</td>
                          <td className="px-4 py-3.5 text-center font-bold text-foreground">
                            {u.totalMinat}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: KELOLA UMKM (CRUD) */}
          {activeTab === "umkm" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari UMKM / pemilik / produk..."
                    value={searchUmkm}
                    onChange={(e) => setSearchUmkm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <select
                    value={filterUmkmCategory}
                    onChange={(e) => setFilterUmkmCategory(e.target.value)}
                    className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Kopi">Kopi</option>
                    <option value="Herbal">Herbal</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Kuliner">Kuliner</option>
                  </select>

                  <Button
                    onClick={() => {
                      setEditingUmkm(null);
                      setUmkmFormError(null);
                      setIsEditingUmkm(true);
                    }}
                    variant="clay"
                    size="sm"
                    className="gap-1.5"
                  >
                    <Plus className="size-4" /> Tambah UMKM
                  </Button>
                </div>
              </div>

              {filteredUmkms.length === 0 ? (
                <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-sm text-muted-foreground shadow-clay">
                  {umkms.length === 0 ? "Belum ada data UMKM." : "Tidak ada UMKM yang cocok dengan filter."}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-clay">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">UMKM & Pemilik</th>
                        <th className="px-4 py-3">Kategori & Produk</th>
                        <th className="px-4 py-3">Modal & Kesiapan</th>
                        <th className="px-4 py-3 text-center">Skor & Prioritas</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredUmkms.map((u) => {
                        const scoreVal = u.score ? scoreTotal(u.score) : null;
                        return (
                          <tr key={u.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                {u.image ? (
                                  <img
                                    src={u.image}
                                    alt={u.name}
                                    className="size-10 rounded-xl object-cover border border-border/60 shadow-sm"
                                  />
                                ) : (
                                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                                    <Store className="size-5" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-foreground">{u.name}</div>
                                  <div className="text-[11px] text-muted-foreground">Oleh: {u.owner}</div>
                                  <div className="text-[10px] text-muted-foreground font-mono">/umkm/{u.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                {u.category}
                              </span>
                              <div className="mt-1 font-medium text-foreground">{u.product}</div>
                              {u.price && (
                                <div className="text-[11px] text-muted-foreground">Kisaran: {u.price}</div>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-primary">{u.investment || "-"}</div>
                              <div className="text-[11px] text-muted-foreground">{u.readiness || "Siap berkembang"}</div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {scoreVal !== null ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-display text-xs font-black text-primary">
                                    {scoreVal} / 100
                                  </span>
                                  {u.priorityRank && (
                                    <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                                      Prioritas #{u.priorityRank}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  u.activeStatus === "Nonaktif" || u.activeStatus === "Dihapus"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                {u.activeStatus || "Aktif"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button asChild variant="ghost" size="sm" className="size-8 p-0" title="Lihat Halaman">
                                  <Link to="/umkm/$slug" params={{ slug: u.slug }} target="_blank">
                                    <ExternalLink className="size-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 text-xs"
                                  onClick={() => {
                                    setEditingUmkm(u);
                                    setUmkmFormError(null);
                                    setIsEditingUmkm(true);
                                  }}
                                >
                                  <Edit3 className="size-3.5" /> Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="size-8 p-0"
                                  title="Hapus / Nonaktifkan"
                                  onClick={() => handleDeleteUmkm(u.id, u.name)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>



      <AdminMinatDetailDialog
        isOpen={!!selectedMinat}
        onClose={() => setSelectedMinat(null)}
        minat={selectedMinat}
        onUpdateStatus={handleSaveMinatNotes}
        isUpdating={!!isUpdatingStatus}
      />

      <SiteFooter />
    </div>
  );
}
