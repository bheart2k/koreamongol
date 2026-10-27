// 도착 후 가이드 — /topik·/jobs 와 같은 틀(guide-c). 기록: docs/guides-redesign.md
// 제목(H1·H2)·섹션 id·구조화 데이터·조회수 기록·체크리스트 저장 키는 개편 전과 같다. 바뀐 것은 배치와 디자인뿐.
import { ReportBanner, DonateBanner, ShareButtons, GuideNav, GuideViewTracker, RelatedTips } from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  GuideCPage, GuideCHero, GuideCNav, GuideCSection, GuideCSectionRow, GuideCTail,
  Cols, Cols3, SubTitle, Lead, CFine, CTable, CList, CNote, CLinks, CCards, CContacts,
} from '@/components/guide-c/GuideC';
import { CRows } from '@/components/guide-c/GuideCParts';
import GuideCHeroArt from '@/components/guide-c/GuideCHeroArt';
import GuideCCheckList from '@/components/guide-c/GuideCCheckList';
import { HOME_ASSET_BASE, copy as homeCopy } from '@/data/home';
import {
  arrivalMeta, arrivalSections, arrivalTimeline,
  arrivalTips, essentialApps, alienRegistration,
  bankRecommendations, phoneInfo, arrivalLinks,
} from '@/data/guides/arrival';

const BASE_URL = 'https://koreamongol.com';

const no = (id) => String(arrivalSections.findIndex((x) => x.id === id) + 1).padStart(2, '0');

const findItems = alienRegistration.howToFind.items;
const webFind = findItems.filter((it) => !it.href.startsWith('tel:'));
const telFind = findItems.filter((it) => it.href.startsWith('tel:'));
const half = Math.ceil(arrivalTips.length / 2);
const tipCards = arrivalTips.map((t) => ({ title: t.title, text: t.description }));

export default function ArrivalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Ирсний дараа', url: `${BASE_URL}/arrival` },
      ]} />
      <HowToJsonLd
        name="Солонгост ирсний дараа хийх зүйлс"
        description="Солонгост шинээр ирсэн монгол иргэдэд зориулсан алхам алхмаар гарын авлага: бүртгэл, банк, утас, даатгал."
        steps={[
          { title: 'SIM карт ба T-money авах', description: '공항 편의점-оос SIM карт, T-money карт авах' },
          { title: 'Гадаадын иргэний бүртгэл (외국인등록)', description: '출입국관리사무소-д бүртгүүлэх (90 хоногийн дотор)' },
          { title: 'Банкны данс нээх', description: '외국인등록증 авсны дараа банкны данс нээх' },
          { title: 'Гар утасны гэрээ хийх', description: '외국인등록증-тэй бол 후불 гэрээ хийх боломжтой' },
          { title: 'Эрүүл мэндийн даатгал шалгах', description: 'Автоматаар бүртгэгдэнэ (E-9, D-2 ирсэн өдрөөс, бусад нь 6 сарын дараа)' },
          { title: 'Хаяг солих бол 체류지 변경신고', description: 'Нүүснээс хойш 15 хоногийн дотор 주민센터 эсвэл 출입국-д' },
        ]}
      />
      <GuideViewTracker guideId="arrival" />
      <GuideCPage>
        <GuideCHero
          breadcrumbLabel={arrivalMeta.title}
          kicker="Гарын авлага"
          title={arrivalMeta.title}
          subtitle={arrivalMeta.subtitle}
          updated={arrivalMeta.lastUpdated}
          updatedLabel="Сүүлд шинэчилсэн"
          art={(
            <GuideCHeroArt image={`${HOME_ASSET_BASE}/c2-airport.webp`} alt="" loop="loop-c2" loopNight="loop-c2-night" base={HOME_ASSET_BASE}
              labels={{ pause: homeCopy.pause, play: homeCopy.play }} />
          )}
          links={webFind.map((it) => ({ href: it.href, title: it.label }))}
          linksLabel="Албан ёсны сайт:"
        />
        <GuideCNav sections={arrivalSections} label="Агуулга" />

        {/* 첫 화면 답: 언제 무엇을 — 기간별 체크리스트 3개를 나란히 */}
        <GuideCSectionRow>
          {arrivalTimeline.map((period) => (
            <GuideCSection key={period.storageKey} id={period.storageKey} no={no(period.storageKey)} title={period.period}>
              <GuideCCheckList items={period.items} storageKey={period.storageKey} />
            </GuideCSection>
          ))}
        </GuideCSectionRow>

        <GuideCSection id="arrival-alien" no={no('arrival-alien')} title={alienRegistration.title}>
          <CRows rows={[
            { name: 'Хугацаа', value: alienRegistration.deadline },
            { name: 'Хураамж', value: alienRegistration.cost },
            { name: 'Хүлээлт', value: alienRegistration.duration },
          ]} />
          <Cols>
            <div>
              <SubTitle>Шаардлагатай бичиг баримт</SubTitle>
              <CList items={alienRegistration.required} />
            </div>
            <div>
              <SubTitle>{alienRegistration.howToFind.title}</SubTitle>
              <CLinks links={webFind.map((it) => ({ href: it.href, title: it.label, description: it.value }))} />
              <CContacts contacts={telFind.map((it) => ({ label: it.value, number: it.label }))} />
            </div>
          </Cols>
          <CNote tone="warn" title="Анхаар!">
            <p>90 хоногийн дотор бүртгүүлэхгүй бол торгууль ногдуулна. Аль болох эрт бүртгүүлэх!</p>
          </CNote>
        </GuideCSection>

        <GuideCSection id="arrival-bank" no={no('arrival-bank')} title={bankRecommendations.title}>
          <SubTitle>Шаардлагатай</SubTitle>
          <CList items={bankRecommendations.required} />
          <Cols3>
            {bankRecommendations.banks.map((bank) => (
              <div key={bank.name}>
                <SubTitle>{bank.name}</SubTitle>
                <CFine>{bank.why}</CFine>
                <CList items={bank.features} />
              </div>
            ))}
          </Cols3>
          <CNote title="Зөвлөгөө"><p>{bankRecommendations.tip}</p></CNote>
        </GuideCSection>

        <GuideCSection id="arrival-phone" no={no('arrival-phone')} title={phoneInfo.title}>
          <Cols>
            <div>
              <SubTitle>{phoneInfo.prepaid.title}</SubTitle>
              <CFine>{phoneInfo.prepaid.description}</CFine>
              <CList items={phoneInfo.prepaid.items} />
              <CFine>Брэнд: {phoneInfo.prepaid.brands.join(', ')}</CFine>
            </div>
            <div>
              <SubTitle>{phoneInfo.postpaid.title}</SubTitle>
              <CFine>{phoneInfo.postpaid.description}</CFine>
              <CList items={phoneInfo.postpaid.items} />
              <CFine><strong>Санал болгох MVNO</strong></CFine>
              <CList items={phoneInfo.postpaid.mvno.map((m) => `${m.name} — ${m.note}`)} />
            </div>
          </Cols>
          <CNote title="KT тусгай нөхцөл"><p>{phoneInfo.postpaid.tip}</p></CNote>
        </GuideCSection>

        <GuideCSection id="arrival-tips" no={no('arrival-tips')} title="Амьдралын зөвлөгөө">
          <Cols>
            <div><CCards items={tipCards.slice(0, half)} /></div>
            <div><CCards items={tipCards.slice(half)} /></div>
          </Cols>
        </GuideCSection>

        <GuideCSection id="arrival-apps" no={no('arrival-apps')} title="Заавал суулгах апп">
          <CTable headers={['Апп', 'Төрөл', 'Тайлбар']} rows={essentialApps} />
        </GuideCSection>

        <GuideCSection id="arrival-links" no={no('arrival-links')} title="Хэрэгтэй линк">
          <CLinks links={arrivalLinks} />
        </GuideCSection>

        <GuideCTail>
          <RelatedTips slugs={['alien-registration', 'phone-sim', 'open-bank-account']} />
          <ReportBanner pageUrl="/arrival" />
          <DonateBanner />
          <ShareButtons />
          <GuideNav currentGuideId="arrival" />
        </GuideCTail>
      </GuideCPage>
    </>
  );
}
