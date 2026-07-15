import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, MessageCircleQuestion, ArrowRight, ExternalLink } from 'lucide-react';
import { InfoTable, StepList, WarningBox, TipBox, DonateBanner, ShareButtons, ReportBanner, HelpfulWidget } from '@/components/guide';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { tips } from '@/data/tips';

const BASE_URL = 'https://koreamongol.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return tips.map((tip) => ({ slug: tip.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tip = tips.find((t) => t.slug === slug);
  if (!tip) return {};

  return {
    title: tip.question,
    description: tip.shortAnswer,
    keywords: tip.keywords,
    openGraph: {
      title: tip.question,
      description: tip.shortAnswer,
      url: `${BASE_URL}/tips/${tip.slug}`,
      images: [`/tips/${tip.slug}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title: tip.question,
      description: tip.shortAnswer,
    },
    alternates: {
      canonical: `${BASE_URL}/tips/${tip.slug}`,
    },
  };
}

function TipSection({ section }) {
  switch (section.type) {
    case 'text':
      return (
        <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
      );
    case 'table':
      return (
        <section>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-4">{section.title}</h2>
          )}
          <InfoTable headers={section.headers} rows={section.rows} />
        </section>
      );
    case 'steps':
      return (
        <section>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-2">{section.title}</h2>
          )}
          <StepList steps={section.items} />
        </section>
      );
    case 'list':
      return (
        <section>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-4">{section.title}</h2>
          )}
          <ul className="space-y-2 p-5 rounded-lg border border-border bg-card">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
            ))}
          </ul>
        </section>
      );
    case 'warning':
      return (
        <WarningBox title={section.title}>
          <ul className="space-y-1">
            {section.items.map((item, i) => (
              <li key={i}>&#8226; {item}</li>
            ))}
          </ul>
        </WarningBox>
      );
    case 'tip':
      return (
        <TipBox title={section.title}>
          <ul className="space-y-1">
            {section.items.map((item, i) => (
              <li key={i}>&#8226; {item}</li>
            ))}
          </ul>
        </TipBox>
      );
    default:
      return null;
  }
}

export default async function TipPage({ params }) {
  const { slug } = await params;
  const tip = tips.find((t) => t.slug === slug);
  if (!tip) notFound();

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Түргэн хариулт', url: `${BASE_URL}/tips` },
        { name: tip.question, url: `${BASE_URL}/tips/${tip.slug}` },
      ]} />
      <FAQPageJsonLd faqs={[{ question: tip.question, answer: tip.shortAnswer }]} />
      <main className="min-h-content bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sky to-background dark:from-navy/40 dark:to-background px-6 pt-8 pb-10 md:pt-12 md:pb-12">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-navy dark:hover:text-sky transition-colors">
                    <Home className="w-4 h-4" />
                  </Link>
                </li>
                <li><ChevronRight className="w-3.5 h-3.5" /></li>
                <li>
                  <Link href="/tips" className="hover:text-navy dark:hover:text-sky transition-colors">
                    Түргэн хариулт
                  </Link>
                </li>
                <li><ChevronRight className="w-3.5 h-3.5" /></li>
                <li className="font-medium text-foreground" aria-current="page">
                  {tip.categoryLabel}
                </li>
              </ol>
            </nav>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/60 dark:bg-navy-light/60 flex items-center justify-center shrink-0">
                <MessageCircleQuestion className="w-6 h-6 md:w-7 md:h-7 text-navy dark:text-gold" />
              </div>
              <div>
                <h1 className="text-headline text-navy dark:text-sky">{tip.question}</h1>
                <p className="text-xs text-muted-foreground/80 mt-1.5">
                  Сүүлд шинэчилсэн: {tip.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
          {/* Short answer */}
          <div className="p-5 rounded-xl border-2 border-gold/30 bg-gold/5">
            <p className="text-sm font-semibold font-heading text-navy dark:text-gold mb-2">
              Товч хариулт
            </p>
            <p className="text-body text-foreground leading-relaxed">{tip.shortAnswer}</p>
          </div>

          {/* Sections */}
          {tip.sections.map((section, i) => (
            <TipSection key={i} section={section} />
          ))}

          {/* Related links */}
          {tip.related?.length > 0 && (
            <section>
              <h2 className="text-title text-navy dark:text-sky mb-4">Дэлгэрэнгүй унших</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {tip.related.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <ExternalLink className="w-4 h-4 text-navy dark:text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <ArrowRight className="w-4 h-4 text-navy dark:text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </section>
          )}

          <HelpfulWidget path={`/tips/${tip.slug}`} />

          <ReportBanner pageUrl={`/tips/${tip.slug}`} />
          <DonateBanner />
          <ShareButtons />
        </div>
      </main>
    </>
  );
}
