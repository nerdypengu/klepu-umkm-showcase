// Shown while a slow route loader is running; a slim sweeping bar keeps the page feeling alive.
export function RoutePending() {
  return (
    <div role="status" aria-live="polite" className="min-h-screen bg-background">
      <div className="h-0.5 w-full overflow-hidden bg-primary/10">
        <div className="route-pending-bar h-full w-1/3 bg-primary" />
      </div>
      <span className="sr-only">Memuat halaman</span>
    </div>
  );
}
