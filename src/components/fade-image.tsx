import * as React from "react";
import { cn } from "@/lib/utils";

// Lazy image that fades in once decoded, instead of popping in.
export function FadeImage({ className, onLoad, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = React.useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  // Cached images can finish before hydration, so check once on mount.
  React.useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      loading="lazy"
      decoding="async"
      {...props}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
