import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GuideHero({ title, subtitle, icon: Icon, breadcrumbLabel, children, className }) {
  return (
    <section
      className={cn(
        'bg-gradient-to-b from-sky to-background dark:from-navy/40 dark:to-background',
        'px-6 pt-8 pb-10 md:pt-12 md:pb-14',
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-navy dark:hover:text-sky transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="font-medium text-foreground" aria-current="page">
              {breadcrumbLabel || title}
            </li>
          </ol>
        </nav>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4">
          {Icon && (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/60 dark:bg-navy-light/60 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-navy dark:text-gold" />
            </div>
          )}
          <div>
            <h1 className="text-headline text-navy dark:text-sky">{title}</h1>
            {subtitle && (
              <p className="text-body text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Children slot (TOC, etc.) */}
        {children}
      </div>
    </section>
  );
}
