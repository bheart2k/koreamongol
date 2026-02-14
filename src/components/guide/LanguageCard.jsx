import { cn } from '@/lib/utils';

export function LanguageCard({ korean, pronunciation, meaning, situation, description, className }) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border border-border bg-card hover:border-gold/30 transition-colors',
        className
      )}
    >
      <p className="text-lg font-bold font-heading text-navy dark:text-sky mb-1">
        {korean}
      </p>
      {pronunciation && (
        <p className="text-sm text-gold-dark font-medium mb-1">
          [{pronunciation}]
        </p>
      )}
      <p className="text-sm text-foreground">{meaning}</p>
      {situation && (
        <p className="text-xs text-muted-foreground mt-2 italic">
          💡 {situation}
        </p>
      )}
      {description && (
        <div className="mt-3 pl-3 border-l-2 border-gold/40">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
