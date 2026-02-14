'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GuideHero, GuideTOC, GuideNav, LanguageCard,
  CultureCard, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import {
  koreanLifeMeta, koreanLifeSections, survivalKorean,
  koreanMisunderstandings, culturalPoints,
  commonMistakes, learningResources,
} from '@/data/guides/korean-life';

export default function KoreanLifePage() {
  const [langTab, setLangTab] = useState('daily');

  return (
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
          <Tabs value={langTab} onValueChange={setLangTab}>
            <TabsList>
              <TabsTrigger value="daily">Өдөр тутам</TabsTrigger>
              <TabsTrigger value="work">Ажлын газар</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {survivalKorean.daily.map((item) => (
                  <LanguageCard key={item.korean} {...item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="work" className="mt-6" id="kl-work">
              <div className="grid sm:grid-cols-2 gap-3">
                {survivalKorean.work.map((item) => (
                  <LanguageCard key={item.korean} {...item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
  );
}
