import { GraduationCap } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, StepList,
  InfoTable, WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner, ShareButtons,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  topikMeta, topikSections,
  whichTestTable, whichTestTip,
  epsTopikOverview, epsTopikWarnings,
  topikOverview, topikVsEpsTopik,
  epsRegistrationSteps, topikRegistrationSteps, registrationNote,
  epsAfterPassSteps, topikAfterPassUsage, afterPassWarnings,
  studyResources, studyTips,
  topikContacts, topikLinks,
} from '@/data/guides/topik';

const BASE_URL = 'https://koreamongol.com';

export default function TopikPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'TOPIK / EPS-TOPIK', url: `${BASE_URL}/topik` },
      ]} />
      <HowToJsonLd
        name="EPS-TOPIK шалгалтанд бүртгүүлэх"
        description="EPS-TOPIK шалгалтанд бүртгүүлэх алхмууд"
        steps={epsRegistrationSteps}
      />
    <main className="min-h-content bg-background">
      <GuideHero
        title={topikMeta.title}
        subtitle={topikMeta.subtitle}
        icon={GraduationCap}
        breadcrumbLabel="TOPIK"
      >
        <GuideTOC sections={topikSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Which Test */}
        <section id="topik-which-test">
          <h2 className="text-title text-navy dark:text-sky mb-6">Аль шалгалт надад хэрэгтэй вэ?</h2>
          <InfoTable
            headers={whichTestTable.headers}
            rows={whichTestTable.rows}
          />
          <TipBox className="mt-4" title="Чухал ялгаа">
            <p>{whichTestTip}</p>
          </TipBox>
        </section>

        {/* EPS-TOPIK */}
        <section id="topik-eps-overview">
          <h2 className="text-title text-navy dark:text-sky mb-6">EPS-TOPIK гэж юу вэ?</h2>
          <p className="text-sm text-muted-foreground mb-6">{epsTopikOverview.description}</p>

          <h3 className="text-base font-semibold font-heading mb-3">Шалгалтын бүтэц</h3>
          <InfoTable
            headers={epsTopikOverview.structure.headers}
            rows={epsTopikOverview.structure.rows}
          />

          <div className="mt-4 space-y-1.5">
            {epsTopikOverview.keyPoints.map((point, i) => (
              <p key={i} className="text-sm text-muted-foreground">&#8226; {point}</p>
            ))}
          </div>

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">Нас, нөхцөл</h3>
          <div className="p-4 rounded-lg border border-border bg-card">
            <ul className="space-y-1">
              {epsTopikOverview.eligibility.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
              ))}
            </ul>
          </div>

          <WarningBox className="mt-4" title="Анхааруулга">
            <ul className="space-y-1">
              {epsTopikWarnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* TOPIK General */}
        <section id="topik-general-overview">
          <h2 className="text-title text-navy dark:text-sky mb-6">TOPIK шалгалт гэж юу вэ?</h2>
          <p className="text-sm text-muted-foreground mb-6">{topikOverview.description}</p>

          <h3 className="text-base font-semibold font-heading mb-3">Түвшин ба тэнцэх оноо</h3>
          <InfoTable
            headers={topikOverview.levels.headers}
            rows={topikOverview.levels.rows}
          />

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">TOPIK I бүтэц (1~2 түвшин)</h3>
          <InfoTable
            headers={topikOverview.topik1Structure.headers}
            rows={topikOverview.topik1Structure.rows}
          />

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">TOPIK II бүтэц (3~6 түвшин)</h3>
          <InfoTable
            headers={topikOverview.topik2Structure.headers}
            rows={topikOverview.topik2Structure.rows}
          />

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">Шалгалтын төлбөр (Солонгос дотор)</h3>
          <InfoTable
            headers={topikOverview.fee.headers}
            rows={topikOverview.fee.rows}
          />
          <p className="text-xs text-muted-foreground mt-2">Гэрчилгээний хүчинтэй хугацаа: {topikOverview.validity}</p>

          <h3 className="text-base font-semibold font-heading mt-6 mb-3">TOPIK vs EPS-TOPIK харьцуулалт</h3>
          <InfoTable
            headers={topikVsEpsTopik.headers}
            rows={topikVsEpsTopik.rows}
          />
        </section>

        {/* Registration */}
        <section id="topik-register">
          <h2 className="text-title text-navy dark:text-sky mb-6">Шалгалтанд бүртгүүлэх</h2>

          <h3 className="text-base font-semibold font-heading mb-3">EPS-TOPIK бүртгэл</h3>
          <StepList steps={epsRegistrationSteps} />

          <h3 className="text-base font-semibold font-heading mt-8 mb-3">TOPIK бүртгэл</h3>
          <StepList steps={topikRegistrationSteps} />

          <TipBox className="mt-4" title="Монголд бүртгүүлэх">
            <p>{registrationNote}</p>
          </TipBox>
        </section>

        {/* After Pass */}
        <section id="topik-after-pass">
          <h2 className="text-title text-navy dark:text-sky mb-6">Тэнцсэний дараа</h2>

          <h3 className="text-base font-semibold font-heading mb-3">EPS-TOPIK тэнцсэний дараа</h3>
          <StepList steps={epsAfterPassSteps} />

          <h3 className="text-base font-semibold font-heading mt-8 mb-3">TOPIK оноо хэрхэн ашиглах</h3>
          <div className="space-y-3">
            {topikAfterPassUsage.map((item) => (
              <div key={item.purpose} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground">{item.purpose}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <WarningBox className="mt-4" title="Анхааруулга">
            <ul className="space-y-1">
              {afterPassWarnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Study Resources */}
        <section id="topik-study">
          <h2 className="text-title text-navy dark:text-sky mb-6">Бэлтгэл ба сурах материал</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {studyResources.map((resource) => (
              <LinkCard key={resource.href} {...resource} />
            ))}
          </div>
          <TipBox title="Бэлтгэлийн зөвлөгөө">
            <ul className="space-y-1">
              {studyTips.map((tip, i) => (
                <li key={i}>&#8226; {tip}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Links */}
        <section id="topik-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй утас / Линк</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {topikContacts.map((contact) => (
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
            {topikLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/topik" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="topik" />
      </div>
    </main>
    </>
  );
}
