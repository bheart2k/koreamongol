import { Phone, Siren, Globe, Briefcase, Languages, Building2, Flag, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner,
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
    <div className={`p-5 rounded-lg border bg-card ${contact.important ? 'border-gold/50 ring-1 ring-gold/20' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-base font-semibold font-heading text-foreground">
            {contact.label}
          </h3>
          <p className="text-xs text-muted-foreground">{contact.labelKo}</p>
        </div>
        <a
          href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta text-white font-bold font-heading text-sm hover:bg-terracotta/90 transition-colors"
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
    <section id={id}>
      <h2 className="text-title text-navy dark:text-sky mb-6 flex items-center gap-2">
        <Icon className="w-6 h-6" />
        {title}
      </h2>
      <div className="space-y-4">
        {contacts.map((c) => (
          <ContactCard key={c.number} contact={c} />
        ))}
      </div>
    </section>
  );
}

export default function EmergencyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Яаралтай утасны дугаарууд', url: `${BASE_URL}/emergency` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title={emergencyMeta.title}
        subtitle={emergencyMeta.subtitle}
        icon={Phone}
        breadcrumbLabel="Яаралтай утас"
      >
        <GuideTOC sections={emergencySections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        <WarningBox title="Яаралтай үед">
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

        <TipBox title="1345 — Хамгийн чухал дугаар">
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

        <TipBox title="BBB Korea — Үнэгүй 24 цагийн орчуулга">
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
        <section id="em-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {emergencyLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/emergency" />
        <DonateBanner />
        <GuideNav currentGuideId="emergency" />
      </div>
    </main>
    </>
  );
}
