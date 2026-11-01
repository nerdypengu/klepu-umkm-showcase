import * as React from "react";
import { Link } from "@tanstack/react-router";
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
import { useAuth } from "@/lib/auth-context";
import { submitMinatServerFn } from "@/lib/minat.functions";
import { createUploadTargetServerFn } from "@/lib/upload.functions";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle2, AlertCircle, LogIn, Briefcase, FileUp, FileText, X } from "lucide-react";

interface AjukanMinatDialogProps {
  umkmId: string;
  umkmName: string;
  defaultNominal?: string;
}

export function AjukanMinatDialog({ umkmId, umkmName }: AjukanMinatDialogProps) {
  const { user, token, isLoggedIn } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [investmentType, setInvestmentType] = React.useState<
    "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya"
  >("modal_kerja");
  const [targetItem, setTargetItem] = React.useState<string>("");
  const [nominal, setNominal] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [proposalFile, setProposalFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setProposalFile(null);
      return;
    }

    const name = file.name.toLowerCase();
    const isPdf = name.endsWith(".pdf");
    const isDocx = name.endsWith(".docx");

    if (!isPdf && !isDocx) {
      setError("Format file tidak valid. Hanya dokumen PDF (.pdf) atau Word (.docx) yang diperbolehkan.");
      setProposalFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("Ukuran file dokumen proposal maksimal 20 MB.");
      setProposalFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setProposalFile(file);
  };

  const removeFile = () => {
    setProposalFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    if (!token) {
      setError("Sesi Anda telah berakhir. Silakan keluar lalu masuk kembali.");
      return;
    }

    if (!notes.trim()) {
      setError("Harap isi deskripsi atau catatan kerja sama yang diharapkan.");
      return;
    }

    if (!phone.trim()) {
      setError("Harap cantumkan nomor WhatsApp yang aktif.");
      return;
    }

    setIsSubmitting(true);
    let uploadedUrl: string | null = null;
    let uploadedFilename: string | null = null;

    // Upload proposal file if attached, through a signed URL issued by the server
    if (proposalFile) {
      const contentType =
        proposalFile.type ||
        (proposalFile.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

      const target = await createUploadTargetServerFn({
        data: { kind: "proposal", token: token ?? "", contentType, size: proposalFile.size },
      });
      if (!target.success || !target.target) {
        setIsSubmitting(false);
        setError(target.error || "Gagal menyiapkan unggahan proposal.");
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from(target.target.bucket)
        .uploadToSignedUrl(target.target.path, target.target.uploadToken, proposalFile, { contentType });

      if (uploadError) {
        setIsSubmitting(false);
        setError("Gagal mengunggah proposal. Coba lagi atau kirim tanpa dokumen.");
        return;
      }

      uploadedUrl = target.target.publicUrl;
      uploadedFilename = proposalFile.name;
    }

    const parsedNominal = nominal ? parseFloat(nominal.replace(/[^0-9]/g, "")) : null;

    const res = await submitMinatServerFn({
      data: {
        token: token ?? "",
        umkmId,
        investmentType,
        targetItem: targetItem.trim() || null,
        nominalInvestment: parsedNominal,
        notes: notes.trim(),
        contactPhone: phone.trim(),
        proposalUrl: uploadedUrl,
        proposalFilename: uploadedFilename,
      },
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.error || "Gagal mengirimkan minat investasi.");
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError(null);
    setTargetItem("");
    setNotes("");
    setNominal("");
    setProposalFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="clay" size="lg" className="w-full font-bold">
          Nyatakan Minat Investasi <ArrowRight className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg rounded-3xl sm:p-8">
        {!isLoggedIn ? (
          <div className="py-4 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-6" />
            </span>
            <DialogTitle className="font-display text-2xl font-bold">Masuk Sebagai Mitra</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Untuk mengajukan minat investasi atau kerja sama resmi dengan <strong>{umkmName}</strong>, silakan masuk
              ke akun mitra Anda terlebih dahulu.
            </DialogDescription>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="clay" size="default">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <LogIn className="size-4" /> Masuk Akun
                </Link>
              </Button>
              <Button asChild variant="outline" size="default">
                <Link to="/register" onClick={() => setOpen(false)}>
                  Daftar Mitra Baru
                </Link>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="py-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-green-500/10 text-green-600">
              <CheckCircle2 className="size-7" />
            </span>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Minat Investasi Berhasil Diajukan!
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Proposal minat investasi Anda untuk <strong>{umkmName}</strong> telah tersimpan di sistem. Administrator
              Desa Klepu dan pengelola UMKM akan meninjau dan menghubungi WhatsApp Anda untuk koordinasi lebih lanjut.
            </DialogDescription>
            <div className="mt-6">
              <Button variant="clay" onClick={handleReset}>
                Tutup
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-xl font-bold">
                Ajukan Minat Investasi — {umkmName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Mengajukan sebagai: <strong className="text-foreground">{user?.fullName}</strong> (
                {user?.mitraType} {user?.organizationName ? `· ${user?.organizationName}` : ""})
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="my-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Bentuk Kerja Sama */}
              <div className="space-y-1.5">
                <Label htmlFor="investmentType" className="text-xs font-semibold">
                  Bentuk Kerja Sama / Investasi *
                </Label>
                <select
                  id="investmentType"
                  value={investmentType}
                  onChange={(e) => setInvestmentType(e.target.value as typeof investmentType)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                >
                  <option value="modal_kerja">Penyertaan Modal Kerja</option>
                  <option value="pengadaan_alat">Pengadaan Alat & Mesin</option>
                  <option value="bagi_hasil">Skema Bagi Hasil (Profit Sharing)</option>
                  <option value="kemitraan_distribusi">Kemitraan Distribusi & Penjualan</option>
                  <option value="lainnya">Bentuk Lainnya</option>
                </select>
              </div>

              {/* What to invest on */}
              <div className="space-y-1.5">
                <Label htmlFor="targetItem" className="text-xs font-semibold">
                  What to invest on / Rencana Objek Investasi
                </Label>
                <Input
                  id="targetItem"
                  type="text"
                  placeholder="misal: Mesin sangrai liberika kapasitas 5kg, Bahan baku, atau Display kedai"
                  value={targetItem}
                  onChange={(e) => setTargetItem(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              {/* Nominal & WhatsApp */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nominal" className="text-xs font-semibold">
                    Estimasi Nominal (Rp)
                  </Label>
                  <Input
                    id="nominal"
                    type="number"
                    placeholder="misal: 25000000"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Nomor WhatsApp Aktif *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">
                  Deskripsi / Rencana Kerja Sama *
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Tuliskan gambaran skema kerja sama, target pencapaian, atau pertanyaan untuk pengelola UMKM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              {/* Proposal Document (Optional) - Strictly PDF and DOCX only */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="proposalFile" className="text-xs font-semibold">
                    Proposal Document (Optional)
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Hanya PDF (.pdf) atau Word (.docx), maks 20MB
                  </span>
                </div>

                {!proposalFile ? (
                  <div className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                    <input
                      ref={fileInputRef}
                      id="proposalFile"
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <FileUp className="size-5 text-primary" />
                      <p className="text-xs font-semibold text-foreground">
                        Pilih file dokumen proposal
                      </p>
                      <p className="text-[10px] text-muted-foreground">Format yang didukung: .pdf dan .docx</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="truncate text-xs font-semibold text-foreground">
                        {proposalFile.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        ({(proposalFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="size-7 text-muted-foreground hover:text-destructive"
                      title="Hapus file"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="clay"
                size="default"
                disabled={isSubmitting}
                className="mt-2 w-full font-bold"
              >
                {isSubmitting ? "Mengirimkan Pengajuan..." : "Kirim Pengajuan Minat"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
