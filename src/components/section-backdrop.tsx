import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BackdropVariant = "hero" | "tint" | "grid" | "warm" | "rings" | "wave";

const fadeY = "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)";
const fadeRadial = "radial-gradient(ellipse at center, black 30%, transparent 75%)";

const ink = "color-mix(in oklch, var(--foreground) 14%, transparent)";
const ringInk = "color-mix(in oklch, var(--primary) 16%, transparent)";

function mask(value: string): CSSProperties {
  return { maskImage: value, WebkitMaskImage: value };
}

function Layers({ variant }: { variant: BackdropVariant }) {
  switch (variant) {
    case "hero":
      return (
        <>
          <div className="blob -right-24 -top-24 size-[28rem] bg-primary/12" />
          <div className="blob -bottom-32 -left-24 size-[24rem] bg-accent/10 [animation-delay:-8s]" />
          <div
            className="absolute inset-0 opacity-70"
            style={{ backgroundImage: `radial-gradient(${ink} 1px, transparent 1px)`, backgroundSize: "24px 24px", ...mask(fadeRadial) }}
          />
        </>
      );
    case "tint":
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/50 to-secondary/10" style={mask(fadeY)} />
          <div className="blob -left-32 bottom-0 size-[22rem] bg-primary/8 [animation-delay:-5s]" />
        </>
      );
    case "grid":
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
              ...mask(fadeRadial),
            }}
          />
        </>
      );
    case "warm":
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" style={mask(fadeY)} />
          <div className="blob right-[8%] top-10 size-80 bg-primary/10" />
          <div className="blob -bottom-20 left-[12%] size-72 bg-accent/10 [animation-delay:-10s]" />
        </>
      );
    case "rings":
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" style={mask(fadeY)} />
          <div
            className="absolute -right-40 top-1/2 size-[44rem] -translate-y-1/2"
            style={{
              backgroundImage: `repeating-radial-gradient(circle at center, transparent 0 46px, ${ringInk} 46px 47px)`,
              ...mask("radial-gradient(circle at center, black 25%, transparent 70%)"),
            }}
          />
        </>
      );
    case "wave":
      return (
        <div className="flex h-full flex-col" style={{ color: "var(--band)" }}>
          <Wave />
          <div className="-my-px flex-1 bg-current" />
          <Wave flip />
        </div>
      );
  }
}

// Wavy edge of the catalog band; fills with the surrounding `color`.
function Wave({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={cn("block h-12 w-full shrink-0 sm:h-16", flip && "-scale-y-100")}
      fill="currentColor"
    >
      <path d="M0 64V32C180 8 360 0 540 20s360 44 540 24c130-14 250-30 360-8v36Z" />
    </svg>
  );
}

export function SectionBackdrop({
  variant,
  className,
  children,
}: {
  variant: BackdropVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={variant === "wave" ? undefined : mask(fadeY)}
      >
        <Layers variant={variant} />
      </div>
      {children}
    </div>
  );
}
