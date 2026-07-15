import Link from 'next/link';
import { MessageCircleQuestion, ChevronRight } from 'lucide-react';
import { GuideHero, AskQuestionCta } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { tips, tipsMeta } from '@/data/tips';

const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Түргэн хариулт — Түгээмэл асуултын товч хариулт',
  description:
    'Мөнгө шилжүүлэг, T-money карт, виз сунгах, оюутны цагийн ажил, цалин нэхэх — хамгийн их асуудаг асуултуудын товч, тодорхой хариулт.',
  keywords: ['түргэн хариулт', 'асуулт хариулт', 'гадаад гуйвуулга', 'метро карт', 'виз сунгах', '알바'],
  openGraph: {
    title: 'Түргэн хариулт | KoreaMongol',
    description: 'Нэг асуулт — нэг хариулт. Хамгийн их асуудаг зүйлсийн товч хариулт',
    url: `${BASE_URL}/tips`,
    images: ['/tips/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Түргэн хариулт | KoreaMongol',
    description: 'Нэг асуулт — нэг хариулт',
  },
  alternates: {
    canonical: `${BASE_URL}/tips`,
  },
};

export default function TipsPage() {
  const sortedTips = [...tips].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Түргэн хариулт', url: `${BASE_URL}/tips` },
      ]} />
      <main className="min-h-content bg-background">
        <GuideHero
          title={tipsMeta.title}
          subtitle={tipsMeta.subtitle}
          icon={MessageCircleQuestion}
          breadcrumbLabel="Түргэн хариулт"
        />

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="space-y-3">
            {sortedTips.map((tip) => (
              <Link
                key={tip.slug}
                href={`/tips/${tip.slug}`}
                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                  <MessageCircleQuestion className="w-5 h-5 text-navy dark:text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {tip.categoryLabel} · {tip.lastUpdated}
                  </p>
                  <h2 className="text-base font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                    {tip.question}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {tip.shortAnswer}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <AskQuestionCta pageUrl="/tips" />
          </div>
        </div>
      </main>
    </>
  );
}
