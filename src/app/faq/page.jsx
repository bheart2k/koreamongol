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
      <main className="min-h-content bg-background">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-display mb-4">Түгээмэл асуултууд</h1>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              Солонгост амьдрахтай холбоотой түгээмэл асуулт, хариултыг
              эндээс олно уу.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto space-y-12">
            {groupedFaqs.map((group) => (
              <div key={group.category}>
                <h2 className="text-title font-semibold mb-4 text-accent">
                  {group.label}
                </h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
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
