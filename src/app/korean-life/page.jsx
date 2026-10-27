// 한국어·문화 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·조회수 기록은 개편 전과 같다. 일상/직장 표현은 탭 대신 각자 섹션(#kl-daily, #kl-work), 접힌 목록은 펼친다.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail, CSteps, CNote, CLinks,
} from '@/components/guide-c/GuideC';
import { CMethods, CPhrases } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  koreanLifeMeta, koreanLifeSections, survivalKorean,
  koreanMisunderstandings, culturalPoints,
  commonMistakes, learningResources,
} from '@/data/guides/korean-life';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(koreanLifeSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');
const titleOf = (id) => koreanLifeSections.find((x) => x.id === id).title;

export default function KoreanLifePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Солонгос хэл & Соёл', url: `${BASE_URL}/korean-life` },
      ]} />
      <GuideViewTracker guideId="korean-life" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={koreanLifeMeta.title}
          kicker="Гарын авлага"
          title={koreanLifeMeta.title}
          subtitle={koreanLifeMeta.subtitle}
          updated={koreanLifeMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c6-culture.webp`} alt="" loop="loop-c6" loopNight="loop-c6-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
        />
        <GuideCNav sections={koreanLifeSections} label="Агуулга" />

        <GuideCSection id="kl-daily" no={no('kl-daily')} title="Өдөр тутмын хэллэг">
          <CNote title="Дуудлагын тухай">
            <p>Энд бичигдсэн дуудлага нь практик зориулалттай (монгол хүн хэлэхэд ойлгомжтой байхаар). Эрдэм шинжилгээний транскрипци биш.</p>
          </CNote>
          <CPhrases items={survivalKorean.daily} />
        </GuideCSection>

        <GuideCSection id="kl-work" no={no('kl-work')} title={titleOf('kl-work')}>
          <CPhrases items={survivalKorean.work} />
        </GuideCSection>

        <GuideCSection id="kl-misunderstand" no={no('kl-misunderstand')} title="Буруу ойлголт">
          <CMethods items={koreanMisunderstandings.map((m) => ({ title: m.title, text: m.description }))} />
        </GuideCSection>

        <GuideCSection id="kl-culture" no={no('kl-culture')} title="Соёлын ялгаа">
          <CMethods items={culturalPoints.map((c) => ({ title: c.title, text: c.description }))} />
        </GuideCSection>

        <GuideCSection id="kl-mistakes" no={no('kl-mistakes')} title="Түгээмэл алдаа TOP 5">
          <CSteps steps={commonMistakes.map((m) => ({ title: m.title, description: m.description }))} />
        </GuideCSection>

        <GuideCSection id="kl-resources" no={no('kl-resources')} title="Суралцах эх сурвалж">
          <CLinks links={learningResources} />
        </GuideCSection>

        <GuideCTail>
          <ReportBanner pageUrl="/korean-life" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="korean-life" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
