import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Category, Opportunity, Umkm, BusinessFact, InvestmentScore } from "@/lib/umkm-data";
import { scoreTotal } from "@/lib/umkm-data";
import {
  calculateUmkmScore,
  getScoreVerdict,
  generatePrioritySummary,
  inferCriteriaFromUmkm,
  type UmkmAssessmentCriteria,
} from "@/lib/umkm-scoring";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertCircle,
  ArrowLeft,
  Save,
  X,
  Store,
  Boxes,
  Cog,
  Sprout,
  Truck,
  Wallet,
  Sparkles,
  Plus,
  Trash2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Film,
  ExternalLink,
  Loader2,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";

/**
 * Ekstraksi nomor WhatsApp bersih dari URL / database value.
 * Mengonversi 628... / +628... menjadi 08... agar nyaman diedit admin.
 */
export function extractWhatsAppNumber(urlOrNumber?: string | null): string {
  if (!urlOrNumber) return "";
  const trimmed = urlOrNumber.trim();
  const phoneMatch = trimmed.match(/[?&]phone=([+\d]+)/);
  if (phoneMatch) {
    const digits = phoneMatch[1].replace(/\D/g, "");
    return digits.startsWith("62") ? "0" + digits.slice(2) : digits;
  }
  const waMatch = trimmed.match(/wa\.me\/([+\d]+)/);
  if (waMatch) {
    const digits = waMatch[1].replace(/\D/g, "");
    return digits.startsWith("62") ? "0" + digits.slice(2) : digits;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("62") ? "0" + digits.slice(2) : digits;
}

/**
 * Format nomor WhatsApp menjadi tautan chat resmi dengan template pesan pembeli.
 */
export function buildWhatsAppLink(val: string, productName?: string, umkmName?: string): string {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("0")
    ? "62" + digits.slice(1)
    : (digits.startsWith("62") ? digits : "62" + digits);

  const title = (productName || umkmName || "produk").trim();
  const text = `Saya ingin membeli ${title} yang anda tawarkan di Lapak Desa Klepu`;
  return `https://api.whatsapp.com/send?phone=+${normalized}&text=${encodeURIComponent(text)}`;
}

export interface AdminUmkmEditorProps {
  umkm: Partial<Umkm> | null;
  onBack?: () => void;
  onClose?: () => void;
  onSave: (data: Partial<Umkm>) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  isOpen?: boolean;
}

const categories: Category[] = ["Kopi", "Herbal", "Makanan", "Kerajinan", "Kuliner"];
const readinessOptions = ["Siap berkembang", "Prospektif", "Aktif dikembangkan", "Belum siap"];

export function AdminUmkmEditor({
  isOpen,
  onClose,
  onBack,
  umkm,
  onSave,
  isSaving,
  error,
}: AdminUmkmEditorProps) {
  const handleBack = onBack || onClose || (() => {});
  const isEditing = !!umkm?.id;
  const [activeTab, setActiveTab] = React.useState<string>("profil");

  // Tab 1: Profil Dasar & Media
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [category, setCategory] = React.useState<Category>("Makanan");
  const [product, setProduct] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [image, setImage] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [videos, setVideos] = React.useState<{ src: string; poster: string }[]>([]);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = React.useState(false);
  const [imageUploadError, setImageUploadError] = React.useState<string | null>(null);
  const [showManualImageUrl, setShowManualImageUrl] = React.useState(false);

  // Video state
  const [isUploadingVideo, setIsUploadingVideo] = React.useState(false);
  const [videoUploadError, setVideoUploadError] = React.useState<string | null>(null);
  const [newVideoFile, setNewVideoFile] = React.useState<File | null>(null);
  const [newPosterFile, setNewPosterFile] = React.useState<File | null>(null);
  const [newVideoUrl, setNewVideoUrl] = React.useState("");
  const [newPosterUrl, setNewPosterUrl] = React.useState("");
  const [showManualVideoUrl, setShowManualVideoUrl] = React.useState(false);

  // WhatsApp & Maps
  const [whatsappPhone, setWhatsappPhone] = React.useState("");
  const [mapsUrl, setMapsUrl] = React.useState("");
  const [activeStatus, setActiveStatus] = React.useState("Aktif");
  const [readiness, setReadiness] = React.useState("Siap berkembang");

  // Tab 2: Operasional & Bahan Baku
  const [rawMaterialNote, setRawMaterialNote] = React.useState("");
  const [ownedMachines, setOwnedMachines] = React.useState("");
  const [neededTools, setNeededTools] = React.useState("");
  const [workforceCount, setWorkforceCount] = React.useState("");
  const [productionPlace, setProductionPlace] = React.useState("");

  // Tab 3: Pasar & Penjualan
  const [weeklySales, setWeeklySales] = React.useState("");
  const [largestOrder, setLargestOrder] = React.useState("");
  const [marketText, setMarketText] = React.useState("");
  const [marketNote, setMarketNote] = React.useState("");
  const [marketTargets, setMarketTargets] = React.useState<string[]>([]);
  const [newTargetInput, setNewTargetInput] = React.useState("");

  // Tab 4: Investasi, Peluang & ROI
  const [investment, setInvestment] = React.useState("");
  const [investmentUses, setInvestmentUses] = React.useState<string[]>([]);
  const [newUseInput, setNewUseInput] = React.useState("");
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [roiPercent, setRoiPercent] = React.useState("±30–45% per tahun");
  const [roiPayback, setRoiPayback] = React.useState("±2–2,5 tahun");
  const [roiBasis, setRoiBasis] = React.useState("");
  const [risks, setRisks] = React.useState<string[]>([]);
  const [newRiskInput, setNewRiskInput] = React.useState("");
  const [mitigations, setMitigations] = React.useState<string[]>([]);
  const [newMitigationInput, setNewMitigationInput] = React.useState("");

  // Scoring Criteria Engine state
  const [criteria, setCriteria] = React.useState<UmkmAssessmentCriteria>(inferCriteriaFromUmkm(null));
  const [isManualScoreOverride, setIsManualScoreOverride] = React.useState(false);
  const [manualScore, setManualScore] = React.useState<InvestmentScore>({
    materials: 80,
    market: 80,
    distribution: 75,
    finance: 70,
    technology: 70,
  });

  // Calculate live scores
  const calculatedScore = React.useMemo(() => {
    if (isManualScoreOverride) return manualScore;
    return calculateUmkmScore(criteria);
  }, [criteria, isManualScoreOverride, manualScore]);

  const liveTotal = React.useMemo(() => scoreTotal(calculatedScore), [calculatedScore]);
  const liveVerdict = React.useMemo(() => getScoreVerdict(liveTotal), [liveTotal]);
  const livePrioritySummary = React.useMemo(() => generatePrioritySummary(calculatedScore), [calculatedScore]);

  // Sync state on open/change
  React.useEffect(() => {
    if (umkm) {
      setName(umkm.name || "");
      setSlug(umkm.slug || "");
      setOwner(umkm.owner || "");
      setCategory(umkm.category || "Makanan");
      setProduct(umkm.product || "");
      setSummary(umkm.summary || "");
      setDescription(umkm.description || "");
      setPrice(umkm.price || "");
      setImage(umkm.image || "");
      setPhotos(Array.isArray(umkm.photos) ? [...umkm.photos] : []);
      setVideos(Array.isArray(umkm.videos) ? [...umkm.videos] : []);
      setWhatsappPhone(extractWhatsAppNumber(umkm.whatsapp));
      setMapsUrl(umkm.mapsUrl || "");
      setActiveStatus(umkm.activeStatus || "Aktif");
      setReadiness(umkm.readiness || "Siap berkembang");
      setImageUploadError(null);
      setVideoUploadError(null);
      setNewVideoFile(null);
      setNewPosterFile(null);
      setNewVideoUrl("");
      setNewPosterUrl("");
      setShowManualImageUrl(false);
      setShowManualVideoUrl(false);

      // Extract operations
      const ops = umkm.operations || [];
      setRawMaterialNote(ops.find((o) => o.label.toLowerCase().includes("bahan"))?.value || "");
      setOwnedMachines(ops.find((o) => o.label.toLowerCase().includes("sudah dimiliki"))?.value || "");
      setNeededTools(ops.find((o) => o.label.toLowerCase().includes("kebutuhan alat"))?.value || "");

      // Extract facts
      const facts = umkm.facts || [];
      setWeeklySales(facts.find((f) => f.label.toLowerCase().includes("penjualan"))?.value || "");
      setLargestOrder(facts.find((f) => f.label.toLowerCase().includes("terbesar"))?.value || "");
      setWorkforceCount(facts.find((f) => f.label.toLowerCase().includes("tenaga kerja"))?.value || "");
      setProductionPlace(facts.find((f) => f.label.toLowerCase().includes("tempat produksi"))?.value || "");

      // Market
      setMarketText(umkm.market || "");
      setMarketNote(umkm.marketNote || "");
      setMarketTargets(umkm.marketTargets && umkm.marketTargets.length > 0 ? [...umkm.marketTargets] : []);

      // Investment & Opportunities
      setInvestment(umkm.investment || "");
      setInvestmentUses(umkm.investmentUse && umkm.investmentUse.length > 0 ? [...umkm.investmentUse] : []);
      setOpportunities(umkm.opportunities && umkm.opportunities.length > 0 ? [...umkm.opportunities] : []);
      setRoiPercent(umkm.roiSimulation?.roi || "±30–45% per tahun");
      setRoiPayback(umkm.roiSimulation?.payback || "±2–2,5 tahun");
      setRoiBasis(umkm.roiSimulation?.basis || "");
      setRisks(umkm.risks && umkm.risks.length > 0 ? [...umkm.risks] : []);
      setMitigations(umkm.mitigations && umkm.mitigations.length > 0 ? [...umkm.mitigations] : []);

      // Criteria & Scores
      const inferred = inferCriteriaFromUmkm(umkm);
      setCriteria(inferred);
      if (umkm.score) {
        setManualScore(umkm.score);
      }
      setIsManualScoreOverride(false);
    } else {
      // Reset for new UMKM
      setName("");
      setSlug("");
      setOwner("");
      setCategory("Makanan");
      setProduct("");
      setSummary("");
      setDescription("");
      setPrice("");
      setImage("");
      setPhotos([]);
      setVideos([]);
      setWhatsappPhone("");
      setMapsUrl("");
      setActiveStatus("Aktif");
      setReadiness("Siap berkembang");
      setImageUploadError(null);
      setVideoUploadError(null);
      setNewVideoFile(null);
      setNewPosterFile(null);
      setNewVideoUrl("");
      setNewPosterUrl("");
      setShowManualImageUrl(false);
      setShowManualVideoUrl(false);

      setRawMaterialNote("");
      setOwnedMachines("");
      setNeededTools("");
      setWorkforceCount("");
      setProductionPlace("");

      setWeeklySales("");
      setLargestOrder("");
      setMarketText("");
      setMarketNote("");
      setMarketTargets(["Wisatawan lokal", "Pusat oleh-oleh", "Toko daring / WhatsApp"]);

      setInvestment("Rp15–25 juta");
      setInvestmentUses(["Pengadaan mesin penunjang", "Peralatan pengemasan", "Modal bahan baku"]);
      setOpportunities([
        {
          name: "Kemasan Premium",
          investment: "Rp5–10 juta",
          detail: "Kemasan eksklusif bersegel dengan label tanggal produksi dan profil rasa.",
          recommended: true,
          recommendedReason: "Meningkatkan daya tarik suvenir dan nilai jual produk.",
        },
      ]);
      setRoiPercent("±30–45% per tahun");
      setRoiPayback("±2–2,5 tahun");
      setRoiBasis("Perhitungan berbasis volume pesanan stabil dan efisiensi kapasitas produksi mesin.");
      setRisks(["Kestabilan pasokan bahan baku musiman", "Fluktuasi harga kemasan"]);
      setMitigations(["Kerja sama pasokan jangka panjang dengan petani", "Standar operasional produksi (SOP)"]);

      const initialCriteria = inferCriteriaFromUmkm(null);
      setCriteria(initialCriteria);
      setIsManualScoreOverride(false);
    }
    setActiveTab("profil");
  }, [umkm, isOpen]);

  // Helper upload file ke Supabase Storage bucket 'umkm-media'
  const uploadToStorage = async (file: File, prefix: string): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const cleanSlug = (slug || name || "media").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/(^-|-$)/g, "");
    const fileName = `${prefix}-${cleanSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("umkm-media")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (uploadErr) {
      throw new Error(uploadErr.message || "Gagal mengunggah berkas ke penyimpanan storage");
    }

    const { data } = supabase.storage.from("umkm-media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleUploadMainPhoto = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      const msg = "Ukuran foto maksimal 10MB";
      setImageUploadError(msg);
      toast.error(msg);
      return;
    }
    try {
      setIsUploadingImage(true);
      setImageUploadError(null);
      const url = await uploadToStorage(file, "produk");
      setImage(url);
      toast.success("Foto utama produk berhasil diunggah!");
    } catch (err: any) {
      const msg = err.message || "Gagal mengunggah foto utama";
      setImageUploadError(msg);
      toast.error(msg);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadAdditionalPhotos = async (files: File[]) => {
    try {
      setIsUploadingAdditional(true);
      setImageUploadError(null);
      const uploaded: string[] = [];
      for (const f of files) {
        if (f.size > 10 * 1024 * 1024) {
          toast.error(`File "${f.name}" melebihi batas 10MB.`);
          continue;
        }
        const url = await uploadToStorage(f, "galeri");
        uploaded.push(url);
      }
      if (uploaded.length > 0) {
        setPhotos((prev) => [...prev, ...uploaded]);
        toast.success(`${uploaded.length} foto galeri berhasil ditambahkan!`);
      }
    } catch (err: any) {
      const msg = err.message || "Gagal mengunggah foto tambahan";
      setImageUploadError(msg);
      toast.error(msg);
    } finally {
      setIsUploadingAdditional(false);
    }
  };

  const handleUploadAndAddVideo = async () => {
    try {
      setIsUploadingVideo(true);
      setVideoUploadError(null);

      let videoSrc = newVideoUrl.trim();
      let posterSrc = newPosterUrl.trim();

      if (newVideoFile) {
        if (newVideoFile.size > 50 * 1024 * 1024) {
          throw new Error("Ukuran video melebihi batas 50MB. Harap kompres terlebih dahulu.");
        }
        videoSrc = await uploadToStorage(newVideoFile, "video");
      }

      if (newPosterFile) {
        if (newPosterFile.size > 10 * 1024 * 1024) {
          throw new Error("Ukuran foto poster maksimal 10MB.");
        }
        posterSrc = await uploadToStorage(newPosterFile, "poster");
      }

      if (!videoSrc) {
        const msg = "Pilih file video atau isi URL video terlebih dahulu.";
        setVideoUploadError(msg);
        toast.error(msg);
        return;
      }

      if (!posterSrc) {
        posterSrc = image || "/assets/produk.webp";
      }

      setVideos((prev) => [...prev, { src: videoSrc, poster: posterSrc }]);
      setNewVideoFile(null);
      setNewPosterFile(null);
      setNewVideoUrl("");
      setNewPosterUrl("");
      setShowManualVideoUrl(false);
      toast.success("Video profil berhasil ditambahkan ke galeri!");
    } catch (err: any) {
      const msg = err.message || "Gagal mengunggah video";
      setVideoUploadError(msg);
      toast.error(msg);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Handle Tag/List additions
  const handleAddTarget = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const val = newTargetInput.trim();
    if (val && !marketTargets.includes(val)) {
      setMarketTargets([...marketTargets, val]);
      setNewTargetInput("");
    }
  };

  const handleAddUse = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const val = newUseInput.trim();
    if (val && !investmentUses.includes(val)) {
      setInvestmentUses([...investmentUses, val]);
      setNewUseInput("");
    }
  };

  const handleAddRisk = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const val = newRiskInput.trim();
    if (val && !risks.includes(val)) {
      setRisks([...risks, val]);
      setNewRiskInput("");
    }
  };

  const handleAddMitigation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const val = newMitigationInput.trim();
    if (val && !mitigations.includes(val)) {
      setMitigations([...mitigations, val]);
      setNewMitigationInput("");
    }
  };

  const handleAddOpportunity = () => {
    setOpportunities([
      ...opportunities,
      {
        name: "Peluang Baru",
        investment: "Rp5–10 juta",
        detail: "Deskripsi peluang pengembangan produk atau pasar.",
        recommended: false,
      },
    ]);
  };

  const handleRemoveOpportunity = (idx: number) => {
    setOpportunities(opportunities.filter((_, i) => i !== idx));
  };

  const handleOpportunityChange = (idx: number, field: keyof Opportunity, value: any) => {
    const updated = [...opportunities];
    updated[idx] = { ...updated[idx]!, [field]: value };
    setOpportunities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Build facts
    const facts: BusinessFact[] = [
      { label: "Harga produk", value: price.trim() || "-" },
      { label: "Penjualan", value: weeklySales.trim() || "Rutin aktif" },
      { label: "Pesanan terbesar", value: largestOrder.trim() || "-" },
      { label: "Tenaga kerja", value: workforceCount.trim() || "Pengelola & keluarga" },
      { label: "Tempat produksi", value: productionPlace.trim() || "Rumah tangga Desa Klepu" },
    ];

    // Build operations
    const operations: BusinessFact[] = [
      {
        label: "Bahan baku",
        value: rawMaterialNote.trim() || "Hasil perkebunan & potensi Desa Klepu",
      },
      {
        label: "Mesin yang sudah dimiliki",
        value: ownedMachines.trim() || "Peralatan pengolahan dasar",
      },
      {
        label: "Kebutuhan alat",
        value: neededTools.trim() || "Mesin penunjang peningkatan kapasitas",
      },
      {
        label: "Legalitas",
        value: criteria.licenses.length > 0 ? criteria.licenses.join(", ") : "Dalam proses pendampingan desa",
      },
    ];

    const payload: Partial<Umkm> = {
      ...(umkm || {}),
      id: umkm?.id || `UMKM-${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      slug: generatedSlug,
      owner: owner.trim(),
      category,
      product: product.trim() || name.trim(),
      summary: summary.trim() || `${name.trim()} adalah usaha olahan unggulan Desa Klepu, Ponorogo.`,
      description: description.trim() || summary.trim(),
      price: price.trim() || "Konfirmasi pengelola",
      image: image.trim() || "/assets/produk.webp",
      imageAlt: `Kemasan produk ${name.trim()} dari Desa Klepu`,
      photos: photos.length > 0 ? photos : undefined,
      videos: videos.length > 0 ? videos : undefined,
      activeStatus,
      readiness,
      investment: investment.trim() || "Rp15–25 juta",
      investmentUse: investmentUses.length > 0 ? investmentUses : ["Mesin operasional", "Modal kerja awal"],
      market: marketText.trim() || "Wisatawan, toko oleh-oleh, dan jaringan pembeli daring.",
      marketTargets: marketTargets.length > 0 ? marketTargets : ["Wisatawan lokal", "Pusat oleh-oleh"],
      marketNote: marketNote.trim(),
      facts,
      operations,
      opportunities,
      risks: risks.length > 0 ? risks : ["Kestabilan bahan baku musiman"],
      mitigations: mitigations.length > 0 ? mitigations : ["Kemitraan pasokan desa"],
      roiSimulation: {
        roi: roiPercent.trim(),
        payback: roiPayback.trim(),
        basis: roiBasis.trim() || "Simulasi kapasitas produksi dan estimasi serapan pasar.",
      },
      score: calculatedScore,
      prioritySummary: livePrioritySummary,
      whatsapp: whatsappPhone.trim() ? buildWhatsAppLink(whatsappPhone, product || name) : "",
      mapsUrl: mapsUrl.trim(),
    };

    await onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="-ml-2.5 h-8 gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Kembali ke Daftar UMKM
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-clay">
                <Store className="size-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-extrabold sm:text-3xl text-foreground">
                  {isEditing ? `Edit Profil UMKM: ${name || umkm?.name}` : "Tambah UMKM Baru"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manajemen menyeluruh profil usaha, operasional desa, target pasar, peluang investasi, dan skor kelayakan otomatis.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Kategori: {category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  activeStatus === "Aktif"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Status: {activeStatus}
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                Kesiapan: {readiness}
              </span>
            </div>
          </div>

          {/* Live Score pill in page header */}
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 shadow-sm">
              <Sparkles className="size-5 text-primary shrink-0" />
              <div className="text-right">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Skor Otomatis
                </span>
                <div className="flex items-baseline gap-1">
                  <strong className="font-display text-xl font-extrabold text-primary">{liveTotal}</strong>
                  <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
                  <span className="ml-1 rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-primary">
                    {liveVerdict.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleBack} disabled={isSaving} className="h-9 font-semibold">
                Batal
              </Button>
              <Button type="submit" form="umkm-form" variant="clay" size="sm" disabled={isSaving} className="h-9 gap-2 font-bold">
                <Save className="size-4" />
                {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Terbitkan UMKM"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form id="umkm-form" onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1 text-xs sm:grid-cols-5">
              <TabsTrigger value="profil" className="rounded-xl py-2 font-bold">
                1. Profil & Media
              </TabsTrigger>
              <TabsTrigger value="operasional" className="rounded-xl py-2 font-bold">
                2. Bahan & Operasional
              </TabsTrigger>
              <TabsTrigger value="pasar" className="rounded-xl py-2 font-bold">
                3. Pasar & Penjualan
              </TabsTrigger>
              <TabsTrigger value="investasi" className="rounded-xl py-2 font-bold">
                4. Investasi & Peluang
              </TabsTrigger>
              <TabsTrigger value="scoring" className="rounded-xl py-2 font-bold text-primary">
                5. Live Skor ({liveTotal})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PROFIL & MEDIA */}
            <TabsContent value="profil" className="mt-6 space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="u-name" className="text-xs font-bold">Nama UMKM *</Label>
                  <Input
                    id="u-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Kopi Family"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-slug" className="text-xs font-bold">Slug URL (Otomatis jika kosong)</Label>
                  <Input
                    id="u-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kopi-family"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-owner" className="text-xs font-bold">Pemilik / Pengelola *</Label>
                  <Input
                    id="u-owner"
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Nama pemilik usaha"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-category" className="text-xs font-bold">Kategori Komoditas *</Label>
                  <select
                    id="u-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-product" className="text-xs font-bold">Nama Produk Utama *</Label>
                  <Input
                    id="u-product"
                    required
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Contoh: Kopi Liberika 150g"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-price" className="text-xs font-bold">Kisaran Harga Produk</Label>
                  <Input
                    id="u-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: Rp17.000 / bungkus"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-status" className="text-xs font-bold">Status Usaha</Label>
                  <select
                    id="u-status"
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-readiness" className="text-xs font-bold">Tingkat Kesiapan</Label>
                  <select
                    id="u-readiness"
                    value={readiness}
                    onChange={(e) => setReadiness(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                  >
                    {readinessOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-summary" className="text-xs font-bold">Ringkasan Singkat (Muncul di kartu)</Label>
                <Input
                  id="u-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Kopi Liberika rumahan dengan pasar wisata dan oleh-oleh yang sudah terbentuk."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-desc" className="text-xs font-bold">Deskripsi Lengkap Usaha</Label>
                <Textarea
                  id="u-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan latar belakang, sejarah bahan baku lokal pegunungan Klepu, dan proses pembuatannya..."
                />
              </div>

              {/* Kontak WhatsApp & Lokasi */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <MessageCircle className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">Kontak WhatsApp & Lokasi Usaha</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Tautan chat otomatis dibuat oleh sistem dari nomor yang Anda masukkan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="u-wa-phone" className="text-xs font-bold flex items-center gap-1.5">
                      <span>Nomor WhatsApp Pengelola</span>
                      <span className="text-[10px] text-muted-foreground font-normal">(Tanpa link)</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground text-xs font-semibold">
                        🇮🇩 +62 / 08
                      </div>
                      <Input
                        id="u-wa-phone"
                        value={whatsappPhone}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.includes("http") || val.includes("wa.me") || val.includes("whatsapp")) {
                            setWhatsappPhone(extractWhatsAppNumber(val));
                          } else {
                            setWhatsappPhone(val);
                          }
                        }}
                        placeholder="Contoh: 081216022043"
                        className="pl-24 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="u-maps" className="text-xs font-bold flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      <span>Link Google Maps Lokasi</span>
                    </Label>
                    <Input
                      id="u-maps"
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..."
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Petunjuk Format WhatsApp */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs space-y-1.5">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    💡 <strong>Format Nomor:</strong> Masukkan nomor WA pengelola saja (misal:{" "}
                    <code className="rounded bg-background px-1 py-0.5 font-mono text-[11px] font-bold text-foreground">
                      081216022043
                    </code>{" "}
                    atau{" "}
                    <code className="rounded bg-background px-1 py-0.5 font-mono text-[11px] font-bold text-foreground">
                      6281216022043
                    </code>
                    ). Sistem otomatis memformat menjadi tautan resmi WhatsApp chat (
                    <code className="text-[10px] text-primary">api.whatsapp.com/send?phone=+62...</code>) saat data disimpan.
                  </p>

                  {whatsappPhone.trim() && (
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background/80 px-2.5 py-1.5 border border-border/60">
                      <div className="flex items-center gap-1.5 overflow-hidden text-[11px]">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                          Pratinjau link WA tersimpan:
                        </span>
                        <span className="font-mono text-muted-foreground truncate" title={buildWhatsAppLink(whatsappPhone, product || name)}>
                          {buildWhatsAppLink(whatsappPhone, product || name)}
                        </span>
                      </div>
                      <a
                        href={buildWhatsAppLink(whatsappPhone, product || name)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
                      >
                        <ExternalLink className="size-3" /> Tes Chat WA
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Foto Produk Utama (Cover) */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                      <ImageIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Foto Produk Utama (Cover)</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Foto sampul yang muncul di kartu katalog dan header detail usaha.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tunjukkan apa yang sudah ada saja */}
                {image ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={image}
                        alt="Foto Produk Utama"
                        className="size-16 sm:size-20 shrink-0 rounded-lg object-cover border border-border"
                      />
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" /> Foto Aktif Tersimpan
                        </span>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground truncate" title={image}>
                          {image.split("/").pop()}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate" title={image}>
                          {image}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setImage("")}
                      className="h-8 gap-1.5 text-xs font-semibold shrink-0"
                    >
                      <Trash2 className="size-3.5" /> Hapus Foto
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/80 bg-background/50 p-4 text-center text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Belum ada foto produk utama.</p>
                    <p className="text-[11px] mt-0.5">Unggah foto di bawah untuk menampilkan gambar produk resmi.</p>
                  </div>
                )}

                {/* Form Upload Foto Utama */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="relative inline-flex items-center gap-2 cursor-pointer rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3.5 py-2 text-xs font-bold text-primary transition-colors">
                      {isUploadingImage ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      <span>{isUploadingImage ? "Mengunggah Foto..." : "Upload Foto Produk (Maks 10MB)"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif"
                        disabled={isUploadingImage}
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            await handleUploadMainPhoto(file);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowManualImageUrl(!showManualImageUrl)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showManualImageUrl ? "Tutup URL Manual" : "Atau masukkan URL gambar langsung"}
                    </Button>
                  </div>

                  {showManualImageUrl && (
                    <div className="mt-2 space-y-1">
                      <Label htmlFor="u-manual-img" className="text-[11px] font-semibold">URL Foto Produk</Label>
                      <Input
                        id="u-manual-img"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://... atau /assets/produk.webp"
                        className="font-mono text-xs"
                      />
                    </div>
                  )}

                  {imageUploadError && (
                    <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{imageUploadError}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Foto Tambahan / Galeri */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                      <ImageIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Galeri Foto Tambahan Usaha</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Dokumentasi foto produk dari berbagai sudut atau kegiatan produksi.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {photos.length} foto
                  </span>
                </div>

                {/* Tunjukkan apa yang sudah ada saja */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {photos.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background shadow-sm"
                      >
                        <img
                          src={photoUrl}
                          alt={`Galeri ${idx + 1}`}
                          className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                            className="inline-flex items-center gap-1 rounded-lg bg-destructive px-2.5 py-1.5 text-[11px] font-bold text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
                          >
                            <Trash2 className="size-3" /> Hapus
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Belum ada foto tambahan. Tambahkan foto galeri di bawah jika diperlukan.
                  </p>
                )}

                {/* Form Upload Foto Tambahan */}
                <div className="pt-1">
                  <label className="relative inline-flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border bg-background hover:bg-muted/50 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    {isUploadingAdditional ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <Plus className="size-4 text-primary" />
                    )}
                    <span>{isUploadingAdditional ? "Mengunggah Galeri..." : "+ Upload Foto Tambahan (Bisa Banyak)"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      disabled={isUploadingAdditional}
                      className="sr-only"
                      onChange={async (e) => {
                        if (e.target.files) {
                          await handleUploadAdditionalPhotos(Array.from(e.target.files));
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Video Dokumentasi Produk */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Film className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">Video Dokumentasi Usaha & Produk</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Video profil atau proses produksi yang ditampilkan pada tab galeri detail UMKM.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {videos.length} video
                  </span>
                </div>

                {/* Tunjukkan apa yang sudah ada saja */}
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {videos.map((vid, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-sm"
                      >
                        <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
                          {vid.poster ? (
                            <img
                              src={vid.poster}
                              alt={`Poster video ${idx + 1}`}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="size-full grid place-items-center text-muted-foreground">
                              <Film className="size-6" />
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 grid size-4 place-items-center rounded-full bg-black/75 text-white text-[8px]">
                            ▶
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">Video #{idx + 1}</p>
                          <p className="font-mono text-[10px] text-muted-foreground truncate" title={vid.src}>
                            {vid.src.split("/").pop()}
                          </p>
                          <a
                            href={vid.src}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                          >
                            <ExternalLink className="size-3" /> Putar Video
                          </a>
                        </div>

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                          className="h-8 gap-1 text-xs shrink-0"
                          title="Hapus video ini"
                        >
                          <Trash2 className="size-3.5" /> Hapus
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Belum ada video dokumentasi untuk UMKM ini.
                  </p>
                )}

                {/* Form Upload Video Baru */}
                <div className="rounded-xl border border-border bg-background p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Plus className="size-3.5 text-primary" /> Tambah Video Baru
                    </p>
                    <span className="text-[10px] text-muted-foreground">Maks 50MB (MP4, WebM)</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">1. Berkas Video (.mp4 / .webm)</Label>
                      <Input
                        type="file"
                        accept="video/mp4,video/webm"
                        disabled={isUploadingVideo}
                        className="text-xs h-9 cursor-pointer"
                        onChange={(e) => setNewVideoFile(e.target.files?.[0] || null)}
                      />
                      {newVideoFile && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          File: {newVideoFile.name} ({(newVideoFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">2. Poster / Thumbnail Foto (Opsional)</Label>
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={isUploadingVideo}
                        className="text-xs h-9 cursor-pointer"
                        onChange={(e) => setNewPosterFile(e.target.files?.[0] || null)}
                      />
                      {newPosterFile && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          Poster: {newPosterFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        disabled={isUploadingVideo || (!newVideoFile && !newVideoUrl.trim())}
                        onClick={handleUploadAndAddVideo}
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-bold"
                      >
                        {isUploadingVideo ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Mengunggah Video...
                          </>
                        ) : (
                          <>
                            <Plus className="size-3.5" /> Upload & Tambahkan Video
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowManualVideoUrl(!showManualVideoUrl)}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {showManualVideoUrl ? "Tutup URL Video Manual" : "Atau input URL video"}
                      </Button>
                    </div>

                    {videoUploadError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{videoUploadError}</span>
                      </p>
                    )}
                  </div>

                  {showManualVideoUrl && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2 border-t border-border/40">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">URL Video Langsung</Label>
                        <Input
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="https://.../video.mp4"
                          className="font-mono text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">URL Poster Langsung</Label>
                        <Input
                          value={newPosterUrl}
                          onChange={(e) => setNewPosterUrl(e.target.value)}
                          placeholder="https://.../poster.jpg"
                          className="font-mono text-xs h-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: BAHAN BAKU & OPERASIONAL */}
            <TabsContent value="operasional" className="mt-6 space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Sprout className="size-4" />
                  <span>Kriteria Penilaian: Bahan Baku & Pasokan</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilihan di bawah otomatis menghitung skor dimensi <strong>Bahan Baku (Materials)</strong>.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Asal Pasokan Bahan Baku</Label>
                    <select
                      value={criteria.rawMaterialSource}
                      onChange={(e) =>
                        setCriteria({ ...criteria, rawMaterialSource: e.target.value as any })
                      }
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="desa_klepu">100% Kebun / Petani Desa Klepu (+40)</option>
                      <option value="sebagian_luar">Sebagian Klepu, Sebagian Luar (+25)</option>
                      <option value="luar_desa">Beli Jadi dari Luar Desa (+10)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Kontinuitas Ketersediaan</Label>
                    <select
                      value={criteria.rawMaterialAvailability}
                      onChange={(e) =>
                        setCriteria({ ...criteria, rawMaterialAvailability: e.target.value as any })
                      }
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="melimpah">Melimpah sepanjang tahun (+35)</option>
                      <option value="musiman">Musiman (hanya waktu panen) (+20)</option>
                      <option value="terbatas">Sering terkendala / terbatas (+10)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end space-y-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background p-2 text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={criteria.supplierNetwork}
                        onChange={(e) => setCriteria({ ...criteria, supplierNetwork: e.target.checked })}
                        className="rounded text-primary"
                      />
                      <span>Ada jaringan petani tetap (+25)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Cog className="size-4" />
                  <span>Kriteria Penilaian: Teknologi & Peralatan</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilihan di bawah otomatis menghitung skor dimensi <strong>Teknologi (Technology)</strong>.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Tingkat Mesin Saat Ini</Label>
                    <select
                      value={criteria.machineryStatus}
                      onChange={(e) => setCriteria({ ...criteria, machineryStatus: e.target.value as any })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="modern_lengkap">Mesin mekanis modern lengkap (+40)</option>
                      <option value="semi_manual">Semi-manual (ada mesin penunjang) (+28)</option>
                      <option value="manual_tradisional">Tradisional / Manual penuh (+12)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Kesiapan Tenaga Kerja</Label>
                    <select
                      value={criteria.workforceReadiness}
                      onChange={(e) =>
                        setCriteria({ ...criteria, workforceReadiness: e.target.value as any })
                      }
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="terlatih">Terampil & siap tambah kapasitas (+30)</option>
                      <option value="butuh_pelatihan">Perlu pelatihan teknis tambahan (+18)</option>
                      <option value="terbatas">Terbatas keluarga saja (+8)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end space-y-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background p-2 text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={criteria.upgradeIdentified}
                        onChange={(e) => setCriteria({ ...criteria, upgradeIdentified: e.target.checked })}
                        className="rounded text-primary"
                      />
                      <span>Kebutuhan alat baru teridentifikasi (+30)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Narasi Operasional */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="u-raw-note" className="text-xs font-bold">Narasi Bahan Baku</Label>
                  <Input
                    id="u-raw-note"
                    value={rawMaterialNote}
                    onChange={(e) => setRawMaterialNote(e.target.value)}
                    placeholder="Contoh: Kopi Liberika dari petani Desa Klepu jaringan kebun Banyu Putih"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-machines" className="text-xs font-bold">Mesin yang Dimiliki</Label>
                  <Input
                    id="u-machines"
                    value={ownedMachines}
                    onChange={(e) => setOwnedMachines(e.target.value)}
                    placeholder="Contoh: Mesin pengupas kulit dan pembersih biji kopi"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-needed" className="text-xs font-bold">Kebutuhan Alat / Mesin Baru</Label>
                  <Input
                    id="u-needed"
                    value={neededTools}
                    onChange={(e) => setNeededTools(e.target.value)}
                    placeholder="Contoh: Mesin sangrai kapasitas 5kg dan continuous sealer"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-workforce" className="text-xs font-bold">Jumlah Tenaga Kerja & Tempat</Label>
                  <Input
                    id="u-workforce"
                    value={workforceCount}
                    onChange={(e) => setWorkforceCount(e.target.value)}
                    placeholder="Contoh: 5 orang, tempat produksi rumah tangga"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: PASAR & DISTRIBUSI */}
            <TabsContent value="pasar" className="mt-6 space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Boxes className="size-4" />
                  <span>Kriteria Penilaian: Pasar & Permintaan</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilihan di bawah otomatis menghitung skor dimensi <strong>Pasar (Market)</strong>.
                </p>

                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Frekuensi Permintaan / Penjualan</Label>
                      <select
                        value={criteria.salesDemandStatus}
                        onChange={(e) =>
                          setCriteria({ ...criteria, salesDemandStatus: e.target.value as any })
                        }
                        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                      >
                        <option value="rutin">Rutin aktif tiap minggu/bulan (+35)</option>
                        <option value="pesanan_saja">Hanya ada saat ada pesanan musiman (+20)</option>
                        <option value="belum_stabil">Belum stabil / pasar belum terbentuk (+10)</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end space-y-1">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background p-2 text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={criteria.clearTargetMarket}
                          onChange={(e) =>
                            setCriteria({ ...criteria, clearTargetMarket: e.target.checked })
                          }
                          className="rounded text-primary"
                        />
                        <span>Target konsumen spesifik sudah jelas (+30)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] font-semibold">Kanal Penjualan Aktif (Multi-pilihan)</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      {[
                        { id: "wisata", label: "Wisatawan / Kios Goa Maria" },
                        { id: "oleh_oleh", label: "Pusat Oleh-Oleh Ponorogo" },
                        { id: "online", label: "WhatsApp & Marketplace" },
                        { id: "reseller", label: "Jaringan Reseller Antarkota" },
                        { id: "kafe", label: "Kafe / Konsinyasi Warung" },
                      ].map((ch) => {
                        const checked = criteria.marketChannels.includes(ch.id);
                        return (
                          <label
                            key={ch.id}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 transition-all ${
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCriteria({
                                    ...criteria,
                                    marketChannels: [...criteria.marketChannels, ch.id],
                                  });
                                } else {
                                  setCriteria({
                                    ...criteria,
                                    marketChannels: criteria.marketChannels.filter((c) => c !== ch.id),
                                  });
                                }
                              }}
                            />
                            <span>{ch.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Truck className="size-4" />
                  <span>Kriteria Penilaian: Kemasan & Distribusi</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilihan di bawah otomatis menghitung skor dimensi <strong>Distribusi (Distribution)</strong>.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Standar Kemasan</Label>
                    <select
                      value={criteria.packagingType}
                      onChange={(e) => setCriteria({ ...criteria, packagingType: e.target.value as any })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="pouch_segel_label">Pouch/Ziplock bersegel & label rapi (+35)</option>
                      <option value="plastik_segel">Plastik tebal bersegel sealer (+25)</option>
                      <option value="plastik_biasa">Plastik polos tali/staples (+10)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Masa Simpan / Kadaluarsa</Label>
                    <select
                      value={criteria.productShelfLife}
                      onChange={(e) =>
                        setCriteria({ ...criteria, productShelfLife: e.target.value as any })
                      }
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="gt_6m">&gt; 6 Bulan (Sangat aman luar kota) (+35)</option>
                      <option value="3_6m">3 – 6 Bulan (+28)</option>
                      <option value="1_3m">1 – 3 Bulan (+18)</option>
                      <option value="lt_1m">&lt; 1 Bulan (Harus cepat saji) (+10)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Akses Logistik Pengiriman</Label>
                    <select
                      value={criteria.deliveryAccess}
                      onChange={(e) => setCriteria({ ...criteria, deliveryAccess: e.target.value as any })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                    >
                      <option value="ada_armada_ekspedisi">Armada sendiri + dekat ekspedisi (+30)</option>
                      <option value="ekspedisi_saja">Bisa kirim lewat kurir / ekspedisi (+20)</option>
                      <option value="lokal_saja">Hanya antar lokal desa (+10)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rincian Target Pasar */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Daftar Segmen Target Pasar</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {marketTargets.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setMarketTargets(marketTargets.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTargetInput}
                    onChange={(e) => setNewTargetInput(e.target.value)}
                    onKeyDown={handleAddTarget}
                    placeholder="Tambah target konsumen (misal: Rombongan ziarah wisata Goa Maria)... lalu tekan Enter"
                    className="text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddTarget}>
                    <Plus className="size-3.5" /> Tambah
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: KEUANGAN, INVESTASI & PELUANG */}
            <TabsContent value="investasi" className="mt-6 space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Wallet className="size-4" />
                  <span>Kriteria Penilaian: Keuangan & Legalitas</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilihan di bawah otomatis menghitung skor dimensi <strong>Keuangan (Finance)</strong>.
                </p>

                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Pencatatan Keuangan</Label>
                      <select
                        value={criteria.bookkeeping}
                        onChange={(e) => setCriteria({ ...criteria, bookkeeping: e.target.value as any })}
                        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                      >
                        <option value="digital_rapi">Pembukuan teratur / digital (+35)</option>
                        <option value="buku_kas_manual">Buku kas manual / catatan sederhana (+20)</option>
                        <option value="belum_ada">Belum ada catatan tertulis (+5)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Perhitungan HPP & Margin</Label>
                      <select
                        value={criteria.costCalculation}
                        onChange={(e) =>
                          setCriteria({ ...criteria, costCalculation: e.target.value as any })
                        }
                        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                      >
                        <option value="hpp_terhitung">HPP sudah terhitung per kemasan (+30)</option>
                        <option value="perkiraan_kasar">Masih perkiraan kasar (+15)</option>
                        <option value="belum_tahu">Belum pernah menghitung HPP (+5)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] font-semibold">Legalitas & Sertifikasi yang Dimiliki</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      {["NIB", "P-IRT", "Halal", "BPOM"].map((lic) => {
                        const checked = criteria.licenses.includes(lic);
                        return (
                          <label
                            key={lic}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 transition-all ${
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCriteria({ ...criteria, licenses: [...criteria.licenses, lic] });
                                } else {
                                  setCriteria({
                                    ...criteria,
                                    licenses: criteria.licenses.filter((l) => l !== lic),
                                  });
                                }
                              }}
                            />
                            <span>{lic}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kebutuhan Investasi & Alokasi */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="u-inv" className="text-xs font-bold">Total Kebutuhan Modal Indikatif *</Label>
                  <Input
                    id="u-inv"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="Contoh: Rp20–28 juta"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-roi" className="text-xs font-bold">Estimasi ROI & Payback</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={roiPercent}
                      onChange={(e) => setRoiPercent(e.target.value)}
                      placeholder="ROI: ±35–45% per thn"
                      className="text-xs"
                    />
                    <Input
                      value={roiPayback}
                      onChange={(e) => setRoiPayback(e.target.value)}
                      placeholder="Balik modal: ±2 thn"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Rincian Penggunaan Dana (Alokasi Modal)</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {investmentUses.map((use, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {use}
                      <button
                        type="button"
                        onClick={() => setInvestmentUses(investmentUses.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newUseInput}
                    onChange={(e) => setNewUseInput(e.target.value)}
                    onKeyDown={handleAddUse}
                    placeholder="Tambah pos alokasi (misal: Mesin sangrai 5kg, Sealer otomatis)... tekan Enter"
                    className="text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddUse}>
                    <Plus className="size-3.5" /> Tambah
                  </Button>
                </div>
              </div>

              {/* Peluang Produk Turunan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Peluang Produk Turunan & Paket Usaha</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddOpportunity}
                    className="h-7 gap-1 text-xs"
                  >
                    <Plus className="size-3" /> Tambah Peluang
                  </Button>
                </div>

                {opportunities.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Belum ada paket peluang yang ditambahkan.</p>
                ) : (
                  <div className="space-y-3">
                    {opportunities.map((opp, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveOpportunity(idx)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pr-6">
                          <div>
                            <Label className="text-[10px] font-bold">Nama Peluang</Label>
                            <Input
                              value={opp.name}
                              onChange={(e) => handleOpportunityChange(idx, "name", e.target.value)}
                              placeholder="Misal: Drip Bag Kopi / Hampers"
                              className="h-8 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] font-bold">Kebutuhan Modal</Label>
                            <Input
                              value={opp.investment}
                              onChange={(e) => handleOpportunityChange(idx, "investment", e.target.value)}
                              placeholder="Misal: Rp5–12 juta"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-[10px] font-bold">Uraian Peluang</Label>
                          <Input
                            value={opp.detail}
                            onChange={(e) => handleOpportunityChange(idx, "detail", e.target.value)}
                            placeholder="Deskripsi produk turunan untuk wisatawan..."
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold">
                            <input
                              type="checkbox"
                              checked={opp.recommended || false}
                              onChange={(e) => handleOpportunityChange(idx, "recommended", e.target.checked)}
                              className="rounded text-primary"
                            />
                            <span className="text-primary font-bold">Beri badge Rekomendasi</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 5: SKOR & PRIORITAS LIVE */}
            <TabsContent value="scoring" className="mt-6 space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-clay">
              {/* Live Score Dashboard Card */}
              <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-clay">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      <Sparkles className="size-3.5" /> Hasil Penilaian Otomatis
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-foreground">{liveVerdict}</h3>
                    <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
                      {livePrioritySummary}
                    </p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="flex items-center gap-4">
                    <div className="grid size-24 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-clay">
                      <div className="text-center">
                        <span className="font-display text-3xl font-black">{liveTotal}</span>
                        <span className="block text-[10px] font-bold opacity-80">/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-pillar breakdown */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5 border-t border-border/80 pt-5">
                  <div className="rounded-2xl bg-background p-3 text-center border border-border/60">
                    <Sprout className="mx-auto size-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">Bahan Baku</span>
                    <strong className="font-display text-xl font-bold text-foreground">{calculatedScore.materials}</strong>
                  </div>

                  <div className="rounded-2xl bg-background p-3 text-center border border-border/60">
                    <Boxes className="mx-auto size-5 text-blue-600 dark:text-blue-400" />
                    <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">Pasar</span>
                    <strong className="font-display text-xl font-bold text-foreground">{calculatedScore.market}</strong>
                  </div>

                  <div className="rounded-2xl bg-background p-3 text-center border border-border/60">
                    <Truck className="mx-auto size-5 text-purple-600 dark:text-purple-400" />
                    <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">Distribusi</span>
                    <strong className="font-display text-xl font-bold text-foreground">{calculatedScore.distribution}</strong>
                  </div>

                  <div className="rounded-2xl bg-background p-3 text-center border border-border/60">
                    <Wallet className="mx-auto size-5 text-amber-600 dark:text-amber-400" />
                    <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">Keuangan</span>
                    <strong className="font-display text-xl font-bold text-foreground">{calculatedScore.finance}</strong>
                  </div>

                  <div className="rounded-2xl bg-background p-3 text-center border border-border/60">
                    <Cog className="mx-auto size-5 text-rose-600 dark:text-rose-400" />
                    <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">Teknologi</span>
                    <strong className="font-display text-xl font-bold text-foreground">{calculatedScore.technology}</strong>
                  </div>
                </div>
              </div>

              {/* Manual Override switch */}
              <div className="rounded-2xl border border-border/80 bg-background p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground">Kustomisasi Skor Manual</span>
                    <p className="text-[11px] text-muted-foreground">
                      Aktifkan toggle ini jika Anda ingin menyesuaikan nilai angka secara langsung tanpa memakai formula otomatis.
                    </p>
                  </div>
                  <Switch
                    checked={isManualScoreOverride}
                    onCheckedChange={setIsManualScoreOverride}
                  />
                </div>

                {isManualScoreOverride && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5 border-t border-border pt-4">
                    <div>
                      <Label className="text-[10px] font-bold">Bahan Baku (0-100)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={100}
                        value={manualScore.materials}
                        onChange={(e) =>
                          setManualScore({ ...manualScore, materials: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold">Pasar (0-100)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={100}
                        value={manualScore.market}
                        onChange={(e) =>
                          setManualScore({ ...manualScore, market: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold">Distribusi (0-100)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={100}
                        value={manualScore.distribution}
                        onChange={(e) =>
                          setManualScore({ ...manualScore, distribution: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold">Keuangan (0-100)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={100}
                        value={manualScore.finance}
                        onChange={(e) =>
                          setManualScore({ ...manualScore, finance: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold">Teknologi (0-100)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={100}
                        value={manualScore.technology}
                        onChange={(e) =>
                          setManualScore({ ...manualScore, technology: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

        {/* Sticky floating bottom action bar */}
        <div className="sticky bottom-4 z-40 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="size-4" />
              <span>Skor Total: <strong>{liveTotal}</strong>/100</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
              Status Kelayakan: <strong className="text-foreground">{liveVerdict.label}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleBack} disabled={isSaving} className="h-9 font-semibold">
              Batal
            </Button>
            <Button type="submit" variant="clay" size="sm" disabled={isSaving} className="h-9 gap-2 font-bold">
              <Save className="size-4" />
              {isSaving ? "Menyimpan Data..." : isEditing ? "Simpan Perubahan UMKM" : "Terbitkan UMKM"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export { AdminUmkmEditor as AdminUmkmDialog };
