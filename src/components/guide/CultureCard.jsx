import { cn } from '@/lib/utils';

export function CultureCard({ icon, title, description, className }) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-all',
        className
      )}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-sm font-semibold font-heading text-foreground mb-1">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
