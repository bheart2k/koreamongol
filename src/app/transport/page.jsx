import {
  Train, CreditCard, Bus, Car, Zap, Smartphone, Lightbulb,
  ExternalLink, Download, Clock, MapPin,
} from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, InfoTable,
  WarningBox, TipBox, StepList, LinkCard, ReportBanner, DonateBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  transportMeta, transportSections, FARE_DATE,
  tmoney, metro, bus, taxi, ktx,
  transportApps, transportTips, transportLinks,
} from '@/data/guides/transport';

const BASE_URL = 'https://koreamongol.com';

export default function TransportPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Тээврийн гарын авлага', url: `${BASE_URL}/transport` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title={transportMeta.title}
        subtitle={transportMeta.subtitle}
        icon={Train}
        breadcrumbLabel="Тээвэр"
      >
        <GuideTOC sections={transportSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        <div className="text-xs text-muted-foreground text-right">
          <Clock className="w-3 h-3 inline mr-1" />
          Үнийн мэдээлэл: {FARE_DATE} огноогоор шалгасан. Үнэ өөрчлөгдөх боломжтой.
        </div>

        {/* T-money */}
        <section id="tr-card">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            {tmoney.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{tmoney.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Үнэ</h3>
              <p className="text-sm text-muted-foreground">{tmoney.price}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Хаанаас авах</h3>
              <ul className="space-y-1">
                {tmoney.where.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground">&#8226; {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card mb-4">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Цэнэглэх</h3>
            <ul className="space-y-1">
              {tmoney.charge.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {c}</li>
              ))}
            </ul>
          </div>

          <TipBox title="T-money давуу тал">
            <ul className="space-y-1">
              {tmoney.benefits.map((b, i) => (
                <li key={i}>&#8226; {b}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Metro */}
        <section id="tr-metro">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Train className="w-6 h-6" />
            {metro.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{metro.description}</p>

          <InfoTable
            headers={metro.fares.headers}
            rows={metro.fares.rows}
          />
          <p className="text-xs text-muted-foreground mt-2 mb-4">
            * {metro.distanceExtra}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4 text-navy dark:text-sky" />
            {metro.hours}
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Метрон дотор анхаарах</h3>
            <ul className="space-y-1">
              {metro.tips.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bus */}
        <section id="tr-bus">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Bus className="w-6 h-6" />
            {bus.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{bus.description}</p>

          <InfoTable
            headers={bus.types.headers}
            rows={bus.types.rows}
          />

          <div className="mt-6">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-3">Автобус хэрхэн ашиглах</h3>
            <StepList steps={bus.howTo} />
          </div>

          <WarningBox title="Буухдаа карт уншуул!">
            <p>Автобуснаас буухдаа заавал карт уншуулаарай. Уншуулахгүй бол дараагийн тээвэрт шилжих хөнгөлөлт авахгүй.</p>
          </WarningBox>
        </section>

        {/* Taxi */}
        <section id="tr-taxi">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Car className="w-6 h-6" />
            {taxi.title}
          </h2>

          <InfoTable
            headers={taxi.fares.headers}
            rows={taxi.fares.rows}
          />

          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Шөнийн нэмэлт (심야할증)</h3>
            <div className="space-y-2">
              {taxi.surcharge.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.time}</span>
                  <span className="font-semibold text-terracotta">{s.rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-2">Такси дуудах апп</h3>
            <div className="space-y-3">
              {taxi.apps.map((app) => (
                <div key={app.name} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.description}</p>
                  </div>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-gold-dark hover:text-gold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <TipBox title="Такси зөвлөгөө">
            <ul className="space-y-1">
              {taxi.tips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* KTX */}
        <section id="tr-ktx">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            {ktx.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{ktx.description}</p>

          <InfoTable
            headers={ktx.routes.headers}
            rows={ktx.routes.rows}
          />

          <div className="mt-6">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-3">Тасалбар захиалах</h3>
            <StepList steps={ktx.booking} />
          </div>

          <TipBox title="KTX зөвлөгөө">
            <ul className="space-y-1">
              {ktx.tips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Apps */}
        <section id="tr-apps">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Тээврийн аппууд
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {transportApps.map((app) => (
              <div key={app.name} className="p-4 rounded-lg border border-border bg-card">
                <h3 className="text-sm font-semibold font-heading text-foreground mb-1">{app.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{app.description}</p>
                <ul className="space-y-1">
                  {app.features.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground">&#10003; {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section id="tr-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            Зөвлөгөө
          </h2>
          <TipBox title="Тээврийн зөвлөгөө">
            <ul className="space-y-1">
              {transportTips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Links */}
        <section id="tr-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {transportLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/transport" />
        <DonateBanner />
        <GuideNav currentGuideId="transport" />
      </div>
    </main>
    </>
  );
}
