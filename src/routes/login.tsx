import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/mitra" });
      }
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Harap isi username dan password.");
      return;
    }

    setIsSubmitting(true);
    const res = await login(username.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Username atau password salah.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-8 shadow-clay">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-clay">
              <LogIn className="size-6" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">Masuk Akun Mitra</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gunakan username dan password yang telah Anda daftarkan
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="misal: budi_santoso atau pt_makmur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              variant="clay"
              size="lg"
              className="w-full font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-5 text-center text-xs text-muted-foreground">
            Belum memiliki akun mitra?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Daftar Mitra Sekarang
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
