import { Briefcase, ExternalLink } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, CheckList, StepList,
  InfoTable, WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  jobsMeta, jobsSections, visaWorkConditions,
  salaryInfo, contractChecklist, contractWarnings,
  jobSearchMethods, laborRights, generalRights,
  jobsContacts, jobsLinks,
} from '@/data/guides/jobs';

const BASE_URL = 'https://koreamongol.com';

export default function JobsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Ажил ба хөдөлмөр', url: `${BASE_URL}/jobs` },
      ]} />
      <HowToJsonLd
        name="Цалин олгохгүй үед хийх алхмууд"
        description="Солонгост цалин олгохгүй байх тохиолдолд гомдол гаргах алхмууд"
        steps={laborRights[0].steps}
      />
    <main className="min-h-content bg-background">
      <GuideHero
        title={jobsMeta.title}
        subtitle={jobsMeta.subtitle}
        icon={Briefcase}
        breadcrumbLabel="Ажил"
      >
        <GuideTOC sections={jobsSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Visa Work Conditions */}
        <section id="jobs-visa-conditions">
          <h2 className="text-title text-navy dark:text-sky mb-6">Визээр ажлын нөхцөл</h2>
          <InfoTable
            headers={visaWorkConditions.comparison.headers}
            rows={visaWorkConditions.comparison.rows}
          />

          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">E-9 зөвшөөрөгдсөн салбар:</h3>
            <div className="flex flex-wrap gap-2">
              {visaWorkConditions.e9Sectors.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-sky dark:bg-navy-light text-navy dark:text-sky">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <WarningBox className="mt-4">
            <ul className="space-y-1">
              {visaWorkConditions.warnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Salary */}
        <section id="jobs-salary">
          <h2 className="text-title text-navy dark:text-sky mb-6">Цалин / Хамгийн бага цалин ({salaryInfo.year})</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-xl border-2 border-gold/40 bg-gold/5 text-center">
              <p className="text-sm text-muted-foreground">Цагийн хөлс</p>
              <p className="text-2xl font-bold text-navy dark:text-sky">{salaryInfo.minimumWage.hourly}</p>
            </div>
            <div className="p-5 rounded-xl border-2 border-gold/40 bg-gold/5 text-center">
              <p className="text-sm text-muted-foreground">Сарын цалин (주 40시간)</p>
              <p className="text-2xl font-bold text-navy dark:text-sky">{salaryInfo.minimumWage.monthly}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-6">{salaryInfo.minimumWage.note}</p>

          <h3 className="text-base font-semibold font-heading mb-3">Илүү цагийн нэмэгдэл</h3>
          <InfoTable
            headers={salaryInfo.overtimeTable.headers}
            rows={salaryInfo.overtimeTable.rows}
          />

          {/* Deductions */}
          <div className="mt-6 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Цалингаас суутгах (공제)</h3>
            <div className="space-y-2">
              {salaryInfo.deductions.map((d) => (
                <div key={d.name} className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
                  <span className="font-medium text-foreground">{d.name}</span>
                  <span className="text-muted-foreground">{d.rate}{d.note && ` — ${d.note}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retirement */}
          <TipBox className="mt-4" title={salaryInfo.retirement.title}>
            <p><strong>Нөхцөл:</strong> {salaryInfo.retirement.condition}</p>
            <p><strong>Хэмжээ:</strong> {salaryInfo.retirement.amount}</p>
            <p><strong>Хугацаа:</strong> {salaryInfo.retirement.deadline}</p>
          </TipBox>

          <TipBox className="mt-4" title="Зөвлөгөө">
            <ul className="space-y-1">
              {salaryInfo.tips.map((t, i) => (
                <li key={i}>&#8226; {t}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Contract Checklist */}
        <section id="jobs-contract">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хөдөлмөрийн гэрээ шалгах</h2>
          <CheckList items={contractChecklist} storageKey="jobs-contract" />
          <WarningBox className="mt-4" title="Анхааруулга">
            <ul className="space-y-1">
              {contractWarnings.map((w, i) => (
                <li key={i}>&#8226; {w}</li>
              ))}
            </ul>
          </WarningBox>
        </section>

        {/* Job Search Methods */}
        <section id="jobs-how-to-find">
          <h2 className="text-title text-navy dark:text-sky mb-6">Ажил хайх арга</h2>
          <div className="space-y-3">
            {jobSearchMethods.map((method) => (
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
                    <a
                      href={method.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-terracotta hover:text-terracotta/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Labor Rights */}
        <section id="jobs-rights">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хөдөлмөрийн эрхийн хамгаалалт</h2>

          <div className="p-4 rounded-lg border border-border bg-card mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Таны эрх:</h3>
            <ul className="space-y-1">
              {generalRights.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground">&#8226; {r}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {laborRights.map((situation) => (
              <div key={situation.title}>
                <h3 className="text-base font-semibold font-heading mb-3">
                  <span className="mr-2">{situation.icon}</span>
                  {situation.title}
                </h3>
                <StepList steps={situation.steps} />
                {situation.importantNote && (
                  <TipBox className="mt-3" title="Чухал">
                    <p>{situation.importantNote}</p>
                  </TipBox>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contacts & Links */}
        <section id="jobs-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй утас / Линк</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {jobsContacts.map((contact) => (
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
            {jobsLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/jobs" />
        <DonateBanner />
        <GuideNav currentGuideId="jobs" />
      </div>
    </main>
    </>
  );
}
