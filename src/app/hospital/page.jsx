import { GuideSection } from '@/components/guide/GuideSection';
import { IllustratedGuideHeader, IllustratedGuideBody } from '@/components/guide/IllustratedGuide';
import styles from '@/components/guide/IllustratedGuide.module.css';
import { Heart } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GuideNav, EmergencyBanner, StepList,
  InfoTable, LinkCard, WarningBox, TipBox, ReportBanner, DonateBanner, ShareButtons, RelatedTips, GuideViewTracker,
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
    <main className={[styles.page, styles.hospital].join(" ")}>
      <GuideViewTracker guideId="hospital" />
      <EmergencyBanner
        sticky
        items={emergencyContacts.slice(0, 3)}
      />

      <IllustratedGuideHeader meta={hospitalMeta} sections={hospitalSections} quickIds={["hospital-emergency","hospital-steps","hospital-interpreter"]} image="/images/guides/hospital-mazaalai-l.png" icon={Heart} breadcrumbLabel="Эмнэлэг" />

      <IllustratedGuideBody sections={hospitalSections}>
        {/* Emergency Contacts (full list) */}
        <GuideSection alwaysOpen id="hospital-emergency">
          <h2 className="text-title text-navy dark:text-sky mb-6">Яаралтай холбоо барих</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className={[styles.contact, "flex items-center gap-3 border border-border hover:shadow-sm transition-all"].join(" ")}
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
        </GuideSection>

        {/* Hospital Steps */}
        <GuideSection id="hospital-steps">
          <h2 className="text-title text-navy dark:text-sky mb-6">Эмнэлэгт хандах</h2>
          <StepList steps={hospitalSteps} />
        </GuideSection>

        {/* Pharmacy Guide */}
        <GuideSection id="hospital-pharmacy">
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

          <TipBox className={[styles.tip, "mt-4"].join(" ")} title="Анхаар">
            <p>{pharmacyGuide.tip}</p>
          </TipBox>
        </GuideSection>

        {/* Insurance Comparison */}
        <GuideSection id="hospital-insurance">
          <h2 className="text-title text-navy dark:text-sky mb-6">Даатгалын мэдээлэл</h2>
          <InfoTable
            headers={insuranceComparison.headers}
            rows={insuranceComparison.rows}
          />
          <TipBox className={[styles.tip, "mt-4"].join(" ")} title="Даатгалын зөвлөгөө">
            <p>Гадаадын иргэн 6 сар дээш оршин суувал Үндэсний эрүүл мэндийн даатгал (국민건강보험) заавал (E-9, D-2 визтэй бол ирсэн даруй). Сар бүр ~₩159,000 төлнө (2026 он).</p>
          </TipBox>
        </GuideSection>

        {/* Undocumented Access */}
        <GuideSection id="hospital-undocumented">
          <h2 className="text-title text-navy dark:text-sky mb-6">{undocumentedAccess.title}</h2>
          <div className="space-y-3 mb-4">
            {undocumentedAccess.items.map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <TipBox title="Мэдэх зүйл" className={styles.tip}>
            <p>{undocumentedAccess.warning}</p>
          </TipBox>
        </GuideSection>

        {/* Interpreter Services */}
        <GuideSection id="hospital-interpreter">
          <h2 className="text-title text-navy dark:text-sky mb-6">Орчуулга / Тусламж</h2>
          <TipBox title="1345 дуудах" className={styles.tip}>
            <p>1345 (гадаадын иргэдийн мэдээллийн төв) руу залгаж орчуулга хүсэх боломжтой. 20 хэлээр үйлчилнэ.</p>
          </TipBox>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {interpreterServices.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </GuideSection>

        {/* Situation Guides */}
        <GuideSection id="hospital-situations">
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
        </GuideSection>

        {/* Tips */}
        <GuideSection id="hospital-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Зөвлөгөө</h2>
          <WarningBox className={styles.warning}>
            <ul className="space-y-1">
              <li>• Паспорт / 외국인등록증 заавал авчрах</li>
              <li>• Даатгалын карт (건강보험증) авчрах</li>
              <li>• Papago апп бэлдэх (орчуулга)</li>
              <li>• Өвчний шинж тэмдэг, эмийн нэрийг тэмдэглэх</li>
            </ul>
          </WarningBox>
        </GuideSection>

        <RelatedTips slugs={['hospital-visit', 'emergency-numbers']} />

        <ReportBanner pageUrl="/hospital" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="hospital" />
      </IllustratedGuideBody>
    </main>
    </>
  );
}
