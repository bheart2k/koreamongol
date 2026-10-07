import { getRecentUpdates } from '@/lib/recent-updates';
import {
  hero, situationsHeading, situations, emergency, guidesSection, guides,
  updatesHeading, exchange, about, donate,
} from '../_shared/home-data';
import { ASSET, heroArt, copy, places, rooms, planCrop } from './content';
import Experience from './Experience';
import Hero from './Hero';
import Rooms from './Rooms';
import { Emergency, Situations, Catalogue, Updates, Finale } from './Sections';
import styles from './d.module.css';

export const metadata = {
  title: '시안 D — 전시된 두 고향',
  description: '홈 리디자인 시안 D: 건축 전시 모형이 내비게이션이 되는 홈 (내부 비교용)',
  robots: { index: false, follow: false },
};

// 클라이언트로 넘기는 가이드 정보 (lucide 컴포넌트 제외, 직렬화 가능한 값만)
const guideMap = Object.fromEntries(
  guides.map((g) => [g.id, { href: g.href, title: g.title, desc: g.desc, iconName: g.iconName }])
);

const alts = {
  start: 'Царс модон ширээн дээрх хоёр макет: Монгол тал нутаг ба Сөүлийн хороолол, хооронд нь гуулин нумаар холбосон',
  settle: 'Нисэх буудал, орон сууц, эмнэлэг, банк, дэлгүүр, үйлдвэр, сургууль, метро, ханок бүхий Сөүлийн хорооллын макет',
  steppe: 'Гэр, адуу, гол бүхий Монгол тал нутгийн макет',
  arrive: 'Нисэх буудал ба нислэгийн зурвасын макет',
  living: 'Орон сууц, банк, 24 цагийн дэлгүүрийн макет',
  work: 'Үйлдвэр ба чингэлэгүүдийн макет',
  health: 'Эмнэлгийн макет',
  culture: 'Ханок байшин, цөөрөм ба сургуулийн макет',
  finale: 'Шөнийн үзэсгэлэнгийн гэрэлд гэрэлтэх хоёр макет',
};

export default function DesignLabD() {
  const recentUpdates = getRecentUpdates(5);
  const community = guideMap.community;

  return (
    <div className={`${styles.root} min-h-content`}>
      <Experience>
        <Hero hero={hero} art={heroArt} places={places} guideMap={guideMap} copy={copy} alts={alts} />
        <Emergency emergency={emergency} />
        <Situations heading={situationsHeading} situations={situations} />
        <Catalogue section={guidesSection} guides={guides} />
        <Rooms rooms={rooms} guideMap={guideMap} copy={copy} crop={planCrop} planImg={`${ASSET}/k0.webp`} alts={alts} />
        {recentUpdates.length > 0 && (
          <Updates heading={updatesHeading} items={recentUpdates} exchange={exchange} />
        )}
        <Finale
          title={copy.finaleTitle}
          about={about}
          community={community}
          donate={donate}
          art={{ desktop: `${ASSET}/finale.webp`, mobile: `${ASSET}/finale-m.webp` }}
          alt={alts.finale}
        />
      </Experience>
    </div>
  );
}
