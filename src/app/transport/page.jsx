// 교통 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 바뀐 것은 배치와 디자인뿐.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, SubTitle, Lead, CFine, CTable, CSteps, CList, CNote, CLinks,
} from '@/components/guide-c/GuideC';
import { CStats, CRows, CMethods } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  transportMeta, transportSections, FARE_DATE,
  tmoney, metro, bus, taxi, ktx,
  transportApps, transportTips, transportLinks,
} from '@/data/guides/transport';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(transportSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

// 첫 화면 답: 기본요금 세 가지 — 값은 모두 아래 표의 데이터에서
const fareStats = [
  { label: `Метро (${metro.fares.headers[1]})`, value: metro.fares.rows[0][1] },
  { label: `Автобус (${bus.types.rows[0][0].split(' (')[0]})`, value: bus.types.rows[0][2] },
  { label: `Такси (${taxi.fares.rows[0][0].split(' (')[0]})`, value: taxi.fares.rows[0][1] },
];

export default function TransportPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Тээврийн гарын авлага', url: `${BASE_URL}/transport` },
      ]} />
      <HowToJsonLd
        name="Солонгосын нийтийн тээвэр ашиглах"
        description="T-money карт авах, метро, автобус, такси, KTX ашиглах алхамчилсан гарын авлага."
        steps={[
          { title: 'T-money карт авах', description: '편의점 эсвэл метро станцаас T-money карт худалдаж авах (₩3,000~₩5,000)' },
          { title: 'T-money цэнэглэх', description: '편의점 эсвэл метро станцын автоматаар мөнгө цэнэглэх' },
          { title: 'Метро/автобуснд суух', description: 'Карт уншуулж суух, буухдаа дахин уншуулах' },
          { title: 'Такси дуудах', description: 'Kakao T эсвэл TABA апп ашиглан такси захиалах' },
        ]}
      />
      <GuideViewTracker guideId="transport" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={transportMeta.title}
          kicker="Гарын авлага"
          title={transportMeta.title}
          subtitle={transportMeta.subtitle}
          updated={transportMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c2-airport.webp`} alt="" loop="loop-c2" loopNight="loop-c2-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={transportLinks.slice(0, 2)}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={transportSections} label="Агуулга" />

        <GuideCSection id="tr-card" no={no('tr-card')} title={tmoney.title}>
          <CStats items={fareStats} />
          <CFine>Үнийн мэдээлэл: {FARE_DATE} огноогоор шалгасан. Үнэ өөрчлөгдөх боломжтой.</CFine>
          <Lead>{tmoney.description}</Lead>
          <Cols>
            <div>
              <SubTitle>Үнэ</SubTitle>
              <CList items={[tmoney.price]} />
              <SubTitle>Хаанаас авах</SubTitle>
              <CList items={tmoney.where} />
            </div>
            <div>
              <SubTitle>Цэнэглэх</SubTitle>
              <CList items={tmoney.charge} />
              <CNote title="T-money давуу тал"><CList items={tmoney.benefits} /></CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="tr-metro" no={no('tr-metro')} title={metro.title}>
          <Lead>{metro.description}</Lead>
          <CTable headers={metro.fares.headers} rows={metro.fares.rows} />
          <CFine>* {metro.distanceExtra}</CFine>
          <CFine>{metro.hours}</CFine>
          <SubTitle>Метрон дотор анхаарах</SubTitle>
          <CList items={metro.tips} />
        </GuideCSection>

        <GuideCSection id="tr-bus" no={no('tr-bus')} title={bus.title}>
          <Lead>{bus.description}</Lead>
          <CTable headers={bus.types.headers} rows={bus.types.rows} />
          <Cols>
            <div>
              <SubTitle>Автобус хэрхэн ашиглах</SubTitle>
              <CSteps steps={bus.howTo} />
            </div>
            <div>
              <CNote tone="warn" title="Буухдаа карт уншуул!">
                <p>Автобуснаас буухдаа заавал карт уншуулаарай. Уншуулахгүй бол дараагийн тээвэрт шилжих хөнгөлөлт авахгүй.</p>
              </CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="tr-taxi" no={no('tr-taxi')} title={taxi.title}>
          <CTable headers={taxi.fares.headers} rows={taxi.fares.rows} />
          <CFine>{taxi.note}</CFine>
          <Cols>
            <div>
              <SubTitle>Шөнийн нэмэлт (심야할증)</SubTitle>
              <CRows rows={taxi.surcharge.map((x) => ({ name: x.time, value: x.rate }))} />
              <CNote title="Такси зөвлөгөө"><CList items={taxi.tips} /></CNote>
            </div>
            <div>
              <SubTitle>Такси дуудах апп</SubTitle>
              <CMethods items={taxi.apps.map((a) => ({ title: a.name, text: a.description, href: a.url }))} />
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="tr-ktx" no={no('tr-ktx')} title={ktx.title}>
          <Lead>{ktx.description}</Lead>
          <CTable headers={ktx.routes.headers} rows={ktx.routes.rows} />
          <Cols>
            <div>
              <SubTitle>Тасалбар захиалах</SubTitle>
              <CSteps steps={ktx.booking} />
            </div>
            <div><CNote title="KTX зөвлөгөө"><CList items={ktx.tips} /></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="tr-apps" no={no('tr-apps')} title="Тээврийн аппууд">
          <CMethods items={transportApps.map((a) => ({ title: a.name, text: a.description, list: a.features }))} />
        </GuideCSection>

        <GuideCSection id="tr-tips" no={no('tr-tips')} title="Зөвлөгөө">
          <CNote title="Тээврийн зөвлөгөө"><CList items={transportTips} /></CNote>
        </GuideCSection>

        <GuideCSection id="tr-links" no={no('tr-links')} title="Хэрэгтэй линкүүд">
          <CLinks links={transportLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['tmoney-card']} />
          <ReportBanner pageUrl="/transport" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="transport" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
