'use client';

export function StatCard({ title, value, icon: Icon, loading, description, status }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <div className="mt-2">
        {loading ? (
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {status && (
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          <div className="h-4 w-12 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function DataCard({ title, icon: Icon, children, loading, description }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {Icon && <Icon className="size-5" />}
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {loading ? <LoadingSkeleton rows={5} /> : children}
    </div>
  );
}

export function EmptyState({ message = '데이터가 없습니다' }) {
  return (
    <p className="text-sm text-muted-foreground text-center py-8">{message}</p>
  );
}

export function ProgressBar({ value, max, label, sublabel }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="min-w-0">
          <span className="truncate block">{label}</span>
          {sublabel && (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          )}
        </div>
        <span className="font-medium tabular-nums ml-2">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
