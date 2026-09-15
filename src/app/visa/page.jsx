import Image from 'next/image';
import Link from 'next/link';
import styles from './visa.module.css';
import { FileText, Clock, AlertTriangle, ArrowRightLeft, TrendingUp, Home, ChevronRight, ArrowUpRight, List } from 'lucide-react';
import {
  GuideNav, CheckList,
  WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner, ShareButtons, RelatedTips, GuideViewTracker,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  visaMeta, visaSections, mongoliaPrep,
  rejectionReasons, illegalStayWarnings, usefulLinks,
  visaCostInfo, workplaceChange, longTermPaths,
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
    <main className={`${styles.page} min-h-content`}>
      <GuideViewTracker guideId="visa" />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/" aria-label="KoreaMongol"><Home aria-hidden="true" /></Link>
            <ChevronRight aria-hidden="true" /><span aria-current="page">Виз</span>
          </nav>
          <div className={styles.welcome}>
            <div>
              <span className={styles.emblem} aria-hidden="true"><FileText /></span>
              <h1>{visaMeta.title}</h1>
              <p className={styles.subtitle}>{visaMeta.subtitle}</p>
              <p className={styles.updated}>Сүүлд шинэчилсэн: {visaMeta.lastUpdated}</p>
              <a href="#visa-types" className={styles.startLink}>Визний төрлүүд<ArrowUpRight aria-hidden="true" /></a>
            </div>
            <Image src="/images/guides/visa-mazaalai-l.png" alt="Бичиг баримтаа шалгаж буй Мазаалай"
              width={1024} height={1536} sizes="(min-width: 768px) 240px, 140px" priority className={styles.mascot} />
          </div>
        </div>
      </section>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.toc} aria-label="Агуулга">
            <h2><List aria-hidden="true" />Агуулга</h2>
            <ul>{visaSections.map(({ id, title }) => (
              <li key={id}><a href={`#${id}`}>{title}</a></li>
            ))}</ul>
          </nav>
        </aside>
        <div className={styles.content}>
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

          <div className={styles.costGrid}>
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

          <WarningBox className={styles.warning} title={workplaceChange.deadline}>
            <p className="font-semibold">{workplaceChange.deadlineWarning}</p>
          </WarningBox>

          <TipBox className={styles.tip} title="Тоонд оруулахгүй тохиолдол">
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

        {/* Long-term Stay Paths */}
        <section id="visa-longterm">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <TrendingUp className="w-6 h-6 inline mr-2" />
            {longTermPaths.title}
          </h2>
          <p className="text-muted-foreground mb-6">{longTermPaths.intro}</p>

          <div className="space-y-4 mb-6">
            {longTermPaths.paths.map((path) => (
              <div key={path.name} className="p-5 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold font-heading text-foreground mb-2">{path.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{path.summary}</p>
                <h4 className="text-sm font-semibold text-foreground mb-2">Болзол:</h4>
                <ul className="space-y-1 mb-3">
                  {path.requirements.map((r, i) => (
                    <li key={i} className="text-sm text-muted-foreground">&#8226; {r}</li>
                  ))}
                </ul>
                {path.note && <p className="text-xs text-gold-dark">{path.note}</p>}
              </div>
            ))}
          </div>

          <WarningBox className={styles.warning} title="Жил бүр өөрчлөгдөнө">
            <p>{longTermPaths.warning}</p>
          </WarningBox>

          <TipBox className={styles.tip} title="Одооноос бэлдэх зүйлс">
            <ul className="space-y-1">
              {longTermPaths.checklist.map((item, i) => (
                <li key={i}>&#8226; {item}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Mongolia Preparation */}
        <section id="visa-mongolia-prep">
          <h2 className="text-title text-navy dark:text-sky mb-6">Монголоос бэлтгэх зүйлс</h2>

          <TipBox className={styles.tip} title="Монгол Улсын ЭСЯ (Сөүл)">
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
          <WarningBox className={styles.warning} title="Виз татгалзах гол шалтгаанууд">
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
          <WarningBox className={styles.warning} title="Хууль бус оршин суухын үр дагавар">
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

        <RelatedTips slugs={['e9-reentry', 'e9-to-e74', 'visa-extension']} />

        <ReportBanner pageUrl="/visa" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="visa" />
        </div>
      </div>
    </main>
    </>
  );
}
