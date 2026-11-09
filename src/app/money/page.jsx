// 송금·금융 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록은 개편 전과 같다. 바뀐 것은 배치와 디자인뿐.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCSectionRow, GuideCTail,
  Cols, SubTitle, Lead, CFine, CTable, CSteps, CList, CNote, CLinks,
} from '@/components/guide-c/GuideC';
import { CRows, CMethods, CTypeCards } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  moneyMeta, moneySections, remittanceComparison,
  remittanceMethods, exchangeTips, financeWarnings, moneyLinks,
  financeBasics, insuranceInfo,
} from '@/data/guides/money';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(moneySections.findIndex((x) => x.id === id) + 1).padStart(2, '0');
const officialLinks = moneyLinks.filter((l) => /gmeremit|hanpass|nps\.or\.kr/.test(l.href));
const { bankAccount, cards, atm, tugrikWarning } = financeBasics;
const { refund } = insuranceInfo;

// 반환일시금 안내 줄 "제목: 설명" → 단계 카드
const refundSteps = refund.steps.map((line) => {
  const i = line.indexOf(': ');
  return i > 0 ? { title: line.slice(0, i), description: line.slice(i + 2) } : { title: line };
});

export default function MoneyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Мөнгө ба санхүү', url: `${BASE_URL}/money` },
      ]} />
      <HowToJsonLd
        name="Солонгосоос Монгол руу мөнгө шилжүүлэх"
        description="GME, Hanpass зэрэг аппаар Монгол руу хялбар, хямд мөнгө шилжүүлэх алхамчилсан гарын авлага."
        steps={[
          { title: 'Шилжүүлгийн арга сонгох', description: 'GME, Hanpass, Western Union зэргийг хураамж, хурдаар нь харьцуулж сонгох' },
          { title: 'Апп татаж бүртгүүлэх', description: 'Сонгосон аппыг татаж, паспорт/외국인등록증-ээр бүртгүүлэх' },
          { title: 'Хүлээн авагчийн мэдээлэл оруулах', description: 'Монгол дахь хүлээн авагчийн нэр, банкны данс оруулах' },
          { title: 'Мөнгө шилжүүлэх', description: 'Дүн оруулж, ханш шалгаад шилжүүлэг хийх' },
        ]}
      />
      <GuideViewTracker guideId="money" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={moneyMeta.title}
          kicker="Гарын авлага"
          title={moneyMeta.title}
          subtitle={moneyMeta.subtitle}
          updated={moneyMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c3-living.webp`} alt="" loop="loop-c3" loopNight="loop-c3-night-v5" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={officialLinks}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={moneySections} label="Агуулга" />

        <GuideCSection id="money-comparison" no={no('money-comparison')} title="Шилжүүлгийн арга харьцуулалт">
          <CTable headers={remittanceComparison.headers} rows={remittanceComparison.rows} />
        </GuideCSection>

        <GuideCSection id="money-methods" no={no('money-methods')} title="Арга бүрийн дэлгэрэнгүй">
          <CTypeCards
            items={remittanceMethods.map((m) => ({ title: m.name, text: m.description, pros: m.pros, cons: m.cons }))}
            prosLabel="Давуу тал" consLabel="Сул тал"
          />
        </GuideCSection>

        <GuideCSection id="money-finance" no={no('money-finance')} title="Санхүүгийн үндсэн мэдлэг">
          <Cols>
            <div>
              <SubTitle>{bankAccount.title}</SubTitle>
              <CFine>Шаардлагатай бичиг баримт:</CFine>
              <CList items={bankAccount.required} />
              <SubTitle>Санал болгох банкууд</SubTitle>
              <CMethods items={bankAccount.banks.map((b) => ({ title: b.name, text: b.features }))} />
              <SubTitle>Онлайн банк</SubTitle>
              <CRows rows={bankAccount.onlineBanks.map((b) => ({ name: b.name, value: `${b.available ? '✓' : '✗'} ${b.note}` }))} />
            </div>
            <div>
              <SubTitle>{cards.title}</SubTitle>
              <CMethods items={cards.items.map((c) => ({ title: c.type, text: c.description, note: c.condition }))} />
              <SubTitle>{atm.title}</SubTitle>
              <CList items={atm.items} />
              <CNote title="Үнэгүй ATM"><p>{atm.freeAtmTip}</p></CNote>
              <CNote tone="warn" title={tugrikWarning.title}><CList items={tugrikWarning.items} /></CNote>
            </div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="money-insurance" no={no('money-insurance')} title={insuranceInfo.title}>
          <Lead>{insuranceInfo.subtitle}</Lead>
          <CMethods items={insuranceInfo.items.map((ins) => ({ title: ins.name, text: ins.description, note: ins.note }))} />
          <Cols>
            <div>
              <SubTitle>{refund.title}</SubTitle>
              <CFine>{refund.description}</CFine>
              <CSteps steps={refundSteps} />
            </div>
            <div><CNote tone="warn" title="Анхаар!"><p>{refund.warning}</p></CNote></div>
          </Cols>
        </GuideCSection>

        <GuideCSectionRow>
          <GuideCSection id="money-warnings" no={no('money-warnings')} title="Анхааруулга">
            {financeWarnings.map((w) => (
              <CNote key={w.title} tone="warn" title={w.title}><CList items={w.items} /></CNote>
            ))}
          </GuideCSection>

          <GuideCSection id="money-tips" no={no('money-tips')} title="Зөвлөгөө">
            <CNote title="Ханшийн зөвлөгөө"><CList items={exchangeTips} /></CNote>
          </GuideCSection>

          <GuideCSection id="money-links" no={no('money-links')} title="Хэрэгтэй линкүүд">
            <CLinks links={moneyLinks} />
          </GuideCSection>
        </GuideCSectionRow>

        <GuideCTail>
          <RelatedTips slugs={['send-money-to-mongolia', 'open-bank-account', 'pension-refund']} />
          <ReportBanner pageUrl="/money" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="money" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
