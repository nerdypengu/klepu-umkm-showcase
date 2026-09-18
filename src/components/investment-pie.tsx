interface Slice {
  label: string;
  value: string;
  highlight?: boolean;
}

function parseMidpoint(value: string): number | null {
  const numbers = value
    .replace(/\./g, "")
    .match(/\d+(?:,\d+)?/g)
    ?.map((n) => Number(n.replace(",", ".")));
  if (!numbers || numbers.length === 0) return null;
  const min = numbers[0]!;
  const max = numbers[1] ?? numbers[0]!;
  return (min + max) / 2;
}

const OPACITIES = [1, 0.78, 0.58, 0.42, 0.3, 0.22];

export function InvestmentPie({ slices, caption }: { slices: Slice[]; caption?: string }) {
  const parsed = slices
    .map((slice) => ({ ...slice, amount: parseMidpoint(slice.value) }))
    .filter((slice): slice is Slice & { amount: number } => slice.amount !== null && slice.amount > 0);
  if (parsed.length < 2) return null;

  const total = parsed.reduce((sum, slice) => sum + slice.amount, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = parsed.map((slice, index) => {
    const share = slice.amount / total;
    const segment = {
      ...slice,
      share,
      dash: share * circumference,
      offsetDash: offset * circumference,
      opacity: OPACITIES[index % OPACITIES.length]!,
    };
    offset += share;
    return segment;
  });

  return (
    <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-clay sm:p-7">
      <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div className="relative mx-auto size-48">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90">
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--color-primary)"
                strokeOpacity={segment.opacity}
                strokeWidth="32"
                strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                strokeDashoffset={-segment.offsetDash}
              />
            ))}
            <circle cx="80" cy="80" r={radius - 16} fill="var(--color-background)" />
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[0.65rem] font-bold uppercase text-muted-foreground">Total</p>
              <p className="font-display text-2xl font-extrabold text-primary">
                ±Rp{Math.round(total)} jt
              </p>
            </div>
          </div>
        </div>
        <ul className="space-y-3">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-start gap-3">
              <span
                className="mt-1 size-3.5 shrink-0 rounded-md bg-primary"
                style={{ opacity: segment.opacity }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className={`text-sm font-bold ${segment.highlight ? "text-primary" : ""}`}>{segment.label}</p>
                  <p className="text-sm font-semibold text-muted-foreground">{segment.value}</p>
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(segment.share * 100)}% dari total kebutuhan modal</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {caption && <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>}
    </div>
  );
}
