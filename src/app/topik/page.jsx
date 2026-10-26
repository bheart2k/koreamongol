// TOPIK / EPS-TOPIK 가이드 — 홈 시안 C와 같은 틀(guide-c). 기록: docs/topik-redesign.md
// 내용·제목(H1)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 바뀐 것은 배치와 디자인뿐(폰에서 섹션이 접히지 않음).
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, SubTitle, Lead, CTable, CSteps, CList, CNote, CLinks, CCards, CContacts, ChoiceCards,
} from '@/components/guide-c/GuideC';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
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

const [epsLink, topikLink] = topikLinks;
const visaCode = (cell) => cell.split(' ')[0];
const eps = epsTopikOverview.structure.rows;
const validity = topikVsEpsTopik.rows.find((r) => r[0] === 'Хүчинтэй хугацаа');

// 첫 화면 답 카드 — 숫자·문구는 모두 기존 데이터에서 가져온다(새 사실 없음)
const choices = [
  {
    for: whichTestTable.rows[0][0],
    title: 'EPS-TOPIK',
    facts: [
      `${eps[2][1]} · ${eps[2][2]}`,
      `${eps[0][0]} + ${eps[1][0]}`,
      epsTopikOverview.keyPoints[3],
    ],
    section: 'topik-eps-overview',
    moreLabel: 'Дэлгэрэнгүй',
    official: { href: epsLink.href, title: 'epstopik.hrdkorea.or.kr' },
  },
  {
    for: whichTestTable.rows.slice(1).map((r) => visaCode(r[0])).join(' · '),
    title: 'TOPIK',
    facts: [
      'TOPIK I: 1~2 түвшин · TOPIK II: 3~6 түвшин',
      `${topikOverview.fee.headers[1]}: ${topikOverview.fee.rows[0][1]}~`,
      `${validity[0]}: ${validity[1]}`,
    ],
    section: 'topik-general-overview',
    moreLabel: 'Дэлгэрэнгүй',
    official: { href: topikLink.href, title: 'topik.go.kr' },
  },
];

const no = (id) => String(topikSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

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
      <GuideViewTracker guideId="topik" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={topikMeta.title}
          kicker="Гарын авлага"
          title={topikMeta.title}
          subtitle={topikMeta.subtitle}
          updated={topikMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c6-culture.webp`} alt="" loop="loop-c6" loopNight="loop-c6-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={[epsLink, topikLink]}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={topikSections} label="Агуулга" />

        <GuideCSection id="topik-which-test" no={no('topik-which-test')} title="Аль шалгалт надад хэрэгтэй вэ?">
          <ChoiceCards cards={choices} />
          <CTable headers={whichTestTable.headers} rows={whichTestTable.rows} />
          <CNote title="Чухал ялгаа"><p>{whichTestTip}</p></CNote>
        </GuideCSection>

        <GuideCSection id="topik-eps-overview" no={no('topik-eps-overview')} title="EPS-TOPIK гэж юу вэ?">
          <Lead>{epsTopikOverview.description}</Lead>
          <Cols>
            <div>
              <SubTitle>Шалгалтын бүтэц</SubTitle>
              <CTable headers={epsTopikOverview.structure.headers} rows={epsTopikOverview.structure.rows} />
              <CList items={epsTopikOverview.keyPoints} />
            </div>
            <div>
              <SubTitle>Нас, нөхцөл</SubTitle>
              <CList items={epsTopikOverview.eligibility} />
              <CNote tone="warn" title="Анхааруулга"><CList items={epsTopikWarnings} /></CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="topik-general-overview" no={no('topik-general-overview')} title="TOPIK шалгалт гэж юу вэ?">
          <Lead>{topikOverview.description}</Lead>
          <Cols>
            <div>
              <SubTitle>Түвшин ба тэнцэх оноо</SubTitle>
              <CTable headers={topikOverview.levels.headers} rows={topikOverview.levels.rows} />
            </div>
            <div>
              <SubTitle>TOPIK I бүтэц (1~2 түвшин)</SubTitle>
              <CTable headers={topikOverview.topik1Structure.headers} rows={topikOverview.topik1Structure.rows} />
              <SubTitle>TOPIK II бүтэц (3~6 түвшин)</SubTitle>
              <CTable headers={topikOverview.topik2Structure.headers} rows={topikOverview.topik2Structure.rows} />
            </div>
          </Cols>
          <Cols>
            <div>
              <SubTitle>Шалгалтын төлбөр (Солонгос дотор)</SubTitle>
              <CTable headers={topikOverview.fee.headers} rows={topikOverview.fee.rows} />
              <CList items={[`Гэрчилгээний хүчинтэй хугацаа: ${topikOverview.validity}`]} />
            </div>
            <div>
              <SubTitle>TOPIK vs EPS-TOPIK харьцуулалт</SubTitle>
              <CTable headers={topikVsEpsTopik.headers} rows={topikVsEpsTopik.rows} />
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="topik-register" no={no('topik-register')} title="Шалгалтанд бүртгүүлэх">
          <Cols>
            <div>
              <SubTitle>EPS-TOPIK бүртгэл</SubTitle>
              <CSteps steps={epsRegistrationSteps} />
            </div>
            <div>
              <SubTitle>TOPIK бүртгэл</SubTitle>
              <CSteps steps={topikRegistrationSteps} />
            </div>
          </Cols>
          <CNote title="Монголд бүртгүүлэх"><p>{registrationNote}</p></CNote>
        </GuideCSection>

        <GuideCSection id="topik-after-pass" no={no('topik-after-pass')} title="Тэнцсэний дараа">
          <Cols>
            <div>
              <SubTitle>EPS-TOPIK тэнцсэний дараа</SubTitle>
              <CSteps steps={epsAfterPassSteps} />
            </div>
            <div>
              <SubTitle>TOPIK оноо хэрхэн ашиглах</SubTitle>
              <CCards items={topikAfterPassUsage.map((u) => ({ title: u.purpose, text: u.description }))} />
            </div>
          </Cols>
          <CNote tone="warn" title="Анхааруулга"><CList items={afterPassWarnings} /></CNote>
        </GuideCSection>

        <GuideCSection id="topik-study" no={no('topik-study')} title="Бэлтгэл ба сурах материал">
          <CLinks links={studyResources} />
          <CNote title="Бэлтгэлийн зөвлөгөө"><CList items={studyTips} /></CNote>
        </GuideCSection>

        <GuideCSection id="topik-links" no={no('topik-links')} title="Хэрэгтэй утас / Линк">
          <CContacts contacts={topikContacts} />
          <CLinks links={topikLinks} />
        </GuideCSection>

        <GuideCTail>
          <ReportBanner pageUrl="/topik" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="topik" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
