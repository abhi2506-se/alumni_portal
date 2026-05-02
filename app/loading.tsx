// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-navy-700 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading…</p>
      </div>
    </div>
  );
}
