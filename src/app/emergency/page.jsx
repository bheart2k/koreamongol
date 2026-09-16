import { GuideSection } from '@/components/guide/GuideSection';
import contactStyles from './emergency.module.css';
import { IllustratedGuideHeader, IllustratedGuideBody } from '@/components/guide/IllustratedGuide';
import styles from '@/components/guide/IllustratedGuide.module.css';
import { Phone, Siren, Globe, Briefcase, Languages, Building2, Flag, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  GuideNav, WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner, ShareButtons, RelatedTips, GuideViewTracker,
} from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  emergencyMeta, emergencySections,
  urgentContacts, foreignerContacts, laborContacts,
  translateContacts, lifeContacts, embassyContacts, emergencyLinks,
} from '@/data/guides/emergency';

const BASE_URL = 'https://koreamongol.com';

const sectionIcons = {
  'em-urgent': Siren,
  'em-foreigner': Globe,
  'em-labor': Briefcase,
  'em-translate': Languages,
  'em-life': Building2,
  'em-embassy': Flag,
};

function ContactCard({ contact }) {
  return (
    <div className={[contactStyles.card, contact.important ? contactStyles.important : ""].join(" ")}>
      <div className={contactStyles.heading}>
        <div>
          <h3 className="text-base font-semibold font-heading text-foreground">
            {contact.label}
          </h3>
          <p className="text-xs text-muted-foreground">{contact.labelKo}</p>
        </div>
        <a
          href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
          className={contactStyles.call}
        >
          <Phone className="w-4 h-4" />
          {contact.number}
        </a>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          {contact.hours}
        </span>
        {contact.mongolian && (
          <span className="flex items-center gap-1 text-gold-dark font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {contact.mongolianHours || 'Монгол хэл боломжтой'}
          </span>
        )}
      </div>
      {contact.address && (
        <p className="text-xs text-muted-foreground mt-2">&#128205; {contact.address}</p>
      )}
      {contact.url && (
        <a
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gold-dark hover:text-gold flex items-center gap-1 mt-1"
        >
          <ExternalLink className="w-3 h-3" />
          {contact.url}
        </a>
      )}
    </div>
  );
}

function ContactSection({ id, title, contacts }) {
  const Icon = sectionIcons[id] || Phone;
  return (
    <GuideSection alwaysOpen={id === "em-urgent"} id={id}>
      <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
        <Icon className="w-6 h-6" />
        {title}
      </h2>
      <div className="space-y-4">
        {contacts.map((c) => (
          <ContactCard key={c.number} contact={c} />
        ))}
      </div>
    </GuideSection>
  );
}

export default function EmergencyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Яаралтай утасны дугаарууд', url: `${BASE_URL}/emergency` },
      ]} />
    <main className={styles.page}>
      <GuideViewTracker guideId="emergency" />
      <div className={contactStyles.urgent}>
        {urgentContacts.slice(0, 2).map((contact) => (
          <a key={contact.number} href={`tel:${contact.number}`}>
            <Phone aria-hidden="true" /><span>{contact.label}</span><strong>{contact.number}</strong>
          </a>
        ))}
      </div>
      <IllustratedGuideHeader
        meta={emergencyMeta}
        sections={emergencySections}
        quickIds={["em-urgent","em-translate","em-embassy"]}
        image="/images/guides/emergency-mazaalai-l.png"
        icon={Phone}
        breadcrumbLabel={emergencyMeta.title}
      />

      <IllustratedGuideBody sections={emergencySections}>

        <WarningBox title="Яаралтай үед" className={styles.warning}>
          <p>119 (эмнэлэг/гал) эсвэл 112 (цагдаа) руу залгахад <strong>монгол хэл мэдэхгүй байсан ч</strong> байршлыг GPS-ээр тогтооно. Чимээгүй байсан ч залга!</p>
        </WarningBox>

        <ContactSection
          id="em-urgent"
          title={emergencySections[0].title}
          contacts={urgentContacts}
        />

        <ContactSection
          id="em-foreigner"
          title={emergencySections[1].title}
          contacts={foreignerContacts}
        />

        <TipBox title="1345 — Хамгийн чухал дугаар" className={styles.tip}>
          <p>Виз, бүртгэл, оршин суух зөвшөөрөл зэрэг бүх асуудлаар монгол хэлээр зөвлөгөө авах боломжтой. Ажлын өдөр 09:00-18:00 цагт залгаарай.</p>
        </TipBox>

        <ContactSection
          id="em-labor"
          title={emergencySections[2].title}
          contacts={laborContacts}
        />

        <ContactSection
          id="em-translate"
          title={emergencySections[3].title}
          contacts={translateContacts}
        />

        <TipBox title="BBB Korea — Үнэгүй 24 цагийн орчуулга" className={styles.tip}>
          <p>1588-5644 руу залгаад монгол хэлийг сонговол сайн дурын орчуулагчтай холбоно. Эмнэлэг, цагдаа, банк гэх мэт газарт орчуулга хэрэгтэй бол ашиглаарай.</p>
        </TipBox>

        <ContactSection
          id="em-life"
          title={emergencySections[4].title}
          contacts={lifeContacts}
        />

        <ContactSection
          id="em-embassy"
          title={emergencySections[5].title}
          contacts={embassyContacts}
        />

        {/* Links */}
        <GuideSection id="em-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {emergencyLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </GuideSection>

        <RelatedTips slugs={['emergency-numbers', 'hospital-visit']} />

        <ReportBanner pageUrl="/emergency" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="emergency" />
      </IllustratedGuideBody>
    </main>
    </>
  );
}
