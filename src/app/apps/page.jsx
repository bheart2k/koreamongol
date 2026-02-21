import Link from 'next/link';
import {
  Smartphone, ShoppingCart, Bus, Languages, Wrench, Globe,
  Lightbulb, ExternalLink, ArrowRight, AlertTriangle, Download,
} from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, TipBox, WarningBox,
  LinkCard, ReportBanner, DonateBanner, ShareButtons,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  appsMeta, appsSections, essentialApps, shoppingApps,
  transportApps, translateApps, toolLinks, usefulWebsites,
  appTips, appWarning, appsLinks,
} from '@/data/guides/apps';

const BASE_URL = 'https://koreamongol.com';

function AppCard({ app }) {
  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold font-heading text-foreground">
          {app.name}
        </h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky dark:bg-navy-light text-navy dark:text-sky font-medium">
          {app.category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
      {app.tip && (
        <p className="text-xs text-gold-dark mb-3">
          <Lightbulb className="w-3 h-3 inline mr-1" />
          {app.tip}
        </p>
      )}
      <div className="flex items-center gap-3">
        {app.playStore && (
          <a
            href={app.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-navy dark:text-sky hover:text-gold transition-colors"
          >
            <Download className="w-3 h-3" />
            Play Store
          </a>
        )}
        {app.website && (
          <a
            href={app.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-gold transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Вэбсайт
          </a>
        )}
      </div>
    </div>
  );
}

export default function AppsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: appsMeta.title, url: `${BASE_URL}/apps` },
      ]} />
      <main className="min-h-content bg-background">
        <GuideHero
          title={appsMeta.title}
          subtitle={appsMeta.subtitle}
          icon={Smartphone}
          breadcrumbLabel={appsMeta.title}
        >
          <GuideTOC sections={appsSections} />
        </GuideHero>

        <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
          {/* Essential Apps */}
          <section id="apps-essential">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <Smartphone className="w-6 h-6 inline mr-2" />
              Заавал суулгах апп
            </h2>
            <div className="space-y-4">
              {essentialApps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </section>

          {/* Shopping & Delivery */}
          <section id="apps-shopping">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <ShoppingCart className="w-6 h-6 inline mr-2" />
              Худалдаа & хүргэлт
            </h2>
            <div className="space-y-4">
              {shoppingApps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </section>

          {/* Transport & Maps */}
          <section id="apps-transport">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <Bus className="w-6 h-6 inline mr-2" />
              Тээвэр & газрын зураг
            </h2>
            <div className="space-y-4">
              {transportApps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </section>

          {/* Translation & Dictionary */}
          <section id="apps-translate">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <Languages className="w-6 h-6 inline mr-2" />
              Орчуулга & толь бичиг
            </h2>
            <div className="space-y-4">
              {translateApps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </section>

          {/* Tools & Calculators */}
          <section id="apps-tools">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <Wrench className="w-6 h-6 inline mr-2" />
              Тооцоолуур & хэрэгсэл
            </h2>
            <div className="space-y-3">
              {toolLinks.map((tool) => (
                tool.isInternal ? (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                      <Wrench className="w-4 h-4 text-navy dark:text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-gold transition-colors" />
                  </Link>
                ) : (
                  <LinkCard key={tool.href} href={tool.href} title={tool.title} description={tool.description} icon={Wrench} />
                )
              ))}
            </div>
          </section>

          {/* Useful Websites */}
          <section id="apps-websites">
            <h2 className="text-title text-navy dark:text-sky mb-6">
              <Globe className="w-6 h-6 inline mr-2" />
              Хэрэгтэй вэбсайтууд
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {usefulWebsites.map((site) => (
                <LinkCard key={site.href} href={site.href} title={site.title} description={site.description} icon={Globe} />
              ))}
            </div>
          </section>

          {/* Tips */}
          <section id="apps-tips">
            <h2 className="text-title text-navy dark:text-sky mb-6">Апп суулгах зөвлөгөө</h2>
            <TipBox title="Зөвлөгөө">
              <ul className="space-y-1">
                {appTips.map((tip, i) => (
                  <li key={i}>&#8226; {tip}</li>
                ))}
              </ul>
            </TipBox>
            <div className="mt-4">
              <WarningBox title="Анхааруулга">
                <p>{appWarning}</p>
              </WarningBox>
            </div>
          </section>

          {/* Related Guides */}
          <section>
            <h2 className="text-title text-navy dark:text-sky mb-6">Холбоотой гарын авлага</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {appsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-gold/40 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold font-heading text-foreground group-hover:text-gold-dark transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          <ReportBanner pageUrl="/apps" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="apps" />
        </div>
      </main>
    </>
  );
}
