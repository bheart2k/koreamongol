// 홈(/) — design-lab 시안 C 「살아있는 지도」 적용 (설계: docs/design-lab/c-final.md)
// 서버 컴포넌트. 데이터는 @/data/home, 최근 업데이트는 page.jsx 에서 받는다.
import {
  hero, heroArt, heroMotion, situationsHeading, situations, emergency, guidesSection, guides,
  updatesHeading, exchange, about, donate, copy, places, chapters, miniImg, miniCrop, finaleArt, alts,
  HOME_ASSET_BASE,
} from '@/data/home';
import Experience from './Experience';
import Hero from './Hero';
import Chapters from './Chapters';
import { Emergency, Situations, GuidesIndex, Updates, Finale } from './Sections';
import styles from './home.module.css';

// 클라이언트로 넘기는 가이드 정보 (lucide 컴포넌트 제외, 직렬화 가능한 값만)
const guideMap = Object.fromEntries(
  guides.map((g) => [g.id, { href: g.href, title: g.title, desc: g.desc, iconName: g.iconName }])
);

export default function HomeView({ recentUpdates }) {
  return (
    <div className={`${styles.root} min-h-content`}>
      <Experience>
        <Hero hero={hero} art={heroArt} motion={heroMotion} places={places} guideMap={guideMap} copy={copy} alt={alts.settle} />
        <Emergency emergency={emergency} />
        <Situations heading={situationsHeading} situations={situations} />
        <Chapters
          chapters={chapters}
          guideMap={guideMap}
          copy={copy}
          crop={miniCrop}
          miniImg={miniImg}
          assetBase={HOME_ASSET_BASE}
          alts={alts}
        />
        <GuidesIndex section={guidesSection} guides={guides} />
        {recentUpdates.length > 0 && (
          <Updates heading={updatesHeading} items={recentUpdates} exchange={exchange} />
        )}
        <Finale
          title={copy.finaleTitle}
          about={about}
          community={guideMap.community}
          donate={donate}
          art={finaleArt}
          alt={alts.finale}
        />
      </Experience>
    </div>
  );
}
