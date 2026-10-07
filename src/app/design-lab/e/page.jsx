import { getRecentUpdates } from '@/lib/recent-updates';
import {
  hero, situations, situationsHeading, guides, guidesSection, updatesHeading, exchange, about, donate, emergency,
} from '../_shared/home-data';
import { ASSET, CHAPTERS, COPY, ROUTE, COMMUNITY, EMERGENCY_GUIDE } from './content';
import SkyRoot from './SkyRoot';
import HeroJourney from './HeroJourney';
import ChipBar from './ChipBar';
import GuideGrid from './GuideGrid';
import Chapters from './Chapters';
import TodaySection from './TodaySection';
import AboutSection from './AboutSection';
import Finale from './Finale';
import EmergencyDock from './EmergencyDock';

export const metadata = {
  title: '시안 E — 같은 하늘 아래 · 에센셜',
  description: '홈 리디자인 시안 E: A 정제판 (Essential)',
};

const CHIPS = CHAPTERS.map((ch) => ({ target: `ch-${ch.id}`, no: ch.no, title: ch.title }));

// A의 시네마틱 히어로(200vh, 유일한 고정 구간) → 빠른 찾기 칩 바 → 가이드 14개 → 챕터 6장(일반 스크롤) → 오늘 → 소개 → 밤의 별
export default function DesignLabE() {
  return (
    <SkyRoot>
      <HeroJourney
        hero={hero}
        situationsHeading={situationsHeading}
        situations={situations}
        copy={COPY}
        route={ROUTE}
        asset={ASSET}
      />
      <ChipBar chips={CHIPS} label={guidesSection.title} labels={{ pause: COPY.pauseVideo, play: COPY.playVideo }} />
      <GuideGrid section={guidesSection} guides={guides} emergency={emergency} emergencyGuide={EMERGENCY_GUIDE} />
      <Chapters chapters={CHAPTERS} asset={ASSET} />
      <TodaySection exchange={exchange} updatesHeading={updatesHeading} updates={getRecentUpdates(5)} />
      <AboutSection about={about} />
      <Finale line={COPY.finaleLine} community={COMMUNITY} donate={donate} asset={ASSET} />
      <EmergencyDock emergency={emergency} guide={EMERGENCY_GUIDE} toggleLabel={COPY.emergencyToggle} />
    </SkyRoot>
  );
}
