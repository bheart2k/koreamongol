import { BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GuideHero, GuideTOC, GuideNav,
  CultureCard, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  koreanLifeMeta, koreanLifeSections,
  koreanMisunderstandings, culturalPoints,
  commonMistakes, learningResources,
} from '@/data/guides/korean-life';
import KoreanLifeTabs from './KoreanLifeTabs';

const BASE_URL = 'https://koreamongol.com';

export default function KoreanLifePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Солонгос хэл & Соёл', url: `${BASE_URL}/korean-life` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title={koreanLifeMeta.title}
        subtitle={koreanLifeMeta.subtitle}
        icon={BookOpen}
        breadcrumbLabel="Солонгос хэл & Соёл"
      >
        <GuideTOC sections={koreanLifeSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        <TipBox title="Дуудлагын тухай">
          <p>Энд бичигдсэн дуудлага нь практик зориулалттай (монгол хүн хэлэхэд ойлгомжтой байхаар). Эрдэм шинжилгээний транскрипци биш.</p>
        </TipBox>

        {/* Daily Korean */}
        <section id="kl-daily">
          <h2 className="text-title text-navy dark:text-sky mb-6">Өдөр тутмын хэллэг</h2>
          <KoreanLifeTabs />
        </section>

        {/* Misunderstandings */}
        <section id="kl-misunderstand">
          <h2 className="text-title text-navy dark:text-sky mb-6">Буруу ойлголт</h2>
          <Accordion type="single" collapsible className="w-full">
            {koreanMisunderstandings.map((item, i) => (
              <AccordionItem key={i} value={`misunderstand-${i}`}>
                <AccordionTrigger className="text-left">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Cultural Points */}
        <section id="kl-culture">
          <h2 className="text-title text-navy dark:text-sky mb-6">Соёлын ялгаа</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {culturalPoints.map((point) => (
              <CultureCard key={point.title} {...point} />
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section id="kl-mistakes">
          <h2 className="text-title text-navy dark:text-sky mb-6">Түгээмэл алдаа TOP 5</h2>
          <div className="space-y-3">
            {commonMistakes.map((mistake, i) => (
              <TipBox key={i} title={`${i + 1}. ${mistake.title}`}>
                <p>{mistake.description}</p>
              </TipBox>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section id="kl-resources">
          <h2 className="text-title text-navy dark:text-sky mb-6">Суралцах эх сурвалж</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {learningResources.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/korean-life" />
        <GuideNav currentGuideId="korean-life" />
      </div>
    </main>
    </>
  );
}
