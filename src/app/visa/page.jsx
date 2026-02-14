import { FileText } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList,
  WarningBox, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  visaMeta, visaSections, mongoliaPrep,
  rejectionReasons, illegalStayWarnings, usefulLinks,
} from '@/data/guides/visa';
import { visaTypes } from '@/data/guides/visa';
import VisaTabs from './VisaTabs';

const BASE_URL = 'https://koreamongol.com';

export default function VisaPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Визний гарын авлага', url: `${BASE_URL}/visa` },
      ]} />
      <HowToJsonLd
        name="E-9 ажлын виз авах"
        description="Солонгост ажиллах E-9 виз авах үе шат"
        steps={visaTypes.e9.steps}
      />
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
          <VisaTabs />
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
    </>
  );
}
