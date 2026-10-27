// 병원·응급 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 맨 위 고정 응급 띠 대신 첫 섹션이 전화 카드, 상황별 안내는 접지 않고 펼친다.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, SubTitle, CTable, CSteps, CList, CNote, CLinks, CCards, CContacts,
} from '@/components/guide-c/GuideC';
import { CRows, CMethods } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  hospitalMeta, hospitalSections, emergencyContacts,
  hospitalSteps, insuranceComparison, interpreterServices,
  situationGuides, pharmacyGuide, undocumentedAccess,
  insuranceNote, emergencyRoomNote, interpreterNote,
} from '@/data/guides/hospital';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(hospitalSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

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
      <GuideViewTracker guideId="hospital" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel="Эмнэлэг"
          kicker="Гарын авлага"
          title={hospitalMeta.title}
          subtitle={hospitalMeta.subtitle}
          updated={hospitalMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c5-health.webp`} alt="" loop="loop-c5" loopNight="loop-c5-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          calls={emergencyContacts.slice(0, 3).map((c) => ({ number: c.number, label: c.label }))}
        />
        <GuideCNav sections={hospitalSections} label="Агуулга" />

        <GuideCSection id="hospital-emergency" no={no('hospital-emergency')} title="Яаралтай холбоо барих">
          <CContacts contacts={emergencyContacts} />
        </GuideCSection>

        <GuideCSection id="hospital-steps" no={no('hospital-steps')} title="Эмнэлэгт хандах">
          <CSteps steps={hospitalSteps} />
        </GuideCSection>

        <GuideCSection id="hospital-pharmacy" no={no('hospital-pharmacy')} title={pharmacyGuide.title}>
          <Cols>
            <div><CSteps steps={pharmacyGuide.steps.map((t) => ({ title: t }))} /></div>
            <div>
              <SubTitle>{pharmacyGuide.otc.title}</SubTitle>
              <CRows rows={pharmacyGuide.otc.items.map((it) => ({ name: it.name, value: it.use }))} />
              <CNote title="Анхаар"><p>{pharmacyGuide.tip}</p></CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="hospital-insurance" no={no('hospital-insurance')} title="Даатгалын мэдээлэл">
          <CTable headers={insuranceComparison.headers} rows={insuranceComparison.rows} />
          <Cols>
            <CNote tone="warn" title="Яаралтай (응급실)"><p>{emergencyRoomNote}</p></CNote>
            <CNote title="Даатгалын зөвлөгөө"><p>{insuranceNote}</p></CNote>
          </Cols>
        </GuideCSection>

        <GuideCSection id="hospital-undocumented" no={no('hospital-undocumented')} title={undocumentedAccess.title}>
          <CCards items={undocumentedAccess.items.map((it) => ({ title: it.label, text: it.description }))} />
          <CNote title="Мэдэх зүйл"><p>{undocumentedAccess.warning}</p></CNote>
        </GuideCSection>

        <GuideCSection id="hospital-interpreter" no={no('hospital-interpreter')} title="Орчуулга / Тусламж">
          <CNote title="Утсаар орчуулга авах"><p>{interpreterNote}</p></CNote>
          <CLinks links={interpreterServices} />
        </GuideCSection>

        <GuideCSection id="hospital-situations" no={no('hospital-situations')} title="Тохиолдлоор">
          <CMethods items={situationGuides.map((g) => ({ title: g.title, text: g.content }))} />
        </GuideCSection>

        <GuideCSection id="hospital-tips" no={no('hospital-tips')} title="Зөвлөгөө">
          <CNote tone="warn" title="Эмнэлэгт очихдоо">
            <CList items={[
              'Паспорт / 외국인등록증 заавал авчрах',
              'Даатгалын карт (건강보험증) авчрах',
              'Papago апп бэлдэх (орчуулга)',
              'Өвчний шинж тэмдэг, эмийн нэрийг тэмдэглэх',
            ]} />
          </CNote>
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['hospital-visit', 'emergency-numbers']} />
          <ReportBanner pageUrl="/hospital" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="hospital" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
