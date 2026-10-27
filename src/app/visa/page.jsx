// 비자 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. E-9·D-2·D-4 는 탭 대신 각자 섹션으로 펼친다(#visa-e9 등 주소 그대로).
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, Cols3, SubTitle, Lead, CFine, CTable, CSteps, CList, CNote, CLinks, ChoiceCards,
} from '@/components/guide-c/GuideC';
import { CStats } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import GuideCCheckList from '@/components/guide-c/GuideCCheckList';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  visaMeta, visaSections, visaTypes, mongoliaPrep,
  rejectionReasons, illegalStayWarnings, usefulLinks,
  visaCostInfo, workplaceChange, longTermPaths,
} from '@/data/guides/visa';

const BASE_URL = 'https://koreamongol.com';

const [hikoreaLink, , visaPortalLink] = usefulLinks;
const visaKeys = Object.keys(visaTypes); // e9, d2, d4
const costOf = (key) => visaCostInfo.visas[visaKeys.indexOf(key)];

// 첫 화면 답 카드 — 숫자·문구는 모두 기존 데이터에서 가져온다(새 사실 없음)
const choiceFor = { e9: 'Ажил', d2: 'Их сургууль', d4: 'Хэл сургалт' };
const choices = visaKeys.map((key) => {
  const cost = costOf(key);
  return {
    for: choiceFor[key],
    title: visaTypes[key].label.split(' ')[0],
    facts: [visaTypes[key].description, `Оршин суух: ${cost.stay}`, `Шийдвэрлэх хугацаа: ${cost.processing}`],
    section: `visa-${key}`,
    moreLabel: 'Дэлгэрэнгүй',
  };
});

const no = (id) => String(visaSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

const costRows = visaCostInfo.visas.map((v) => [
  v.type,
  v.stayExtra ? `${v.stay}. ${v.stayExtra}` : v.stay,
  v.processing,
  v.cost,
  v.finance || '—',
]);

function Place({ place }) {
  return (
    <CNote title={place.name}>
      <p>{place.note}</p>
      <p><strong>Хаяг:</strong> {place.address}</p>
      <p><strong>Утас:</strong> <a href={`tel:${place.phone}`}>{place.phone}</a></p>
      {place.phone2 && <p><strong>{place.phone2Label}:</strong> <a href={`tel:${place.phone2}`}>{place.phone2}</a></p>}
      {place.email && <p><strong>И-мэйл:</strong> {place.email}</p>}
      <p><strong>Вэб:</strong> <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a></p>
    </CNote>
  );
}

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
      <GuideViewTracker guideId="visa" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel="Виз"
          kicker="Гарын авлага"
          title={visaMeta.title}
          subtitle={visaMeta.subtitle}
          updated={visaMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c1-steppe.webp`} alt="" loop="loop-c1" loopNight="loop-c1-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={[hikoreaLink, visaPortalLink]}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={visaSections} label="Агуулга" />

        <GuideCSection id="visa-types" no={no('visa-types')} title="Визний төрлүүд">
          <ChoiceCards cards={choices} />
        </GuideCSection>

        {visaKeys.map((key) => {
          const visa = visaTypes[key];
          const id = `visa-${key}`;
          return (
            <GuideCSection key={key} id={id} no={no(id)} title={visa.label}>
              <Lead>{visa.description}</Lead>
              <Cols>
                <div>
                  <SubTitle>Шаардлагатай бичиг баримт</SubTitle>
                  <GuideCCheckList items={visa.documents} storageKey={`visa-${key}-docs`} />
                </div>
                <div>
                  <SubTitle>Визний үе шат</SubTitle>
                  <CSteps steps={visa.steps} />
                </div>
              </Cols>
              <CNote tone="warn" title="Анхааруулга"><CList items={visa.warnings} /></CNote>
            </GuideCSection>
          );
        })}

        <GuideCSection id="visa-cost" no={no('visa-cost')} title={visaCostInfo.title}>
          <CTable headers={['Виз', 'Оршин суух', 'Шийдвэрлэх хугацаа', 'Хураамж', 'Санхүүгийн баталгаа']} rows={costRows} />
          <CNote title={visaCostInfo.extension.title}>
            <p><strong>Хураамж:</strong> {visaCostInfo.extension.cost}</p>
            <p><strong>Хаана:</strong> {visaCostInfo.extension.where}</p>
            <p><strong>Хэзээ:</strong> {visaCostInfo.extension.when}</p>
            <p><strong>Онлайн:</strong> {visaCostInfo.extension.online}</p>
          </CNote>
        </GuideCSection>

        <GuideCSection id="visa-workplace" no={no('visa-workplace')} title={workplaceChange.title}>
          <Cols>
            <div>
              <CStats small items={workplaceChange.limits.map((l) => ({ label: l.period, value: l.count }))} />
              <CNote tone="warn" title={workplaceChange.deadline}><p><strong>{workplaceChange.deadlineWarning}</strong></p></CNote>
              <CNote title="Тоонд оруулахгүй тохиолдол"><p>{workplaceChange.exceptions}</p></CNote>
            </div>
            <div>
              <SubTitle>Хэрхэн хүсэлт гаргах</SubTitle>
              <CList items={workplaceChange.howTo} />
              <SubTitle>Шаардлагатай бичиг баримт</SubTitle>
              <CList items={workplaceChange.requiredDocs} />
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="visa-longterm" no={no('visa-longterm')} title={longTermPaths.title}>
          <Lead>{longTermPaths.intro}</Lead>
          <Cols3>
            {longTermPaths.paths.map((path) => (
              <div key={path.name}>
                <SubTitle>{path.name}</SubTitle>
                <Lead>{path.summary}</Lead>
                <CFine><strong>Болзол</strong></CFine>
                <CList items={path.requirements} />
                {path.note && <CFine>{path.note}</CFine>}
              </div>
            ))}
          </Cols3>
          <Cols>
            <CNote tone="warn" title="Жил бүр өөрчлөгдөнө"><p>{longTermPaths.warning}</p></CNote>
            <CNote title="Одооноос бэлдэх зүйлс"><CList items={longTermPaths.checklist} /></CNote>
          </Cols>
        </GuideCSection>

        <GuideCSection id="visa-mongolia-prep" no={no('visa-mongolia-prep')} title="Монголоос бэлтгэх зүйлс">
          <GuideCCheckList items={mongoliaPrep.checklist} storageKey="visa-mongolia-prep" />
          <Cols>
            <Place place={mongoliaPrep.visaCenter} />
            <Place place={mongoliaPrep.embassy} />
          </Cols>
        </GuideCSection>

        <GuideCSection id="visa-rejection" no={no('visa-rejection')} title="Татгалзах шалтгаан">
          <CNote tone="warn" title="Виз татгалзах гол шалтгаанууд"><CList items={rejectionReasons} /></CNote>
        </GuideCSection>

        <GuideCSection id="visa-illegal" no={no('visa-illegal')} title="Хууль бус оршин суух">
          <CNote tone="warn" title="Хууль бус оршин суухын үр дагавар"><CList items={illegalStayWarnings} /></CNote>
        </GuideCSection>

        <GuideCSection id="visa-links" no={no('visa-links')} title="Хэрэгтэй линкүүд">
          <CLinks links={usefulLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['korea-visa-in-mongolia', 'e9-reentry', 'e9-to-e74', 'visa-extension']} />
          <ReportBanner pageUrl="/visa" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="visa" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
