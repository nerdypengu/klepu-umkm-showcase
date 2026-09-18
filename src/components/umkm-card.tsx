import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Umkm } from "@/lib/umkm-data";

export function UmkmCard({ item }: { item: Umkm }) {
  return (
    <Link
      to="/umkm/$slug"
      params={{ slug: item.slug }}
      className="group flex h-full flex-col rounded-[1.75rem] bg-card p-4 shadow-clay transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={item.image}
          alt={item.imageAlt}
          width={800}
          height={640}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
            {item.category}
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {item.activeStatus}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-tight transition-colors group-hover:text-primary">
          {item.name}
        </h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {item.description ?? item.summary}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">
            Modal<br />
            <strong className="font-display text-base text-primary">{item.investment}</strong>
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-primary transition-colors group-hover:text-accent">
            Lihat potensi <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
