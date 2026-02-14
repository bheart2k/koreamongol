import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WarningBox({ title = 'Анхааруулга', children, className }) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-terracotta bg-[var(--warning-bg)] p-4 md:p-5',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-terracotta shrink-0" />
        <h4 className="font-semibold font-heading text-terracotta">{title}</h4>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}
