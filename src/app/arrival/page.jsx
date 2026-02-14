import { MapPin, Smartphone, Building2, Phone, FileCheck, ExternalLink } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList,
  TipBox, WarningBox, InfoTable, ReportBanner, DonateBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  arrivalMeta, arrivalSections, arrivalTimeline,
  arrivalTips, essentialApps, alienRegistration,
  bankRecommendations, phoneInfo,
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

        {/* Alien Registration Details */}
        <section id="arrival-alien">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <FileCheck className="w-6 h-6 inline mr-2" />
            {alienRegistration.title}
          </h2>

          <div className="p-5 rounded-lg border border-border bg-card mb-4">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Хугацаа</p>
                <p className="text-sm font-semibold text-foreground">{alienRegistration.deadline}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Хураамж</p>
                <p className="text-sm font-semibold text-foreground">{alienRegistration.cost}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Хүлээлт</p>
                <p className="text-sm font-semibold text-foreground">{alienRegistration.duration}</p>
              </div>
            </div>

            <p className="text-sm font-medium text-foreground mb-2">Шаардлагатай бичиг баримт:</p>
            <ul className="space-y-1 mb-4">
              {alienRegistration.required.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
              ))}
            </ul>

            <p className="text-sm font-medium text-foreground mb-2">{alienRegistration.howToFind.title}:</p>
            <div className="space-y-2">
              {alienRegistration.howToFind.items.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <a
                    href={item.href}
                    target={item.href.startsWith('tel:') ? undefined : '_blank'}
                    rel={item.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                    className="font-medium text-gold-dark hover:text-gold flex items-center gap-1"
                  >
                    {item.href.startsWith('tel:') ? (
                      <Phone className="w-3 h-3" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                    {item.label}
                  </a>
                  <span className="text-muted-foreground">— {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <WarningBox title="Анхаар!">
            <p>90 хоногийн дотор бүртгүүлэхгүй бол торгууль ногдуулна. Аль болох эрт бүртгүүлэх!</p>
          </WarningBox>
        </section>

        {/* Bank Recommendations */}
        <section id="arrival-bank">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <Building2 className="w-6 h-6 inline mr-2" />
            {bankRecommendations.title}
          </h2>

          <div className="p-5 rounded-lg border border-border bg-card mb-4">
            <p className="text-sm font-medium text-foreground mb-2">Шаардлагатай:</p>
            <ul className="space-y-1 mb-4">
              {bankRecommendations.required.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
              ))}
            </ul>

            <div className="space-y-4">
              {bankRecommendations.banks.map((bank) => (
                <div key={bank.name} className="p-3 rounded-md bg-muted/50">
                  <p className="text-sm font-semibold text-foreground">{bank.name}</p>
                  <p className="text-xs text-gold-dark mb-2">{bank.why}</p>
                  <ul className="space-y-0.5">
                    {bank.features.map((f, i) => (
                      <li key={i} className="text-sm text-muted-foreground">&#8226; {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <TipBox title="Зөвлөгөө">
            <p>{bankRecommendations.tip}</p>
          </TipBox>
        </section>

        {/* Phone / SIM */}
        <section id="arrival-phone">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <Smartphone className="w-6 h-6 inline mr-2" />
            {phoneInfo.title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Prepaid */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="text-base font-semibold font-heading text-foreground mb-1">
                {phoneInfo.prepaid.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{phoneInfo.prepaid.description}</p>
              <ul className="space-y-1 mb-3">
                {phoneInfo.prepaid.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Брэнд: {phoneInfo.prepaid.brands.join(', ')}
              </p>
            </div>

            {/* Postpaid */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="text-base font-semibold font-heading text-foreground mb-1">
                {phoneInfo.postpaid.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{phoneInfo.postpaid.description}</p>
              <ul className="space-y-1 mb-3">
                {phoneInfo.postpaid.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
                ))}
              </ul>
              <p className="text-xs font-medium text-foreground mb-1">Санал болгох MVNO:</p>
              {phoneInfo.postpaid.mvno.map((m) => (
                <p key={m.name} className="text-xs text-muted-foreground">
                  &#8226; <span className="font-medium">{m.name}</span> — {m.note}
                </p>
              ))}
            </div>
          </div>

          <TipBox title="KT тусгай нөхцөл">
            <p className="text-sm">{phoneInfo.postpaid.tip}</p>
          </TipBox>
        </section>

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
        <DonateBanner />
        <GuideNav currentGuideId="arrival" />
      </div>
    </main>
    </>
  );
}
