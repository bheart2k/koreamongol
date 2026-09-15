import { SupportHeader } from '@/components/guide/SupportHeader';
import styles from '@/components/guide/SupportPages.module.css';
import pageStyles from '@/components/guide/IllustratedGuide.module.css';
import { HelpCircle } from 'lucide-react';
import { faqData, faqCategories } from '@/data/faq';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Түгээмэл асуултууд (FAQ)',
  description:
    'Солонгост амьдрах виз, ажил, орон сууц, мөнгө шилжүүлэг, TOPIK зэрэг түгээмэл асуултууд. Монгол иргэдэд зориулсан.',
  openGraph: {
    title: 'Түгээмэл асуултууд | KoreaMongol',
    description:
      'Солонгост амьдрах виз, ажил, орон сууц, мөнгө шилжүүлэг, TOPIK зэрэг түгээмэл асуултууд.',
    url: `${BASE_URL}/faq`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary',
    title: 'Түгээмэл асуултууд | KoreaMongol',
    description:
      'Солонгост амьдрах виз, ажил, орон сууц, мөнгө шилжүүлэг, TOPIK зэрэг түгээмэл асуултууд.',
  },
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },
};

export default function FAQPage() {
  const groupedFaqs = Object.keys(faqCategories).map((category) => ({
    category,
    label: faqCategories[category],
    items: faqData.filter((faq) => faq.category === category),
  }));

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Түгээмэл асуултууд', url: `${BASE_URL}/faq` },
      ]} />
      <FAQPageJsonLd faqs={faqData} />
      <main className={pageStyles.page}>
        {/* Hero Section */}
        <SupportHeader title="Түгээмэл асуултууд" subtitle="Солонгост амьдрахтай холбоотой түгээмэл асуулт, хариултыг эндээс олно уу." icon={HelpCircle} image="/images/guides/faq-mazaalai-l.png" />

        {/* FAQ Content */}
        <section className={styles.content}>
          <nav aria-label="Агуулга" className={styles.categories}>
            {groupedFaqs.map((group) => <a key={group.category} href={`#faq-${group.category}`}>{group.label}</a>)}
          </nav>
          <div className="max-w-4xl mx-auto space-y-12">
            {groupedFaqs.map((group) => (
              <div key={group.category} id={`faq-${group.category}`} className={styles.group}>
                <h2 className="text-title font-semibold mb-4 text-accent">
                  {group.label}
                </h2>
                <div className="overflow-hidden">
                  <FAQAccordion items={group.items} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
