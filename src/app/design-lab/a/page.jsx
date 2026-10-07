import { getRecentUpdates } from '@/lib/recent-updates';
import {
  hero, situations, situationsHeading, guidesSection, updatesHeading, exchange, about, donate, emergency,
} from '../_shared/home-data';
import { ASSET, CHAPTERS, COPY, ROUTE, COMMUNITY, EMERGENCY_GUIDE } from './content';
import SkyRoot from './SkyRoot';
import HeroJourney from './HeroJourney';
import ChapterTrack from './ChapterTrack';
import TodaySection from './TodaySection';
import AboutSection from './AboutSection';
import Finale from './Finale';
import EmergencyDock from './EmergencyDock';

export const metadata = {
  title: '시안 A — 같은 하늘 아래',
  description: '홈 리디자인 시안 A: Cinematic Sky Journey',
};

// 스크롤 = 하루: 새벽 초원 → 운해 → 블루아워 서울 → 챕터(아침~노을) → 오늘 → 소개(노을) → 밤의 별
export default function DesignLabA() {
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
      <ChapterTrack
        chapters={CHAPTERS}
        section={guidesSection}
        labels={{ pause: COPY.pauseVideo, play: COPY.playVideo }}
        asset={ASSET}
      />
      <TodaySection
        exchange={exchange}
        updatesHeading={updatesHeading}
        updates={getRecentUpdates(5)}
        emergency={emergency}
        emergencyGuide={EMERGENCY_GUIDE}
      />
      <AboutSection about={about} />
      <Finale line={COPY.finaleLine} community={COMMUNITY} donate={donate} asset={ASSET} />
      <EmergencyDock emergency={emergency} guide={EMERGENCY_GUIDE} toggleLabel={COPY.emergencyToggle} />
    </SkyRoot>
  );
}
