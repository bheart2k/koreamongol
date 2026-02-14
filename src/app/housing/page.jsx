import { Home, ExternalLink } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList, StepList,
  InfoTable, WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  housingMeta, housingSections, housingTypes, costSystem,
  housingSearchMethods, contractSteps, housingChecklist,
  housingContractWarnings, moveInLife, scamWarnings, savingTips,
  housingContacts, housingLinks,
} from '@/data/guides/housing';

const BASE_URL = 'https://koreamongol.com';

export default function HousingPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Байр ба орон сууц', url: `${BASE_URL}/housing` },
      ]} />
      <HowToJsonLd
        name="Солонгост байрны гэрээ хийх алхмууд"
        description="Байр хайхаас эхлээд гэрээ байгуулах хүртэлх алхмууд"
        steps={contractSteps}
      />
    <main className="min-h-content bg-background">
      <GuideHero
        title={housingMeta.title}
        subtitle={housingMeta.subtitle}
        icon={Home}
        breadcrumbLabel="Байр"
      >
        <GuideTOC sections={housingSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Housing Types */}
        <section id="housing-types">
          <h2 className="text-title text-navy dark:text-sky mb-6">Байрны төрлүүд</h2>
          <InfoTable
            headers={housingTypes.comparison.headers}
            rows={housingTypes.comparison.rows}
          />
          <p className="text-xs text-muted-foreground mt-2">{housingTypes.note}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {housingTypes.details.map((type) => (
              <div key={type.title} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-lg mb-1">{type.icon} <span className="text-sm font-semibold font-heading">{type.title}</span></p>
                <p className="text-xs text-muted-foreground mb-3">{type.description}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400 mb-1">Давуу:</p>
                    <ul className="space-y-0.5 text-muted-foreground">
                      {type.pros.map((p, i) => <li key={i}>+ {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-500 mb-1">Сул:</p>
                    <ul className="space-y-0.5 text-muted-foreground">
                      {type.cons.map((c, i) => <li key={i}>- {c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost System */}
        <section id="housing-cost-system">
          <h2 className="text-title text-navy dark:text-sky mb-6">Барьцаа / Түрээс / 관리비</h2>

          <div className="space-y-3 mb-6">
            {costSystem.concepts.map((c) => (
              <div key={c.title} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{c.icon} {c.title}</p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <p className="text-xs text-gold-dark mt-1">{c.example}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-1">{costSystem.maintenanceFee.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{costSystem.maintenanceFee.description}</p>
            <div className="space-y-1.5">
              {costSystem.maintenanceFee.items.map((item) => (
                <div key={item.name} className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.included}</span>
                </div>
              ))}
            </div>
          </div>

          <WarningBox className="mt-4" title="Өвөл анхааруулга">
            <p>{costSystem.winterWarning}</p>
          </WarningBox>
        </section>

        {/* How to Find */}
        <section id="housing-how-to-find">
          <h2 className="text-title text-navy dark:text-sky mb-6">Байр хайх арга</h2>
          <div className="space-y-3">
            {housingSearchMethods.map((method) => (
              <div key={method.title} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{method.title}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-sky dark:bg-navy-light text-navy dark:text-sky mt-1">
                      {method.target}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">{method.description}</p>
                  </div>
                  {method.url && (
                    <a href={method.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-terracotta hover:text-terracotta/80">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contract */}
        <section id="housing-contract">
          <h2 className="text-title text-navy dark:text-sky mb-6">Гэрээний чеклист</h2>
          <StepList steps={contractSteps} />
          <div className="mt-6">
            <CheckList items={housingChecklist} storageKey="housing-contract" />
          </div>
          <WarningBox className="mt-4" title="Анхааруулга">
            <ul className="space-y-1">
              {housingContractWarnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Move-in Life */}
        <section id="housing-move-in">
          <h2 className="text-title text-navy dark:text-sky mb-6">Нүүж орсны дараа</h2>

          <h3 className="text-base font-semibold font-heading mb-3">Хог ангилал (분리수거)</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            {moveInLife.garbageCategories.map((cat) => (
              <div key={cat.type} className="p-3 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold">{cat.icon} {cat.type}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.rule}</p>
                <p className="text-xs text-muted-foreground">{cat.note}</p>
              </div>
            ))}
          </div>
          <WarningBox>
            <p>{moveInLife.garbageWarning}</p>
          </WarningBox>

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">Дуу чимээний дүрэм (층간소음)</h3>
          <div className="p-4 rounded-lg border border-border bg-card">
            <ul className="space-y-1">
              {moveInLife.noiseRules.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {r}</li>
              ))}
            </ul>
          </div>

          <TipBox className="mt-6" title="Гарах үед">
            <ul className="space-y-1">
              {moveInLife.movingOutTips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Scam Warnings */}
        <section id="housing-warnings">
          <h2 className="text-title text-navy dark:text-sky mb-6">Залилан сэрэмжлүүлэг</h2>
          <WarningBox title="Залилангаас сэргийлэх">
            <ul className="space-y-1">
              {scamWarnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
          <TipBox className="mt-4" title="Хэмнэх зөвлөгөө">
            <ul className="space-y-1">
              {savingTips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Links */}
        <section id="housing-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй утас / Линк</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {housingContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-terracotta/40 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{contact.emoji}</span>
                <div>
                  <p className="text-sm font-semibold font-heading">{contact.label}</p>
                  <p className="text-lg font-bold text-terracotta">{contact.number}</p>
                  <p className="text-xs text-muted-foreground">{contact.description}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/housing" />
        <DonateBanner />
        <GuideNav currentGuideId="housing" />
      </div>
    </main>
    </>
  );
}
