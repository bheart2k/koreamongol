import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUIDE_ORDER } from '@/data/guides/common';

export function GuideNav({ currentGuideId, className }) {
  const currentIndex = GUIDE_ORDER.findIndex((g) => g.id === currentGuideId);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? GUIDE_ORDER[currentIndex - 1] : null;
  const next = currentIndex < GUIDE_ORDER.length - 1 ? GUIDE_ORDER[currentIndex + 1] : null;

  return (
    <nav
      className={cn(
        'flex items-stretch gap-4 mt-12 pt-8 border-t border-border',
        className
      )}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex-1 flex items-center gap-3 p-4 rounded-lg border border-border hover:border-gold/40 hover:shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-gold shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground">Өмнөх</span>
            <p className="text-sm font-semibold font-heading text-foreground truncate">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex-1 flex items-center justify-end gap-3 p-4 rounded-lg border border-border hover:border-gold/40 hover:shadow-sm transition-all text-right"
        >
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground">Дараах</span>
            <p className="text-sm font-semibold font-heading text-foreground truncate">
              {next.title}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold shrink-0" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
