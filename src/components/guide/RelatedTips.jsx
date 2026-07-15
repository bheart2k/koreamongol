import Link from 'next/link';
import { MessageCircleQuestion, ChevronRight } from 'lucide-react';
import { tips } from '@/data/tips';

// 가이드 페이지 하단에 관련 tips(질문 페이지) 링크를 노출 — tips ↔ 가이드 상호 링크
export function RelatedTips({ slugs = [] }) {
  const items = slugs
    .map((slug) => tips.find((t) => t.slug === slug))
    .filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-title text-navy dark:text-sky mb-4">Түгээмэл асуулт</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((tip) => (
          <Link
            key={tip.slug}
            href={`/tips/${tip.slug}`}
            className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
              <MessageCircleQuestion className="w-4 h-4 text-navy dark:text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                {tip.question}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tip.shortAnswer}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-gold transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
