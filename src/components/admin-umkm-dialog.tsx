import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Umkm } from "@/lib/umkm-data";
import { AlertCircle, Save, X, Image as ImageIcon, Store } from "lucide-react";

interface AdminUmkmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  umkm: Partial<Umkm> | null;
  onSave: (data: Partial<Umkm>) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

const categories: Category[] = ["Kopi", "Herbal", "Makanan", "Kerajinan", "Kuliner"];
const readinessOptions = ["Siap berkembang", "Prospektif", "Aktif dikembangkan", "Belum siap"];

export function AdminUmkmDialog({
  isOpen,
  onClose,
  umkm,
  onSave,
  isSaving,
  error,
}: AdminUmkmDialogProps) {
  const isEditing = !!umkm?.id;

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [category, setCategory] = React.useState<Category>("Makanan");
  const [product, setProduct] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [readiness, setReadiness] = React.useState("Siap berkembang");
  const [investment, setInvestment] = React.useState("");
  const [prioritySummary, setPrioritySummary] = React.useState("");
  const [market, setMarket] = React.useState("");
  const [image, setImage] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [mapsUrl, setMapsUrl] = React.useState("");
  const [activeStatus, setActiveStatus] = React.useState("Aktif");

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
      setReadiness(umkm.readiness || "Siap berkembang");
      setInvestment(umkm.investment || "");
      setPrioritySummary(umkm.prioritySummary || "");
      setMarket(umkm.market || "");
      setImage(umkm.image || "");
      setWhatsapp(umkm.whatsapp || "");
      setMapsUrl(umkm.mapsUrl || "");
      setActiveStatus(umkm.activeStatus || "Aktif");
    } else {
      setName("");
      setSlug("");
      setOwner("");
      setCategory("Makanan");
      setProduct("");
      setSummary("");
      setDescription("");
      setPrice("");
      setReadiness("Siap berkembang");
      setInvestment("");
      setPrioritySummary("");
      setMarket("");
      setImage("");
      setWhatsapp("");
      setMapsUrl("");
      setActiveStatus("Aktif");
    }
  }, [umkm, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: Partial<Umkm> = {
      ...(umkm || {}),
      id: umkm?.id,
      name: name.trim(),
      slug: generatedSlug,
      owner: owner.trim(),
      category,
      product: product.trim(),
      summary: summary.trim(),
      description: description.trim(),
      price: price.trim(),
      readiness,
      investment: investment.trim(),
      prioritySummary: prioritySummary.trim(),
      market: market.trim(),
      image: image.trim(),
      imageAlt: `Kemasan produk ${name.trim()} dari Desa Klepu`,
      whatsapp: whatsapp.trim(),
      mapsUrl: mapsUrl.trim(),
      activeStatus,
    };

    await onSave(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold">
            <Store className="size-5 text-primary" />
            {isEditing ? `Edit Profil UMKM: ${umkm?.name}` : "Tambah UMKM Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing
              ? "Perbarui informasi produk, harga, dan peluang investasi UMKM ini."
              : "Masukkan data usaha UMKM Desa Klepu agar tampil di katalog publik dan portal kemitraan."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Identitas Dasar */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              Identitas & Produk
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="u-name" className="text-xs">Nama Usaha / Merk *</Label>
                <Input
                  id="u-name"
                  required
                  placeholder="Misal: Kopi Family, Keisse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-owner" className="text-xs">Nama Pemilik / Pengelola *</Label>
                <Input
                  id="u-owner"
                  required
                  placeholder="Misal: Bu Muji, Pak Sugeng"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-category" className="text-xs">Kategori Produk *</Label>
                <select
                  id="u-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-product" className="text-xs">Nama Produk Utama *</Label>
                <Input
                  id="u-product"
                  required
                  placeholder="Misal: Kopi Liberika Kemasan 150g"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="u-slug" className="text-xs">Slug URL (opsional)</Label>
                <Input
                  id="u-slug"
                  placeholder="otomatis dari nama jika kosong (misal: kopi-family)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Ringkasan & Deskripsi */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <h4 className="font-bold text-foreground">Deskripsi & Nilai Jual</h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="u-summary" className="text-xs">Ringkasan Singkat (Summary) *</Label>
                <Input
                  id="u-summary"
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk kartu katalog"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-desc" className="text-xs">Deskripsi Lengkap Profil Usaha</Label>
                <Textarea
                  id="u-desc"
                  rows={3}
                  placeholder="Ceritakan sejarah, keunggulan bahan baku, proses produksi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="u-price" className="text-xs">Format Harga Display</Label>
                  <Input
                    id="u-price"
                    placeholder="Misal: Rp17.000 / 150 gram"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="u-market" className="text-xs">Target Pasar & Distribusi</Label>
                  <Input
                    id="u-market"
                    placeholder="Misal: Wisatawan, toko oleh-oleh, shopee"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kesiapan Investasi & Status */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <h4 className="font-bold text-foreground">Kesiapan Kemitraan & Investasi</h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="u-readiness" className="text-xs">Status Kesiapan</Label>
                <select
                  id="u-readiness"
                  value={readiness}
                  onChange={(e) => setReadiness(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                >
                  {readinessOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-investment" className="text-xs">Estimasi Nilai Kebutuhan Modal</Label>
                <Input
                  id="u-investment"
                  placeholder="Misal: Rp20–28 juta"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="u-priority" className="text-xs">Alasan Prioritas & Rencana Pemanfaatan</Label>
                <Input
                  id="u-priority"
                  placeholder="Misal: Kebutuhan pengadaan mesin sangrai untuk peningkatan kapasitas"
                  value={prioritySummary}
                  onChange={(e) => setPrioritySummary(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="u-status" className="text-xs">Status Katalog</Label>
                <select
                  id="u-status"
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                >
                  <option value="Aktif">Aktif (Tampil di Katalog)</option>
                  <option value="Nonaktif">Nonaktif (Disembunyikan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kontak & Media */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-primary" /> Foto & Kontak Usaha
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="u-image" className="text-xs">URL Foto Cover / Produk</Label>
                <Input
                  id="u-image"
                  placeholder="https://.../foto-produk.jpg atau assets/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="u-wa" className="text-xs">Nomor / Link WhatsApp</Label>
                  <Input
                    id="u-wa"
                    placeholder="https://api.whatsapp.com/send?phone=..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="u-maps" className="text-xs">URL Google Maps Lokasi</Label>
                  <Input
                    id="u-maps"
                    placeholder="https://www.google.com/maps?q=..."
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="rounded-xl">
              Batal
            </Button>
            <Button type="submit" variant="clay" size="sm" disabled={isSaving} className="rounded-xl font-semibold">
              <Save className="size-3.5" />
              {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah UMKM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
