'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GuideHero, GuideTOC, GuideNav, StepList, CheckList,
  WarningBox, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import {
  visaMeta, visaSections, visaTypes, mongoliaPrep,
  rejectionReasons, illegalStayWarnings, usefulLinks,
} from '@/data/guides/visa';

export default function VisaPage() {
  const [activeTab, setActiveTab] = useState('e9');
  const currentVisa = visaTypes[activeTab];

  return (
    <main className="min-h-content bg-background">
      <GuideHero
        title={visaMeta.title}
        subtitle={visaMeta.subtitle}
        icon={FileText}
        breadcrumbLabel="Виз"
      >
        <GuideTOC sections={visaSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Visa Types */}
        <section id="visa-types">
          <h2 className="text-title text-navy dark:text-sky mb-6">Визний төрлүүд</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="e9">E-9</TabsTrigger>
              <TabsTrigger value="d2">D-2</TabsTrigger>
              <TabsTrigger value="d4">D-4</TabsTrigger>
            </TabsList>

            {Object.entries(visaTypes).map(([key, visa]) => (
              <TabsContent key={key} value={key} className="mt-6 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold font-heading text-foreground mb-2">
                    {visa.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{visa.description}</p>
                </div>

                {/* Documents Checklist */}
                <div id={`visa-${key}`}>
                  <h4 className="text-base font-semibold font-heading text-foreground mb-4">
                    Шаардлагатай бичиг баримт
                  </h4>
                  <CheckList items={visa.documents} storageKey={`visa-${key}-docs`} />
                </div>

                {/* Steps */}
                <div>
                  <h4 className="text-base font-semibold font-heading text-foreground mb-4">
                    Визний үе шат
                  </h4>
                  <StepList steps={visa.steps} />
                </div>

                {/* Warnings */}
                <WarningBox>
                  <ul className="space-y-1">
                    {visa.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </WarningBox>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Mongolia Preparation */}
        <section id="visa-mongolia-prep">
          <h2 className="text-title text-navy dark:text-sky mb-6">Монголоос бэлтгэх зүйлс</h2>

          <TipBox title="Монгол Улсын ЭСЯ (Сөүл)">
            <p><strong>Хаяг:</strong> {mongoliaPrep.embassy.address}</p>
            <p><strong>Утас:</strong> <a href={`tel:${mongoliaPrep.embassy.phone}`} className="underline">{mongoliaPrep.embassy.phone}</a></p>
            <p><strong>И-мэйл:</strong> {mongoliaPrep.embassy.email}</p>
            {mongoliaPrep.embassy.website && (
              <p><strong>Вэб:</strong> <a href={mongoliaPrep.embassy.website} target="_blank" rel="noopener noreferrer" className="underline">{mongoliaPrep.embassy.website}</a></p>
            )}
          </TipBox>

          <div className="mt-6">
            <CheckList items={mongoliaPrep.checklist} storageKey="visa-mongolia-prep" />
          </div>
        </section>

        {/* Rejection Reasons */}
        <section id="visa-rejection">
          <h2 className="text-title text-navy dark:text-sky mb-6">Татгалзах шалтгаан</h2>
          <WarningBox title="Виз татгалзах гол шалтгаанууд">
            <ul className="space-y-1">
              {rejectionReasons.map((reason, i) => (
                <li key={i}>• {reason}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Illegal Stay */}
        <section id="visa-illegal">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хууль бус оршин суух</h2>
          <WarningBox title="Хууль бус оршин суухын үр дагавар">
            <ul className="space-y-1">
              {illegalStayWarnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Useful Links */}
        <section id="visa-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {usefulLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/visa" />
        <GuideNav currentGuideId="visa" />
      </div>
    </main>
  );
}
