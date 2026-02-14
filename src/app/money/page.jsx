import { Banknote, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, InfoTable,
  WarningBox, TipBox, LinkCard, ReportBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  moneyMeta, moneySections, remittanceComparison,
  remittanceMethods, exchangeTips, financeWarnings, moneyLinks,
} from '@/data/guides/money';

const BASE_URL = 'https://koreamongol.com';

export default function MoneyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Мөнгө шилжүүлэг', url: `${BASE_URL}/money` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title={moneyMeta.title}
        subtitle={moneyMeta.subtitle}
        icon={Banknote}
        breadcrumbLabel="Мөнгө шилжүүлэг"
      >
        <GuideTOC sections={moneySections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Comparison Table */}
        <section id="money-comparison">
          <h2 className="text-title text-navy dark:text-sky mb-6">Шилжүүлгийн арга харьцуулалт</h2>
          <InfoTable
            headers={remittanceComparison.headers}
            rows={remittanceComparison.rows}
          />
        </section>

        {/* Method Details */}
        <section id="money-methods">
          <h2 className="text-title text-navy dark:text-sky mb-6">Арга бүрийн дэлгэрэнгүй</h2>
          <div className="space-y-6">
            {remittanceMethods.map((method) => (
              <div
                key={method.name}
                className="p-5 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold font-heading text-foreground">
                    {method.name}
                  </h3>
                  {method.url && (
                    <a
                      href={method.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-dark hover:text-gold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Вэбсайт
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-status-success mb-2">
                      <ThumbsUp className="w-4 h-4" />
                      Давуу тал
                    </div>
                    <ul className="space-y-1">
                      {method.pros.map((p, i) => (
                        <li key={i} className="text-sm text-muted-foreground">✓ {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-status-error mb-2">
                      <ThumbsDown className="w-4 h-4" />
                      Сул тал
                    </div>
                    <ul className="space-y-1">
                      {method.cons.map((c, i) => (
                        <li key={i} className="text-sm text-muted-foreground">✗ {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warnings */}
        <section id="money-warnings">
          <h2 className="text-title text-navy dark:text-sky mb-6">Анхааруулга</h2>
          {financeWarnings.map((warning) => (
            <WarningBox key={warning.title} title={warning.title}>
              <ul className="space-y-1">
                {warning.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </WarningBox>
          ))}
        </section>

        {/* Tips */}
        <section id="money-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Зөвлөгөө</h2>
          <TipBox title="Ханшийн зөвлөгөө">
            <ul className="space-y-1">
              {exchangeTips.map((tip, i) => (
                <li key={i}>• {tip}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Links */}
        <section id="money-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {moneyLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/money" />
        <GuideNav currentGuideId="money" />
      </div>
    </main>
    </>
  );
}
