import type { EvidenceStatus } from "@/lib/umkm-data";
import { cn } from "@/lib/utils";

const styles: Record<EvidenceStatus, string> = {
  Faktual: "bg-verified-soft text-verified",
  Turunan: "bg-info-soft text-info",
  "Perlu verifikasi": "bg-caution-soft text-caution",
  Simulasi: "bg-simulation-soft text-simulation",
  Rekomendasi: "bg-recommendation-soft text-recommendation",
};

export function StatusBadge({ status, className }: { status: EvidenceStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold", styles[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}