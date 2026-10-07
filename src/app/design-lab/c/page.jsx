import { getRecentUpdates } from '@/lib/recent-updates';
import {
  hero, situationsHeading, situations, emergency, guidesSection, guides,
  updatesHeading, exchange, about, donate,
} from '../_shared/home-data';
import { ASSET, heroArt, copy, places, chapters, miniCrop } from './content';
import Experience from './Experience';
import Hero from './Hero';
import Chapters from './Chapters';
import { Emergency, Situations, GuidesIndex, Updates, Finale } from './Sections';
import styles from './c.module.css';

export const metadata = {
  title: '시안 C — 살아있는 지도',
  description: '홈 리디자인 시안 C: 떠 있는 두 섬 디오라마가 내비게이션이 되는 홈 (내부 비교용)',
  robots: { index: false, follow: false },
};

// 클라이언트로 넘기는 가이드 정보 (lucide 컴포넌트 제외, 직렬화 가능한 값만)
const guideMap = Object.fromEntries(
  guides.map((g) => [g.id, { href: g.href, title: g.title, desc: g.desc, iconName: g.iconName }])
);

const alts = {
  start: 'Монгол тал нутгийн арал ба Сөүлийн хороолол бүхий хоёр хөвөгч арал, онгоц Монголоос хөөрч байна',
  settle: 'Нисэх буудал, орон сууц, эмнэлэг, банк, дэлгүүр, үйлдвэр, сургууль, метро, ханок бүхий Сөүлийн хороолол',
  steppe: 'Гэр, адуу, гол бүхий Монгол тал нутаг',
  arrive: 'Нисэх буудал ба автобус',
  living: 'Орон сууц, банк, 24 цагийн дэлгүүр',
  work: 'Үйлдвэр ба чингэлэгүүд',
  health: 'Эмнэлэг ба түргэн тусламжийн машин',
  culture: 'Ханок байшин, цөөрөм ба сургууль',
  finale: 'Шөнийн тэнгэрт гэрэлтэх хоёр арал',
};

export default function DesignLabC() {
  const recentUpdates = getRecentUpdates(5);
  const community = guideMap.community;

  return (
    <div className={`${styles.root} min-h-content`}>
      <Experience>
        <Hero hero={hero} art={heroArt} places={places} guideMap={guideMap} copy={copy} alts={alts} />
        <Emergency emergency={emergency} />
        <Situations heading={situationsHeading} situations={situations} />
        <Chapters
          chapters={chapters}
          guideMap={guideMap}
          copy={copy}
          crop={miniCrop}
          miniImg={`${ASSET}/k0-start.webp`}
          assetBase={ASSET}
          alts={alts}
        />
        <GuidesIndex section={guidesSection} guides={guides} />
        {recentUpdates.length > 0 && (
          <Updates heading={updatesHeading} items={recentUpdates} exchange={exchange} />
        )}
        <Finale
          title={copy.finaleTitle}
          about={about}
          community={community}
          donate={donate}
          art={{ desktop: `${ASSET}/k0-start-night.webp`, mobile: `${ASSET}/m0-start-night.webp` }}
          alt={alts.finale}
        />
      </Experience>
    </div>
  );
}
