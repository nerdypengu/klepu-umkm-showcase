interface Row {
  label: string;
  value: string;
  highlight?: boolean;
}

function parseRange(value: string): { min: number; max: number } | null {
  const numbers = value
    .replace(/\./g, "")
    .match(/\d+(?:,\d+)?/g)
    ?.map((n) => Number(n.replace(",", ".")));
  if (!numbers || numbers.length === 0) return null;
  const min = numbers[0]!;
  const max = numbers[1] ?? numbers[0]!;
  return { min, max };
}

export function InvestmentChart({ rows, caption }: { rows: Row[]; caption?: string }) {
  const parsed = rows
    .map((row) => ({ ...row, range: parseRange(row.value) }))
    .filter((row): row is Row & { range: { min: number; max: number } } => row.range !== null);
  if (parsed.length < 2) return null;
  const scale = Math.max(...parsed.map((row) => row.range.max));

  return (
    <div className="rounded-[1.75rem] border border-border bg-background p-6 shadow-clay sm:p-7">
      <div className="space-y-5">
        {parsed.map((row) => {
          const left = (row.range.min / scale) * 100;
          const width = Math.max(((row.range.max - row.range.min) / scale) * 100, 3);
          return (
            <div key={row.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className={`text-sm font-bold ${row.highlight ? "text-primary" : ""}`}>{row.label}</p>
                <p className="text-sm font-semibold text-muted-foreground">{row.value}</p>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${row.highlight ? "bg-primary" : "bg-primary/45"}`}
                  style={{ marginLeft: `${left}%`, width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>Rp0</span>
        <span>Rp{scale} juta</span>
      </div>
      {caption && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{caption}</p>}
    </div>
  );
}
