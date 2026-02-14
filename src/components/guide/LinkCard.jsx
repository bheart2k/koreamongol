import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LinkCard({ href, title, description, icon: Icon = ExternalLink, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-start gap-3 p-4 rounded-lg border border-border bg-card',
        'hover:shadow-md hover:border-gold/40 transition-all duration-200',
        className
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
        <Icon className="w-4 h-4 text-navy dark:text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-gold transition-colors" />
    </a>
  );
}
