// 앱·도구 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·조회수 기록은 개편 전과 같다. 앱 카드는 카드 전체가 Play Store(없으면 웹사이트) 링크.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail, Cols, CList, CNote, CLinks,
} from '@/components/guide-c/GuideC';
import { CMethods } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  appsMeta, appsSections, essentialApps, shoppingApps,
  transportApps, translateApps, toolLinks, usefulWebsites,
  appTips, appWarning, appsLinks,
} from '@/data/guides/apps';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(appsSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');
// 링크가 둘이면 작은 버튼 2개(Play Store / Вэбсайт), 하나면 같은 버튼 1개 — 어디로 가는지 글자로 보인다
const appCards = (apps) => apps.map((a) => ({
  title: a.name, tag: a.category, text: a.description, note: a.tip,
  links: [a.playStore && { href: a.playStore, label: 'Play Store' }, a.website && { href: a.website, label: 'Вэбсайт' }].filter(Boolean),
}));

export default function AppsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: appsMeta.title, url: `${BASE_URL}/apps` },
      ]} />
      <GuideViewTracker guideId="apps" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={appsMeta.title}
          kicker="Гарын авлага"
          title={appsMeta.title}
          subtitle={appsMeta.subtitle}
          updated={appsMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c3-living.webp`} alt="" loop="loop-c3" loopNight="loop-c3-night-v5" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
        />
        <GuideCNav sections={[...appsSections, { id: 'apps-related', label: 'Холбоотой' }]} label="Агуулга" />

        <GuideCSection id="apps-essential" no={no('apps-essential')} title="Заавал суулгах апп">
          <CMethods items={appCards(essentialApps)} />
        </GuideCSection>

        <GuideCSection id="apps-shopping" no={no('apps-shopping')} title="Худалдаа & хүргэлт">
          <CMethods items={appCards(shoppingApps)} />
        </GuideCSection>

        <GuideCSection id="apps-transport" no={no('apps-transport')} title="Тээвэр & газрын зураг">
          <CMethods items={appCards(transportApps)} />
        </GuideCSection>

        <GuideCSection id="apps-translate" no={no('apps-translate')} title="Орчуулга & толь бичиг">
          <CMethods items={appCards(translateApps)} />
        </GuideCSection>

        <GuideCSection id="apps-tools" no={no('apps-tools')} title="Тооцоолуур & хэрэгсэл">
          <CMethods items={toolLinks.map((t) => ({ title: t.title, text: t.description, href: t.href, internal: t.isInternal }))} />
        </GuideCSection>

        <GuideCSection id="apps-websites" no={no('apps-websites')} title="Хэрэгтэй вэбсайтууд">
          <CLinks links={usefulWebsites} />
        </GuideCSection>

        <GuideCSection id="apps-tips" no={no('apps-tips')} title="Апп суулгах зөвлөгөө">
          <Cols>
            <div><CNote title="Зөвлөгөө"><CList items={appTips} /></CNote></div>
            <div><CNote tone="warn" title="Анхааруулга"><p>{appWarning}</p></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="apps-related" no={String(appsSections.length + 1).padStart(2, '0')} title="Холбоотой гарын авлага">
          <CMethods items={appsLinks.map((l) => ({ title: l.title, text: l.description, href: l.href, internal: true }))} />
        </GuideCSection>

        <GuideCTail>
          <ReportBanner pageUrl="/apps" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="apps" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
