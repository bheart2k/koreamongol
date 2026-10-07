import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Coffee, Heart, RefreshCw, Users } from 'lucide-react';
import ExchangeTicker from './ExchangeTicker';
import base from './d.module.css';
import styles from './sections.module.css';
import fx from './finale.module.css';

export function Emergency({ emergency }) {
  return (
    <section className={styles.emergency} aria-label={emergency.ariaLabel}>
      <ul className={`${base.wrap} ${styles.emList}`} data-reveal="stagger">
        {emergency.items.map((it) => (
          <li key={it.number} data-item="">
            <a href={`tel:${it.number}`} className={styles.emItem}>
              <span className={styles.emEmoji} aria-hidden="true">{it.emoji}</span>
              <span className={styles.emLabel}>{it.label}</span>
              <strong className={styles.emNumber}>{it.number}</strong>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Situations({ heading, situations }) {
  return (
    <section className={styles.situations} aria-labelledby="d-situations">
      <div className={`${base.wrap} ${styles.split}`}>
        <h2 id="d-situations" className={styles.sectionTitle} data-reveal="rise">{heading}</h2>
        <ul className={styles.tiles} data-reveal="stagger">
          {situations.map((s, i) => (
            <li key={s.href + s.label} data-item="">
              <Link href={s.href} className={styles.tile} data-tilt="">
                <span className={styles.tileNo} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.tileEmoji} aria-hidden="true">{s.emoji}</span>
                <span className={styles.tileLabel}>{s.label}</span>
                <ArrowRight className={styles.tileArrow} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// 가이드 14개 — 전시 도록의 작품 목록처럼 번호 매긴 촘촘한 3단 목록
export function Catalogue({ section, guides }) {
  return (
    <section id={section.id} className={styles.catalogue} aria-labelledby="d-guides">
      <div className={base.wrap}>
        <div className={styles.catHead} data-reveal="rise">
          <h2 id="d-guides" className={styles.sectionTitle}>{section.title}</h2>
          <p>{section.subtitle}</p>
        </div>
        <ol className={styles.catList} data-reveal="stagger">
          {guides.map((g, i) => {
            const Icon = g.icon;
            return (
              <li key={g.id} data-item="">
                <Link href={g.href} className={styles.catRow}>
                  <span className={styles.catNo} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.catIcon}><Icon aria-hidden="true" strokeWidth={1.5} /></span>
                  <span className={styles.catText}>
                    <strong>{g.title}</strong>
                    <span>{g.desc}</span>
                  </span>
                  <ArrowUpRight className={styles.catArrow} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Updates({ heading, items, exchange }) {
  return (
    <section className={fx.updates} aria-labelledby="d-updates">
      <div className={`${base.wrap} ${fx.updatesGrid}`}>
        <div className={fx.updateCard} data-reveal="rise">
          <h2 id="d-updates" className={fx.updateTitle}><RefreshCw aria-hidden="true" />{heading}</h2>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span>{item.title}</span>
                  <time dateTime={item.lastUpdated}>{item.lastUpdated}</time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal="rise">
          <ExchangeTicker exchange={exchange} />
        </div>
      </div>
    </section>
  );
}

export function Finale({ title, about, community, donate, art, alt }) {
  return (
    <section className={fx.finale} aria-labelledby="d-finale">
      <div className={fx.finalePanel}>
        <div className={fx.finaleArt}>
          <picture data-zoom="">
            <source media="(max-aspect-ratio: 1/1)" srcSet={art.mobile} />
            <img src={art.desktop} alt={alt} loading="lazy" decoding="async" />
          </picture>
        </div>
        <div className={fx.finaleCopy}>
          <p className={base.kicker}>{about.title}</p>
          <h2 id="d-finale" className={fx.finaleTitle} data-reveal="rise">{title}</h2>
          <div className={fx.finaleText} data-reveal="rise">
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className={fx.finaleActions} data-reveal="rise">
            <Link href={community.href} className={fx.finaleCommunity} data-magnetic="">
              <Users aria-hidden="true" />
              <span><strong>{community.title}</strong><span>{community.desc}</span></span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href={about.link.href} className={fx.finaleAbout}>
              {about.link.label}<ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className={`${base.wrapMid} ${fx.donate}`} data-reveal="rise">
        <span className={fx.donateIcon} aria-hidden="true"><Coffee /></span>
        <p><strong>{donate.strong}</strong> {donate.text}</p>
        <Link href={donate.link.href} className={fx.donateLink} data-magnetic="">
          <Heart aria-hidden="true" />{donate.link.label}
        </Link>
      </div>
    </section>
  );
}
