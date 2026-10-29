import * as React from "react";

// Only fetches and plays the video once it is near the viewport, and pauses it when it leaves.
export function LazyVideo({ src, poster, ...props }: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setNear(true);
          void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <video ref={ref} src={near ? src : undefined} poster={poster} preload="none" loop muted playsInline {...props} />;
}
