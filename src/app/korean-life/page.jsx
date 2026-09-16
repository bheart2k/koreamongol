import { GuideSection } from '@/components/guide/GuideSection';
import { IllustratedGuideHeader, IllustratedGuideBody } from '@/components/guide/IllustratedGuide';
import styles from '@/components/guide/IllustratedGuide.module.css';
import { BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GuideNav,
  CultureCard, TipBox, LinkCard, ReportBanner, DonateBanner, ShareButtons, GuideViewTracker,
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
    <main className={styles.page}>
      <GuideViewTracker guideId="korean-life" />
      <IllustratedGuideHeader
        meta={koreanLifeMeta}
        sections={koreanLifeSections}
        quickIds={["kl-daily","kl-culture","kl-resources"]}
        image="/images/guides/korean-life-mazaalai-l.png"
        icon={BookOpen}
        breadcrumbLabel={koreanLifeMeta.title}
      />

      <IllustratedGuideBody sections={koreanLifeSections}>
        <TipBox title="Дуудлагын тухай" className={styles.tip}>
          <p>Энд бичигдсэн дуудлага нь практик зориулалттай (монгол хүн хэлэхэд ойлгомжтой байхаар). Эрдэм шинжилгээний транскрипци биш.</p>
        </TipBox>

        {/* Daily Korean */}
        <GuideSection id="kl-daily">
          <h2 className="text-title text-navy dark:text-sky mb-6">Өдөр тутмын хэллэг</h2>
          <KoreanLifeTabs />
        </GuideSection>

        {/* Misunderstandings */}
        <GuideSection id="kl-misunderstand">
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
        </GuideSection>

        {/* Cultural Points */}
        <GuideSection id="kl-culture">
          <h2 className="text-title text-navy dark:text-sky mb-6">Соёлын ялгаа</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {culturalPoints.map((point) => (
              <CultureCard key={point.title} {...point} />
            ))}
          </div>
        </GuideSection>

        {/* Common Mistakes */}
        <GuideSection id="kl-mistakes">
          <h2 className="text-title text-navy dark:text-sky mb-6">Түгээмэл алдаа TOP 5</h2>
          <div className="space-y-3">
            {commonMistakes.map((mistake, i) => (
              <TipBox key={i} title={`${i + 1}. ${mistake.title}`} className={styles.tip}>
                <p>{mistake.description}</p>
              </TipBox>
            ))}
          </div>
        </GuideSection>

        {/* Learning Resources */}
        <GuideSection id="kl-resources">
          <h2 className="text-title text-navy dark:text-sky mb-6">Суралцах эх сурвалж</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {learningResources.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </GuideSection>

        <ReportBanner pageUrl="/korean-life" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="korean-life" />
      </IllustratedGuideBody>
    </main>
    </>
  );
}
