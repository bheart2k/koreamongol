import { MapPin, Smartphone } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList,
  TipBox, InfoTable, ReportBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  arrivalMeta, arrivalSections, arrivalTimeline,
  arrivalTips, essentialApps,
} from '@/data/guides/arrival';

const BASE_URL = 'https://koreamongol.com';

export default function ArrivalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Ирсний дараа', url: `${BASE_URL}/arrival` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title={arrivalMeta.title}
        subtitle={arrivalMeta.subtitle}
        icon={MapPin}
        breadcrumbLabel="Ирсний дараа"
      >
        <GuideTOC sections={arrivalSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Timeline Checklists */}
        {arrivalTimeline.map((period) => (
          <section key={period.storageKey} id={period.storageKey}>
            <h2 className="text-title text-navy dark:text-sky mb-6">{period.period}</h2>
            <CheckList
              items={period.items}
              storageKey={period.storageKey}
            />
          </section>
        ))}

        {/* Tips */}
        <section id="arrival-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Амьдралын зөвлөгөө</h2>
          <div className="space-y-4">
            {arrivalTips.map((tip) => (
              <TipBox key={tip.title} title={tip.title}>
                <p>{tip.description}</p>
              </TipBox>
            ))}
          </div>
        </section>

        {/* Essential Apps */}
        <section id="arrival-apps">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <Smartphone className="w-6 h-6 inline mr-2" />
            Заавал суулгах апп
          </h2>
          <InfoTable
            headers={['Апп', 'Төрөл', 'Тайлбар']}
            rows={essentialApps}
          />
        </section>

        <ReportBanner pageUrl="/arrival" />
        <GuideNav currentGuideId="arrival" />
      </div>
    </main>
    </>
  );
}
