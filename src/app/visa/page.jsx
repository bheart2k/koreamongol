import { FileText, Clock, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList,
  WarningBox, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  visaMeta, visaSections, mongoliaPrep,
  rejectionReasons, illegalStayWarnings, usefulLinks,
  visaCostInfo, workplaceChange,
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

        {/* Cost & Duration */}
        <section id="visa-cost">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <Clock className="w-6 h-6 inline mr-2" />
            {visaCostInfo.title}
          </h2>

          <div className="space-y-4 mb-6">
            {visaCostInfo.visas.map((v) => (
              <div key={v.type} className="p-4 rounded-lg border border-border bg-card">
                <h3 className="text-base font-semibold font-heading text-foreground mb-3">{v.type}</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Оршин суух:</span>
                    <p className="font-medium text-foreground">{v.stay}</p>
                    {v.stayExtra && (
                      <p className="text-xs text-gold-dark mt-1">{v.stayExtra}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Шийдвэрлэх хугацаа:</span>
                    <p className="font-medium text-foreground">{v.processing}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Хураамж:</span>
                    <p className="font-medium text-foreground">{v.cost}</p>
                  </div>
                  {v.finance && (
                    <div>
                      <span className="text-muted-foreground">Санхүүгийн баталгаа:</span>
                      <p className="font-medium text-foreground">{v.finance}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Extension */}
          <div className="p-5 rounded-lg border-2 border-gold/30 bg-gold/5">
            <h3 className="text-lg font-semibold font-heading text-foreground mb-3">
              {visaCostInfo.extension.title}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Хураамж:</span>
                <p className="font-bold text-foreground text-lg">{visaCostInfo.extension.cost}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Хаана:</span>
                <p className="font-medium text-foreground">{visaCostInfo.extension.where}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Хэзээ:</span>
                <p className="font-medium text-foreground">{visaCostInfo.extension.when}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Онлайн:</span>
                <p className="font-medium text-foreground">{visaCostInfo.extension.online}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Workplace Change */}
        <section id="visa-workplace">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <ArrowRightLeft className="w-6 h-6 inline mr-2" />
            {workplaceChange.title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {workplaceChange.limits.map((limit) => (
              <div key={limit.period} className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-sm text-muted-foreground">{limit.period}</p>
                <p className="text-lg font-bold text-navy dark:text-sky">{limit.count}</p>
              </div>
            ))}
          </div>

          <WarningBox title={workplaceChange.deadline}>
            <p className="font-semibold">{workplaceChange.deadlineWarning}</p>
          </WarningBox>

          <TipBox title="Тоонд оруулахгүй тохиолдол">
            <p>{workplaceChange.exceptions}</p>
          </TipBox>

          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">Хэрхэн хүсэлт гаргах:</h3>
            <ul className="space-y-1 mb-3">
              {workplaceChange.howTo.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold text-foreground mb-2">Шаардлагатай бичиг баримт:</h3>
            <ul className="space-y-1">
              {workplaceChange.requiredDocs.map((doc, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {doc}</li>
              ))}
            </ul>
          </div>
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
                <li key={i}>&#8226; {reason}</li>
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
                <li key={i}>&#8226; {w}</li>
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
