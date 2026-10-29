import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { UserPlus, AlertCircle, Building2, User, Building } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [mitraType, setMitraType] = React.useState<"personal" | "organisasi" | "persero">("personal");
  const [organizationName, setOrganizationName] = React.useState("");
  const [organizationPosition, setOrganizationPosition] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password || !fullName.trim() || !phone.trim()) {
      setError("Harap lengkapi semua kolom wajib.");
      return;
    }

    if (mitraType !== "personal" && !organizationName.trim()) {
      setError("Nama organisasi/perusahaan wajib diisi untuk mitra institusi.");
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      username: username.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
      mitraType,
      organizationName: mitraType !== "personal" ? organizationName.trim() : null,
      organizationPosition: mitraType !== "personal" ? organizationPosition.trim() : null,
      address: address.trim() || null,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Gagal melakukan pendaftaran.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card p-8 shadow-clay">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-clay">
              <UserPlus className="size-6" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">Daftar Mitra UMKM</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Bergabung sebagai mitra investasi dan pendamping UMKM Desa Klepu
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipe Mitra */}
            <div className="space-y-2">
              <Label>Jenis Kemitraan *</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMitraType("personal")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                    mitraType === "personal"
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                      : "border-border/80 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <User className="mb-1.5 size-5" />
                  <span className="text-xs">Personal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMitraType("organisasi")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                    mitraType === "organisasi"
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                      : "border-border/80 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Building2 className="mb-1.5 size-5" />
                  <span className="text-xs">Organisasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMitraType("persero")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                    mitraType === "persero"
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                      : "border-border/80 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Building className="mb-1.5 size-5" />
                  <span className="text-xs">Persero / PT</span>
                </button>
              </div>
            </div>

            {/* Nama Organisasi jika bukan personal */}
            {mitraType !== "personal" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="organizationName">Nama Organisasi / PT *</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="misal: PT Sumber Barokah"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organizationPosition">Jabatan / Posisi</Label>
                  <Input
                    id="organizationPosition"
                    type="text"
                    placeholder="misal: Direktur, PIC"
                    value={organizationPosition}
                    onChange={(e) => setOrganizationPosition(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nama Lengkap / PIC *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Username & Password */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username Login *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="misal: mitra_klepu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat / Kota Asal</Label>
              <Input
                id="address"
                type="text"
                placeholder="misal: Surabaya / Ponorogo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              variant="clay"
              size="lg"
              className="mt-2 w-full font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar Sebagai Mitra"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-5 text-center text-xs text-muted-foreground">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
