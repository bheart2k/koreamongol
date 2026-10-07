// /design-lab/b — 시안 B 「두 개의 고향」 (Editorial Duality)
// 서버 컴포넌트. 모션은 같은 폴더의 클라이언트 컴포넌트로 분리.
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  hero, situationsHeading, situations, emergency, guidesSection, guides,
  updatesHeading, exchange, about, donate,
} from '../_shared/home-data';
import { getRecentUpdates } from '@/lib/recent-updates';
import { heroMedia, plates, finaleMedia, guidePreview, smallOf } from './assets';
import { display, mono } from './fonts';
import MotionRoot from './MotionRoot';
import Hero from './Hero';
import Marquee from './Marquee';
import GuideIndex from './GuideIndex';
import Plate from './Plate';
import ExchangeFigure from './ExchangeFigure';
import Finale from './Finale';
import s from './b.module.css';

export const metadata = {
  title: '시안 B — 두 개의 고향',
  description: '홈 리디자인 시안 B: Editorial Duality (내부용)',
};

export default function DesignLabB() {
  const recent = getRecentUpdates(5);
  // lucide 컴포넌트(icon)는 클라이언트로 넘기지 않는다
  const guideItems = guides.map(({ icon, ...g }) => ({
    ...g, preview: guidePreview[g.id], previewSm: smallOf(guidePreview[g.id]),
  }));
  const community = guides.find((g) => g.id === 'community');

  return (
    <MotionRoot className={`${s.b} ${display.variable} ${mono.variable}`}>
      <Hero hero={hero} media={heroMedia} />

      {/* 모바일: 히어로 아래 소개 문구 */}
      <div className={s.mobileIntro}>
        <p>{hero.lead}</p>
        <a href={hero.cta.href} className={s.arrowLink}>{hero.cta.label}<ArrowUpRight aria-hidden="true" /></a>
      </div>

      <Marquee heading={situationsHeading} items={situations} />

      <section className={s.sos} aria-label={emergency.ariaLabel}>
        <div className={s.wrap}>
          <p className={s.sosLabel}><span>SOS</span> {emergency.ariaLabel}</p>
          <ul className={s.sosList}>
            {emergency.items.map((it) => (
              <li key={it.number}>
                <a href={`tel:${it.number}`} className={s.sosItem}>
                  <span className={s.sosNum}>{it.number}</span>
                  <span className={s.sosText}>{it.label.replace(/:$/, '')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={guidesSection.id} className={s.guides} aria-labelledby="b-guides-title">
        <div className={s.wrap}>
          <header className={s.secHead}>
            <p className={s.secNo}><span>01</span> Гарын авлага</p>
            <h2 id="b-guides-title" className={s.secTitle} data-reveal="lines">{guidesSection.title}</h2>
            <p className={s.secSub} data-reveal="fade">{guidesSection.subtitle}</p>
          </header>
          <GuideIndex items={guideItems} />
        </div>
      </section>

      <Plate plate={plates[0]} variant="a" />

      <section className={s.ledger} aria-label={`${updatesHeading} · ${exchange.title}`}>
        <div className={`${s.wrap} ${s.ledgerGrid}`}>
          <div className={s.updates}>
            <p className={s.secNo}><span>02</span> Шинэчлэл</p>
            <h2 className={s.ledgerTitle} data-reveal="lines">{updatesHeading}</h2>
            <ul className={s.updateList}>
              {recent.map((item) => (
                <li key={item.href}>
                  <span className={s.rowRule} data-reveal="rule" aria-hidden="true" />
                  <Link href={item.href} className={s.updateItem}>
                    <span className={s.updateCat}>{item.category}</span>
                    <span className={s.updateTitle}>{item.title}</span>
                    <time dateTime={item.lastUpdated} className={s.updateDate}>{item.lastUpdated}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.rate}>
            <p className={s.secNo}><span>03</span> Ханш</p>
            <h2 className={s.ledgerTitle} data-reveal="lines">{exchange.title}</h2>
            <ExchangeFigure exchange={exchange} />
          </div>
        </div>
      </section>

      <Plate plate={plates[3]} variant="b" />

      <Plate plate={plates[1]} variant="c">
        <div className={s.about}>
          <p className={s.secNo}><span>04</span> Бидний тухай</p>
          <h2 className={s.aboutTitle}>
            <span className={s.logoKorea}>Korea</span><span className={s.logoMongol}>Mongol</span>
          </h2>
          <p className={s.aboutBody} data-reveal="lines">{about.paragraphs[0]}</p>
          <blockquote className={s.aboutQuote} data-reveal="fade">{about.paragraphs[1]}</blockquote>
          <Link href={about.link.href} className={s.arrowLink}>{about.link.label}<ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </Plate>

      <Plate plate={plates[2]} variant="d" />

      <Finale media={finaleMedia} community={community} donate={donate} />
    </MotionRoot>
  );
}
