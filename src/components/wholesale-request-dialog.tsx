import * as React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Plus, X } from "lucide-react";
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
import type { Umkm } from "@/lib/umkm-data";
import { submitWholesaleRequestServerFn } from "@/lib/wholesale.functions";
import { cn } from "@/lib/utils";

const units = ["pcs", "kemasan", "kg", "liter", "dus"] as const;

interface ItemRow {
  key: number;
  umkmId: string;
  quantity: string;
  unit: string;
}

const selectClass = "w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium";

export function WholesaleRequestDialog({ umkmList }: { umkmList: Umkm[] }) {
  const [open, setOpen] = React.useState(false);
  const [requesterType, setRequesterType] = React.useState<"personal" | "organisasi">("personal");
  const [fullName, setFullName] = React.useState("");
  const [organizationName, setOrganizationName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [items, setItems] = React.useState<ItemRow[]>([{ key: 0, umkmId: "", quantity: "", unit: "pcs" }]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const nextKey = React.useRef(1);

  const updateItem = (key: number, patch: Partial<ItemRow>) =>
    setItems((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  const addItem = () => setItems((rows) => [...rows, { key: nextKey.current++, umkmId: "", quantity: "", unit: "pcs" }]);
  const removeItem = (key: number) => setItems((rows) => rows.filter((row) => row.key !== key));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const filled = items.filter((row) => row.umkmId);
    if (filled.length === 0) {
      setError("Pilih minimal satu produk yang dibutuhkan.");
      return;
    }
    if (filled.some((row) => !(Number(row.quantity) > 0))) {
      setError("Isi jumlah untuk setiap produk yang dipilih.");
      return;
    }

    setIsSubmitting(true);
    const res = await submitWholesaleRequestServerFn({
      data: {
        requesterType,
        fullName: fullName.trim(),
        organizationName: requesterType === "organisasi" ? organizationName.trim() : null,
        phone: phone.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null,
        items: filled.map((row) => {
          const umkm = umkmList.find((item) => item.id === row.umkmId);
          return {
            umkmId: row.umkmId,
            productName: umkm ? `${umkm.product} (${umkm.name})` : row.umkmId,
            quantity: Number(row.quantity),
            unit: row.unit,
          };
        }),
      },
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.error || "Gagal mengirim permintaan grosir.");
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isSuccess) {
      setIsSuccess(false);
      setFullName("");
      setOrganizationName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setItems([{ key: nextKey.current++, umkmId: "", quantity: "", unit: "pcs" }]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="clay" size="lg">
          Ajukan Permintaan Grosir <ArrowRight className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl sm:p-8">
        {isSuccess ? (
          <div className="py-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </span>
            <DialogTitle className="font-display text-2xl font-bold">Permintaan Anda sudah kami terima</DialogTitle>
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
              <DialogTitle className="font-display text-xl font-bold">Permintaan Grosir</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Sebutkan produk dan jumlah yang dibutuhkan. Harga dan ketersediaan akan dikonfirmasi oleh pengelola.
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
                <span className="text-xs font-semibold">Mengajukan sebagai *</span>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Jenis pemohon">
                  {(["personal", "organisasi"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={requesterType === type}
                      onClick={() => setRequesterType(type)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                        requesterType === type
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-input text-muted-foreground hover:bg-muted/40",
                      )}
                    >
                      {type === "personal" ? "Perorangan" : "Organisasi / Usaha"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ws-name" className="text-xs font-semibold">
                  Nama lengkap *
                </Label>
                <Input
                  id="ws-name"
                  required
                  maxLength={120}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              {requesterType === "organisasi" && (
                <div className="space-y-1.5">
                  <Label htmlFor="ws-org" className="text-xs font-semibold">
                    Nama organisasi / toko *
                  </Label>
                  <Input
                    id="ws-org"
                    required
                    maxLength={160}
                    placeholder="misal: Toko Oleh-oleh Reog Ponorogo"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ws-phone" className="text-xs font-semibold">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="ws-phone"
                    type="tel"
                    required
                    maxLength={40}
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ws-email" className="text-xs font-semibold">
                    Email
                  </Label>
                  <Input
                    id="ws-email"
                    type="email"
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold">Produk yang dibutuhkan *</legend>
                {items.map((row, index) => (
                  <div key={row.key} className="grid grid-cols-[1fr_5rem_5.5rem_auto] items-center gap-2">
                    <select
                      aria-label={`Produk ${index + 1}`}
                      value={row.umkmId}
                      onChange={(e) => updateItem(row.key, { umkmId: e.target.value })}
                      className={selectClass}
                    >
                      <option value="">Pilih produk</option>
                      {umkmList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.product} ({item.name})
                        </option>
                      ))}
                    </select>
                    <Input
                      aria-label={`Jumlah produk ${index + 1}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="Jumlah"
                      value={row.quantity}
                      onChange={(e) => updateItem(row.key, { quantity: e.target.value })}
                      className="rounded-xl text-xs"
                    />
                    <select
                      aria-label={`Satuan produk ${index + 1}`}
                      value={row.unit}
                      onChange={(e) => updateItem(row.key, { unit: e.target.value })}
                      className={selectClass}
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(row.key)}
                      disabled={items.length === 1}
                      className="size-8 text-muted-foreground hover:text-destructive"
                      aria-label={`Hapus produk ${index + 1}`}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
                {items.length < 30 && (
                  <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5 px-2 text-xs text-primary">
                    <Plus className="size-3.5" /> Tambah produk
                  </Button>
                )}
              </fieldset>

              <div className="space-y-1.5">
                <Label htmlFor="ws-notes" className="text-xs font-semibold">
                  Catatan
                </Label>
                <Textarea
                  id="ws-notes"
                  rows={3}
                  maxLength={1500}
                  placeholder="Tujuan pengiriman, tenggat kebutuhan, atau pertanyaan lain"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <Button type="submit" variant="clay" disabled={isSubmitting} className="mt-2 w-full font-bold">
                {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
