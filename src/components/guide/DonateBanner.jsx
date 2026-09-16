'use client';

import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';
import { analytics } from '@/lib/analytics-events';

export function DonateBanner() {
  return (
    <div className="p-5 rounded-xl border border-terracotta/20 bg-terracotta/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Coffee className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Энэ мэдээлэл тусалсан уу?
            </p>
            <p className="text-xs text-muted-foreground">
              Нэг аяга кофегоор сайтын тогтвортой үйл ажиллагааг дэмжээрэй.
            </p>
          </div>
        </div>
        <Link
          href="/donate"
          onClick={() => analytics.donateClick('banner')}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-md text-sm font-medium bg-terracotta text-white hover:bg-terracotta-dark transition-colors"
        >
          <Heart className="w-3.5 h-3.5" />
          Дэмжих
        </Link>
      </div>
    </div>
  );
}
