import Image from 'next/image';
import Link from 'next/link';
import styles from './arrival.module.css';
import { MapPin, Smartphone, Building2, Phone, FileCheck, ExternalLink, ArrowUpRight, ChevronRight, Home } from 'lucide-react';
import {
  GuideTOC, GuideNav, CheckList,
  TipBox, WarningBox, InfoTable, LinkCard, ReportBanner, DonateBanner, ShareButtons, RelatedTips, GuideViewTracker,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  arrivalMeta, arrivalSections, arrivalTimeline,
  arrivalTips, essentialApps, alienRegistration,
  bankRecommendations, phoneInfo, arrivalLinks,
} from '@/data/guides/arrival';

const BASE_URL = 'https://koreamongol.com';

export default function ArrivalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Ирсний дараа', url: `${BASE_URL}/arrival` },
      ]} />
      <HowToJsonLd
        name="Солонгост ирсний дараа хийх зүйлс"
        description="Солонгост шинээр ирсэн монгол иргэдэд зориулсан алхам алхмаар гарын авлага: бүртгэл, банк, утас, даатгал."
        steps={[
          { title: 'SIM карт ба T-money авах', description: '공항 편의점-оос SIM карт, T-money карт авах' },
          { title: 'Гадаадын иргэний бүртгэл (외국인등록)', description: '출입국관리사무소-д бүртгүүлэх (90 хоногийн дотор)' },
          { title: 'Банкны данс нээх', description: '외국인등록증 авсны дараа банкны данс нээх' },
          { title: 'Гар утасны гэрээ хийх', description: '외국인등록증-тэй бол 후불 гэрээ хийх боломжтой' },
          { title: 'Эрүүл мэндийн даатгалд бүртгүүлэх', description: '건강보험 бүртгэл хийлгэх' },
          { title: '주민센터-д бүртгүүлэх', description: '전입신고 хийх' },
        ]}
      />
    <main className={`${styles.page} min-h-content`}>
      <GuideViewTracker guideId="arrival" />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/" aria-label="KoreaMongol"><Home aria-hidden="true" /></Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{arrivalMeta.title}</span>
          </nav>
          <div className={styles.welcome}>
            <div className={styles.intro}>
              <span className={styles.emblem} aria-hidden="true"><MapPin /></span>
              <h1>{arrivalMeta.title}</h1>
              <p className={styles.subtitle}>{arrivalMeta.subtitle}</p>
              <p className={styles.updated}>Сүүлд шинэчилсэн: {arrivalMeta.lastUpdated}</p>
              <a href="#arrival-day1" className={styles.startLink}>
                {arrivalTimeline[0].period}<ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <Image src="/images/guides/arrival-mazaalai-l-transparent.png"
              alt="Аяллын чемодантай, тээврийн карт үзүүлж буй Мазаалай"
              width={1024} height={1536} priority
              sizes="(min-width: 768px) 240px, 150px" className={styles.mascot} />
          </div>
          <div className={styles.quickLinks}>
            <a href="#arrival-alien" className={styles.quickLink}>
              <Image src="/images/home/visa.png" alt="" width={1254} height={1254} sizes="72px" className={styles.documentArt} />
              <span>{alienRegistration.title}</span><ArrowUpRight aria-hidden="true" />
            </a>
            <a href="#arrival-bank" className={styles.quickLink}>
              <span className={styles.quickIcon} aria-hidden="true"><Building2 strokeWidth={1.4} /></span>
              <span>{bankRecommendations.title}</span><ArrowUpRight aria-hidden="true" />
            </a>
            <a href="#arrival-phone" className={styles.quickLink}>
              <span className={styles.quickIcon} aria-hidden="true"><Smartphone strokeWidth={1.4} /></span>
              <span>{phoneInfo.title}</span><ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <GuideTOC sections={arrivalSections} className={styles.toc} />
        </aside>
        <div className={styles.content}>
        {/* Timeline Checklists */}
        {arrivalTimeline.map((period, index) => (
          <section key={period.storageKey} id={period.storageKey} className={styles.timeline}>
            <h2 className={styles.periodTitle}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{period.period}</h2>
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

          <WarningBox className={styles.warning} title="Анхаар!">
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

          <TipBox className={styles.tip} title="Зөвлөгөө">
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

          <TipBox className={styles.tip} title="KT тусгай нөхцөл">
            <p className="text-sm">{phoneInfo.postpaid.tip}</p>
          </TipBox>
        </section>

        {/* Tips */}
        <section id="arrival-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Амьдралын зөвлөгөө</h2>
          <div className="space-y-4">
            {arrivalTips.map((tip) => (
              <TipBox className={styles.tip} key={tip.title} title={tip.title}>
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

        {/* Useful Links */}
        <section id="arrival-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линк</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {arrivalLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <RelatedTips slugs={['alien-registration', 'phone-sim', 'open-bank-account']} />

        <ReportBanner pageUrl="/arrival" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="arrival" />
        </div>
      </div>
    </main>
    </>
  );
}
