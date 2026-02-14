import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TipBox({ title = 'Зөвлөгөө', children, className }) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-gold bg-[var(--tip-bg)] p-4 md:p-5',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-gold-dark shrink-0" />
        <h4 className="font-semibold font-heading text-gold-dark">{title}</h4>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}
