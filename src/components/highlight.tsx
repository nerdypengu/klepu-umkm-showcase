import type { ReactNode } from "react";

// Emphasis for the few words that should pull the eye: heavier, larger, brand color.
export function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-[1.18em] font-black text-primary">{children}</span>;
}
