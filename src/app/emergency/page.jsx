// 긴급 연락처 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 맨 위 고정 119·112 띠 대신 첫 섹션이 큰 전화 카드.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail, CNote, CLinks,
} from '@/components/guide-c/GuideC';
import { CPhoneCards } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  emergencyMeta, emergencySections, urgentNote,
  urgentContacts, foreignerContacts, laborContacts,
  translateContacts, lifeContacts, embassyContacts, emergencyLinks,
} from '@/data/guides/emergency';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(emergencySections.findIndex((x) => x.id === id) + 1).padStart(2, '0');
const [noteBefore, noteStrong, noteAfter] = urgentNote;

export default function EmergencyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Яаралтай утасны дугаарууд', url: `${BASE_URL}/emergency` },
      ]} />
      <GuideViewTracker guideId="emergency" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={emergencyMeta.title}
          kicker="Гарын авлага"
          title={emergencyMeta.title}
          subtitle={emergencyMeta.subtitle}
          updated={emergencyMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c5-health.webp`} alt="" loop="loop-c5" loopNight="loop-c5-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          calls={urgentContacts.slice(0, 2).map((c) => ({ number: c.number, label: c.label }))}
        />
        <GuideCNav sections={[...emergencySections, { id: 'em-links', label: 'Линк' }]} label="Агуулга" />

        <GuideCSection id="em-urgent" no={no('em-urgent')} title={emergencySections[0].title}>
          <CPhoneCards items={urgentContacts} />
          <CNote tone="warn" title="Яаралтай үед">
            <p>{noteBefore}<strong>{noteStrong}</strong>{noteAfter}</p>
          </CNote>
        </GuideCSection>

        <GuideCSection id="em-foreigner" no={no('em-foreigner')} title={emergencySections[1].title}>
          <CPhoneCards items={foreignerContacts} />
          <CNote title="1345 — Хамгийн чухал дугаар">
            <p>Виз, бүртгэл, оршин суух зөвшөөрөл зэрэг бүх асуудлаар монгол хэлээр зөвлөгөө авах боломжтой. Ажлын өдөр 09:00-18:00 цагт залгаарай.</p>
          </CNote>
        </GuideCSection>

        <GuideCSection id="em-labor" no={no('em-labor')} title={emergencySections[2].title}>
          <CPhoneCards items={laborContacts} />
        </GuideCSection>

        <GuideCSection id="em-translate" no={no('em-translate')} title={emergencySections[3].title}>
          <CPhoneCards items={translateContacts} />
          <CNote title="BBB Korea — Үнэгүй 24 цагийн орчуулга">
            <p>1588-5644 руу залгаад монгол хэлийг сонговол сайн дурын орчуулагчтай холбоно. Эмнэлэг, цагдаа, банк гэх мэт газарт орчуулга хэрэгтэй бол ашиглаарай.</p>
          </CNote>
        </GuideCSection>

        <GuideCSection id="em-life" no={no('em-life')} title={emergencySections[4].title}>
          <CPhoneCards items={lifeContacts} />
        </GuideCSection>

        <GuideCSection id="em-embassy" no={no('em-embassy')} title={emergencySections[5].title}>
          <CPhoneCards items={embassyContacts} />
        </GuideCSection>

        <GuideCSection id="em-links" no={String(emergencySections.length + 1).padStart(2, '0')} title="Хэрэгтэй линкүүд">
          <CLinks links={emergencyLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['emergency-numbers', 'hospital-visit']} />
          <ReportBanner pageUrl="/emergency" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="emergency" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
