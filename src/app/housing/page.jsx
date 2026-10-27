// 주거 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록·체크리스트 저장 키는 개편 전과 같다. 바뀐 것은 배치와 디자인뿐.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCTail,
  Cols, SubTitle, CFine, CTable, CSteps, CList, CNote, CLinks, CContacts,
} from '@/components/guide-c/GuideC';
import { CRows, CMethods, CTypeCards } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import GuideCCheckList from '@/components/guide-c/GuideCCheckList';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  housingMeta, housingSections, housingTypes, costSystem,
  housingSearchMethods, contractSteps, housingChecklist,
  housingContractWarnings, moveInLife, scamWarnings, savingTips,
  housingContacts, housingLinks,
} from '@/data/guides/housing';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(housingSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');
const officialLinks = housingLinks.filter((l) => /iros\.go\.kr|klac\.or\.kr/.test(l.href));

export default function HousingPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Байр ба орон сууц', url: `${BASE_URL}/housing` },
      ]} />
      <HowToJsonLd
        name="Солонгост байрны гэрээ хийх алхмууд"
        description="Байр хайхаас эхлээд гэрээ байгуулах хүртэлх алхмууд"
        steps={contractSteps}
      />
      <GuideViewTracker guideId="housing" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel="Байр"
          kicker="Гарын авлага"
          title={housingMeta.title}
          subtitle={housingMeta.subtitle}
          updated={housingMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c3-living.webp`} alt="" loop="loop-c3" loopNight="loop-c3-night-v5" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={officialLinks}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={housingSections} label="Агуулга" />

        <GuideCSection id="housing-types" no={no('housing-types')} title="Байрны төрлүүд">
          <CTable headers={housingTypes.comparison.headers} rows={housingTypes.comparison.rows} />
          <CFine>{housingTypes.note}</CFine>
          <SubTitle>Дэлгэрэнгүй</SubTitle>
          <CTypeCards
            items={housingTypes.details.map((t) => ({ title: t.title, text: t.description, pros: t.pros, cons: t.cons }))}
            prosLabel="Давуу" consLabel="Сул"
          />
        </GuideCSection>

        <GuideCSection id="housing-cost-system" no={no('housing-cost-system')} title="Барьцаа / Түрээс / 관리비">
          <CMethods items={costSystem.concepts.map((c) => ({ title: c.title, text: c.description, note: c.example }))} />
          <Cols>
            <div>
              <SubTitle>{costSystem.maintenanceFee.title}</SubTitle>
              <CFine>{costSystem.maintenanceFee.description}</CFine>
              <CRows rows={costSystem.maintenanceFee.items.map((it) => ({ name: it.name, value: it.included }))} />
            </div>
            <div><CNote tone="warn" title="Өвөл анхааруулга"><p>{costSystem.winterWarning}</p></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="housing-how-to-find" no={no('housing-how-to-find')} title="Байр хайх арга">
          <CMethods items={housingSearchMethods.map((m) => ({ title: m.title, tag: m.target, text: m.description, href: m.url }))} />
        </GuideCSection>

        <GuideCSection id="housing-contract" no={no('housing-contract')} title="Гэрээний чеклист">
          <Cols>
            <div><CSteps steps={contractSteps} /></div>
            <div><GuideCCheckList items={housingChecklist} storageKey="housing-contract" /></div>
          </Cols>
          <CNote tone="warn" title="Анхааруулга"><CList items={housingContractWarnings} /></CNote>
        </GuideCSection>

        <GuideCSection id="housing-move-in" no={no('housing-move-in')} title="Нүүж орсны дараа">
          <SubTitle>Хог ангилал (분리수거)</SubTitle>
          <CMethods items={moveInLife.garbageCategories.map((g) => ({ title: g.type, text: g.rule, note: g.note }))} />
          <CNote tone="warn" title="Анхаар"><p>{moveInLife.garbageWarning}</p></CNote>
          <Cols>
            <div>
              <SubTitle>Дуу чимээний дүрэм (층간소음)</SubTitle>
              <CList items={moveInLife.noiseRules} />
            </div>
            <div>
              <SubTitle>Гарах үед</SubTitle>
              <CList items={moveInLife.movingOutTips} />
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="housing-warnings" no={no('housing-warnings')} title="Залилан сэрэмжлүүлэг">
          <Cols>
            <div><CNote tone="warn" title="Залилангаас сэргийлэх"><CList items={scamWarnings} /></CNote></div>
            <div><CNote title="Хэмнэх зөвлөгөө"><CList items={savingTips} /></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="housing-links" no={no('housing-links')} title="Хэрэгтэй утас / Линк">
          <CContacts contacts={housingContacts} />
          <CLinks links={housingLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['housing-deposit']} />
          <ReportBanner pageUrl="/housing" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="housing" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
