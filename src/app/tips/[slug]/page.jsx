import Link from 'next/link';
import styles from './tip-detail.module.css';
import pageStyles from '@/components/guide/IllustratedGuide.module.css';
import { GuideSection } from '@/components/guide/GuideSection';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
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

function TipSection({ section, id }) {
  switch (section.type) {
    case 'text':
      return (
        <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
      );
    case 'table':
      return (
        <GuideSection id={id} className={styles.section}>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-4">{section.title}</h2>
          )}
          <InfoTable headers={section.headers} rows={section.rows} />
        </GuideSection>
      );
    case 'steps':
      return (
        <GuideSection id={id} className={styles.section}>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-2">{section.title}</h2>
          )}
          <StepList steps={section.items} />
        </GuideSection>
      );
    case 'list':
      return (
        <GuideSection id={id} className={styles.section}>
          {section.title && (
            <h2 className="text-title text-navy dark:text-sky mb-4">{section.title}</h2>
          )}
          <ul className={styles.list}>
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
            ))}
          </ul>
        </GuideSection>
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
      <main className={`${pageStyles.page} min-h-content`}>
        <header className={styles.header}>
          <nav aria-label="Хуудасны зам" className={styles.breadcrumb}>
            <Link href="/" aria-label="Нүүр"><Home aria-hidden="true" /></Link>
            <ChevronRight aria-hidden="true" />
            <Link href="/tips">Түргэн хариулт</Link>
          </nav>
          <p className={styles.category}>{tip.categoryLabel}</p>
          <h1>{tip.question}</h1>
          <p className={styles.updated}>Сүүлд шинэчилсэн: {tip.lastUpdated}</p>
        </header>

        <div className={styles.content}>
          <section className={styles.answer} aria-labelledby="short-answer-title">
            <h2 id="short-answer-title">Товч хариулт</h2>
            <p>{tip.shortAnswer}</p>
          </section>

          {/* Sections */}
          {tip.sections.map((section, i) => (
            <TipSection key={i} id={`tip-section-${i}`} section={section} />
          ))}

          {/* Related links */}
          {tip.related?.length > 0 && (
            <section className={styles.related}>
              <h2>Дэлгэрэнгүй унших</h2>
              <div className={styles.links}>
                {tip.related.map((link) => {
                  const content = <><div><h3>{link.title}</h3><p>{link.description}</p></div>
                    {link.external ? <ExternalLink aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</>;
                  return link.external ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.relatedLink}>{content}</a>
                  ) : (
                    <Link key={link.href} href={link.href} className={styles.relatedLink}>{content}</Link>
                  );
                })}
              </div>
            </section>
          )}

          <Link href="/tips" className={styles.back}><ArrowLeft aria-hidden="true" />Бүх асуултыг харах</Link>

          <HelpfulWidget path={`/tips/${tip.slug}`} />

          <ReportBanner pageUrl={`/tips/${tip.slug}`} />
          <DonateBanner />
          <ShareButtons />
        </div>
      </main>
    </>
  );
}
