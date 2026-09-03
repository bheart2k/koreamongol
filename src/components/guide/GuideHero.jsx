import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GuideHero({ title, subtitle, lastUpdated, icon: Icon, breadcrumbLabel, children, illustration, className }) {
  return (
    <section
      className={cn(
        'bg-gradient-to-b from-sky to-background dark:from-navy/40 dark:to-background',
        'px-6 pt-8 pb-10 md:pt-12 md:pb-14',
        className
      )}
    >
      <div className="relative max-w-4xl mx-auto">
        <div className="min-w-0">
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
              {lastUpdated && (
                <p className="text-xs text-muted-foreground/80 mt-1.5">
                  Сүүлд шинэчилсэн: {lastUpdated}
                </p>
              )}
            </div>
          </div>

          {illustration && (
            <div className="relative mx-auto mb-6 h-[340px] w-full max-w-[320px] min-[1440px]:absolute min-[1440px]:left-full min-[1440px]:top-8 min-[1440px]:ml-6 min-[1440px]:mb-0 min-[1440px]:h-[450px] min-[1440px]:w-[calc((100vw-56rem)/2-1.5rem)] min-[1440px]:max-w-[300px]">
              {illustration}
            </div>
          )}

          {/* Children slot (TOC, etc.) */}
          {children}
        </div>
      </div>
    </section>
  );
}
