// 일자리·노동 가이드 — /topik 과 같은 틀(guide-c). 기록: docs/jobs-redesign.md
// 내용·제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 바뀐 것은 배치와 디자인뿐(폰에서 섹션이 접히지 않음).
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, Cols3, SubTitle, Lead, CFine, CTable, CSteps, CList, CNote, CLinks, CContacts, ChoiceCards,
} from '@/components/guide-c/GuideC';
import { CChips, CStats, CRows, CMethods, CFlags } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import GuideCCheckList from '@/components/guide-c/GuideCCheckList';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  jobsMeta, jobsSections, visaWorkConditions,
  parttimePermit, dailyWorkSafety,
  salaryInfo, contractChecklist, contractWarnings,
  jobSearchMethods, laborRights, generalRights,
  jobsContacts, jobsLinks,
} from '@/data/guides/jobs';

const BASE_URL = 'https://koreamongol.com';

const [epsLink, , laborLink] = jobsLinks;
const d2Row = visaWorkConditions.comparison.rows[1];
const wage = salaryInfo.minimumWage;

// 첫 화면 답 카드 — 숫자·문구는 모두 기존 데이터에서 가져온다(새 사실 없음)
const choices = [
  {
    for: 'Ажилчин',
    title: 'E-9',
    facts: [
      `Хамгийн бага цалин ${salaryInfo.year}: ${wage.hourly}/цаг · ${wage.monthly}/сар`,
      generalRights[3],
      visaWorkConditions.warnings[1],
    ],
    section: 'jobs-salary',
    moreLabel: 'Дэлгэрэнгүй',
    official: { href: epsLink.href, title: 'eps.hrdkorea.or.kr' },
  },
  {
    for: 'Оюутан',
    title: 'D-2 · D-4',
    // D-2·D-4 둘 다에 맞는 사실만 (D-2 전용 시간 규칙은 아래 표에)
    facts: [
      d2Row[3],
      visaWorkConditions.warnings[2],
      parttimePermit.prohibited[0],
    ],
    section: 'jobs-parttime',
    moreLabel: 'Дэлгэрэнгүй',
    official: parttimePermit.officialLink,
  },
];

const no = (id) => String(jobsSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

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
      <GuideViewTracker guideId="jobs" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel="Ажил"
          kicker="Гарын авлага"
          title={jobsMeta.title}
          subtitle={jobsMeta.subtitle}
          updated={jobsMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c4-work.webp`} alt="" loop="loop-c4" loopNight="loop-c4-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={[epsLink, laborLink]}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={jobsSections} label="Агуулга" />

        <GuideCSection id="jobs-visa-conditions" no={no('jobs-visa-conditions')} title="Визээр ажлын нөхцөл">
          <ChoiceCards cards={choices} />
          <CTable headers={visaWorkConditions.comparison.headers} rows={visaWorkConditions.comparison.rows} />
          <SubTitle>E-9 зөвшөөрөгдсөн салбар</SubTitle>
          <CChips items={visaWorkConditions.e9Sectors} />
          <CNote tone="warn" title="Анхааруулга"><CList items={visaWorkConditions.warnings} /></CNote>
        </GuideCSection>

        <GuideCSection id="jobs-parttime" no={no('jobs-parttime')} title="Оюутны цагийн ажил (알바) — зөвшөөрөл">
          <Lead>{parttimePermit.intro}</Lead>
          <CTable headers={parttimePermit.hoursTable.headers} rows={parttimePermit.hoursTable.rows} />
          <CFine>{parttimePermit.hoursNote}</CFine>
          <Cols>
            <div>
              <SubTitle>Зөвшөөрөл авах дараалал</SubTitle>
              <CSteps steps={parttimePermit.steps} />
            </div>
            <div>
              <SubTitle>Оюутанд хориотой ажил</SubTitle>
              <CList items={parttimePermit.prohibited} />
              <CNote tone="warn" title="Анхаар!"><p>{parttimePermit.warning}</p></CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="jobs-salary" no={no('jobs-salary')} title={`Цалин / Хамгийн бага цалин (${salaryInfo.year})`}>
          <CStats items={[
            { label: 'Цагийн хөлс', value: wage.hourly },
            { label: 'Сарын цалин (주 40시간)', value: wage.monthly },
          ]} />
          <CFine>{wage.note}</CFine>
          {/* 데스크톱 2×2 (표 둘 / 알림 둘), 폰 1단 — 칸 사이 간격을 한 규칙으로 맞추려고 Cols 하나에 넣는다 */}
          <Cols>
            <div>
              <SubTitle>Илүү цагийн нэмэгдэл</SubTitle>
              <CTable headers={salaryInfo.overtimeTable.headers} rows={salaryInfo.overtimeTable.rows} />
            </div>
            <div>
              <SubTitle>Цалингаас суутгах (공제)</SubTitle>
              <CRows rows={salaryInfo.deductions.map((d) => ({ name: d.name, value: d.note ? `${d.rate} — ${d.note}` : d.rate }))} />
            </div>
            <div>
              <CNote title={salaryInfo.retirement.title}>
                <p><strong>Нөхцөл:</strong> {salaryInfo.retirement.condition}</p>
                <p><strong>Хэмжээ:</strong> {salaryInfo.retirement.amount}</p>
                <p><strong>Хугацаа:</strong> {salaryInfo.retirement.deadline}</p>
              </CNote>
            </div>
            <div><CNote title="Зөвлөгөө"><CList items={salaryInfo.tips} /></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="jobs-contract" no={no('jobs-contract')} title="Хөдөлмөрийн гэрээ шалгах">
          <Cols>
            <GuideCCheckList items={contractChecklist} storageKey="jobs-contract" />
            <div><CNote tone="warn" title="Анхааруулга"><CList items={contractWarnings} /></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="jobs-how-to-find" no={no('jobs-how-to-find')} title="Ажил хайх арга">
          <CMethods items={jobSearchMethods.map((m) => ({ title: m.title, tag: m.target, text: m.description, href: m.url }))} />
        </GuideCSection>

        <GuideCSection id="jobs-daily" no={no('jobs-daily')} title="Өдрийн ажил (일용직) — өөрийгөө хамгаалах">
          <Lead>{dailyWorkSafety.intro}</Lead>
          <Cols>
            <div>
              <SubTitle>Ажил эхлэхийн өмнө шалгах</SubTitle>
              <GuideCCheckList items={dailyWorkSafety.beforeStart} storageKey="jobs-daily-before" />
            </div>
            <div>
              <SubTitle>Нотолгоо үлдээх</SubTitle>
              <CList items={dailyWorkSafety.evidence} />
              <CNote title="Цалин өгөхгүй бол"><p>{dailyWorkSafety.unpaidNote}</p></CNote>
              <CNote title="Татвар"><p>{dailyWorkSafety.taxNote}</p></CNote>
            </div>
          </Cols>
          <SubTitle>Facebook зарын залилангийн шинж</SubTitle>
          <CFlags items={dailyWorkSafety.scamSigns.map((x) => ({ title: x.sign, text: x.why }))} />
        </GuideCSection>

        <GuideCSection id="jobs-rights" no={no('jobs-rights')} title="Хөдөлмөрийн эрхийн хамгаалалт">
          <SubTitle>Таны эрх</SubTitle>
          <CList items={generalRights} />
          <Cols3>
            {laborRights.map((situation) => (
              <div key={situation.title}>
                <SubTitle>{situation.title}</SubTitle>
                <CSteps steps={situation.steps} />
                {situation.importantNote && <CNote title="Чухал"><p>{situation.importantNote}</p></CNote>}
              </div>
            ))}
          </Cols3>
        </GuideCSection>

        <GuideCSection id="jobs-links" no={no('jobs-links')} title="Хэрэгтэй утас / Линк">
          <CContacts contacts={jobsContacts} />
          <CLinks links={jobsLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['student-part-time', 'unpaid-wages', 'minimum-wage-2026', 'work-injury']} />
          <ReportBanner pageUrl="/jobs" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="jobs" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
