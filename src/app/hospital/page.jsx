import { Heart } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GuideHero, GuideTOC, GuideNav, EmergencyBanner, StepList,
  InfoTable, LinkCard, WarningBox, TipBox, ReportBanner, DonateBanner, ShareButtons,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  hospitalMeta, hospitalSections, emergencyContacts,
  hospitalSteps, insuranceComparison, interpreterServices,
  situationGuides, pharmacyGuide, undocumentedAccess,
} from '@/data/guides/hospital';

const BASE_URL = 'https://koreamongol.com';

export default function HospitalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Эмнэлэг', url: `${BASE_URL}/hospital` },
      ]} />
      <HowToJsonLd
        name="Солонгост эмнэлэгт хандах"
        description="Солонгост эмнэлэгт хандах үе шат"
        steps={hospitalSteps}
      />
    <main className="min-h-content bg-background">
      <EmergencyBanner
        sticky
        items={emergencyContacts.slice(0, 3)}
      />

      <GuideHero
        title={hospitalMeta.title}
        subtitle={hospitalMeta.subtitle}
        icon={Heart}
        breadcrumbLabel="Эмнэлэг"
      >
        <GuideTOC sections={hospitalSections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Emergency Contacts (full list) */}
        <section id="hospital-emergency">
          <h2 className="text-title text-navy dark:text-sky mb-6">Яаралтай холбоо барих</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact) => (
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
        </section>

        {/* Hospital Steps */}
        <section id="hospital-steps">
          <h2 className="text-title text-navy dark:text-sky mb-6">Эмнэлэгт хандах</h2>
          <StepList steps={hospitalSteps} />
        </section>

        {/* Pharmacy Guide */}
        <section id="hospital-pharmacy">
          <h2 className="text-title text-navy dark:text-sky mb-6">{pharmacyGuide.title}</h2>
          <StepList steps={pharmacyGuide.steps.map((s, i) => ({ title: `${i + 1}`, description: s }))} />

          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">{pharmacyGuide.otc.title}</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {pharmacyGuide.otc.items.map((item) => (
                <div key={item.name} className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.use}</span>
                </div>
              ))}
            </div>
          </div>

          <TipBox className="mt-4" title="Анхаар">
            <p>{pharmacyGuide.tip}</p>
          </TipBox>
        </section>

        {/* Insurance Comparison */}
        <section id="hospital-insurance">
          <h2 className="text-title text-navy dark:text-sky mb-6">Даатгалын мэдээлэл</h2>
          <InfoTable
            headers={insuranceComparison.headers}
            rows={insuranceComparison.rows}
          />
          <TipBox className="mt-4" title="Даатгалын зөвлөгөө">
            <p>Гадаадын иргэн 6 сар дээш оршин суувал Үндэсний эрүүл мэндийн даатгал (국민건강보험) заавал (E-9, D-2 визтэй бол ирсэн даруй). Сар бүр ~₩159,000 төлнө (2026 он).</p>
          </TipBox>
        </section>

        {/* Undocumented Access */}
        <section id="hospital-undocumented">
          <h2 className="text-title text-navy dark:text-sky mb-6">{undocumentedAccess.title}</h2>
          <div className="space-y-3 mb-4">
            {undocumentedAccess.items.map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <TipBox title="Мэдэх зүйл">
            <p>{undocumentedAccess.warning}</p>
          </TipBox>
        </section>

        {/* Interpreter Services */}
        <section id="hospital-interpreter">
          <h2 className="text-title text-navy dark:text-sky mb-6">Орчуулга / Тусламж</h2>
          <TipBox title="1345 дуудах">
            <p>1345 (гадаадын иргэдийн мэдээллийн төв) руу залгаж орчуулга хүсэх боломжтой. 20 хэлээр үйлчилнэ.</p>
          </TipBox>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {interpreterServices.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        {/* Situation Guides */}
        <section id="hospital-situations">
          <h2 className="text-title text-navy dark:text-sky mb-6">Тохиолдлоор</h2>
          <Accordion type="single" collapsible className="w-full">
            {situationGuides.map((guide, i) => (
              <AccordionItem key={i} value={`situation-${i}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <span>{guide.icon}</span>
                    <span>{guide.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {guide.content}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Tips */}
        <section id="hospital-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Зөвлөгөө</h2>
          <WarningBox>
            <ul className="space-y-1">
              <li>• Паспорт / 외국인등록증 заавал авчрах</li>
              <li>• Даатгалын карт (건강보험증) авчрах</li>
              <li>• Papago апп бэлдэх (орчуулга)</li>
              <li>• Өвчний шинж тэмдэг, эмийн нэрийг тэмдэглэх</li>
            </ul>
          </WarningBox>
        </section>

        <ReportBanner pageUrl="/hospital" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="hospital" />
      </div>
    </main>
    </>
  );
}
