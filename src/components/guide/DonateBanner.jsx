'use client';

import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';
import { analytics } from '@/lib/analytics-events';

export function DonateBanner() {
  return (
    <div className="mb-4 p-5 rounded-lg border-2 border-terracotta/30 bg-terracotta/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Coffee className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
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
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-terracotta text-white hover:bg-terracotta/90 transition-colors"
        >
          <Heart className="w-3.5 h-3.5" />
          Дэмжих
        </Link>
      </div>
    </div>
  );
}
