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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMinatItem } from "@/lib/admin.functions";
import {
  Briefcase,
  Building2,
  Building,
  User,
  Phone,
  FileText,
  Download,
  ExternalLink,
  Save,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

interface AdminMinatDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  minat: AdminMinatItem | null;
  onUpdateStatus: (minatId: string, status: string, notes: string) => Promise<void>;
  isUpdating: boolean;
}

export function AdminMinatDetailDialog({
  isOpen,
  onClose,
  minat,
  onUpdateStatus,
  isUpdating,
}: AdminMinatDetailDialogProps) {
  if (!minat) return null;

  const [status, setStatus] = React.useState(minat.status);
  const [adminNotes, setAdminNotes] = React.useState(minat.adminNotes || "");

  React.useEffect(() => {
    if (minat) {
      setStatus(minat.status);
      setAdminNotes(minat.adminNotes || "");
    }
  }, [minat]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateStatus(minat.id, status, adminNotes.trim());
    onClose();
  };

  const formatRupiah = (val?: number | null) => {
    if (!val) return "Rp0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (val: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(val));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold">
            <Briefcase className="size-5 text-primary" />
            Detail Pengajuan Minat Investasi
          </DialogTitle>
          <DialogDescription className="text-xs">
            Diajukan pada {formatDate(minat.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-xs">
          {/* Mitra Info Card */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                {minat.mitraType === "organisasi" ? (
                  <Building2 className="size-5" />
                ) : minat.mitraType === "persero" ? (
                  <Building className="size-5" />
                ) : (
                  <User className="size-5" />
                )}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {minat.mitraFullName}
                  </h4>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {minat.mitraType}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  @{minat.mitraUsername} {minat.organizationName && `· ${minat.organizationName}`}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Phone className="size-3 text-primary" /> {minat.contactPhone}
                  </span>
                  <a
                    href={`https://wa.me/${minat.contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Halo ${minat.mitraFullName}, terima kasih telah mengajukan minat investasi untuk UMKM ${minat.umkmName} di Desa Klepu. Kami ingin menindaklanjuti proposal Anda.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    Hubungi via WhatsApp <ExternalLink className="size-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* UMKM & Investment Target */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                UMKM Sasaran
              </span>
              <span className="mt-1 block font-display text-base font-bold text-foreground">
                {minat.umkmName}
              </span>
              <span className="mt-0.5 inline-block rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                {minat.umkmCategory}
              </span>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Estimasi Modal & Objek
              </span>
              <span className="mt-1 block font-display text-base font-bold text-primary">
                {formatRupiah(minat.nominalInvestment)}
              </span>
              <span className="mt-0.5 block text-muted-foreground">
                Bentuk: <span className="font-semibold text-foreground capitalize">{minat.investmentType.replace(/_/g, " ")}</span>
                {minat.targetItem && ` · Objek: ${minat.targetItem}`}
              </span>
            </div>
          </div>

          {/* Proposal Text */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4">
            <span className="block font-bold text-foreground mb-1.5">
              Uraian Minat & Rencana Kemitraan:
            </span>
            <p className="rounded-xl border border-border/60 bg-background/60 p-3 leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {minat.notes}
            </p>

            {minat.proposalUrl && (
              <div className="mt-3 flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Dokumen Proposal:</span>
                <a
                  href={minat.proposalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 font-bold text-primary hover:bg-primary/20"
                >
                  <FileText className="size-3.5" />
                  <span className="max-w-[200px] truncate">{minat.proposalFilename || "Unduh Dokumen"}</span>
                  <Download className="size-3" />
                </a>
              </div>
            )}
          </div>

          {/* Update Status Form */}
          <form onSubmit={handleSave} className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <MessageSquare className="size-4 text-primary" />
              Kelola Status & Tanggapan Pengelola
            </h4>

            <div className="space-y-1">
              <Label htmlFor="m-status" className="text-xs">Status Tindak Lanjut</Label>
              <select
                id="m-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminMinatItem["status"])}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold"
              >
                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                <option value="dalam_diskusi">Dalam Diskusi</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="m-notes" className="text-xs">
                Catatan / Tanggapan Resmi untuk Mitra (dapat dilihat oleh mitra di dashboard mereka)
              </Label>
              <Textarea
                id="m-notes"
                rows={3}
                placeholder="Misal: Proposal telah diterima, tim desa dan pemilik UMKM siap berdiskusi pada hari Kamis pukul 10:00 WIB..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="rounded-xl text-xs bg-background"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="clay" size="sm" disabled={isUpdating} className="rounded-xl font-semibold">
                <Save className="size-3.5" />
                {isUpdating ? "Menyimpan..." : "Simpan Status & Tanggapan"}
              </Button>
            </div>
          </form>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
