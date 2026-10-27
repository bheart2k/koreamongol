// 세부 가이드 페이지 새 틀 (시안 C 디자인) — 서버 컴포넌트만. 색 토큰은 홈과 같은 home.module.css .root 를 쓴다.
// 본문은 모두 서버 HTML 에 그대로 나온다(접지 않음). 섹션 id 는 기존 페이지와 같게 써서 앵커 링크를 유지한다.
import { ArrowDown, ArrowUpRight, ExternalLink, Lightbulb, Phone, TriangleAlert } from 'lucide-react';
import { GuideBreadcrumb } from '@/components/guide/GuideBreadcrumb';
import { TableScroll } from '@/components/guide/TableScroll';
import home from '@/components/home/home.module.css';
import s from './guideC.module.css';

export function GuideCPage({ children }) {
  return <main className={`${home.root} ${s.page}`}>{children}</main>;
}

// 머리: 경로 · 제목 · 설명 · 수정일 · 공식 사이트 (+ 데스크톱 오른쪽 그림)
// calls: 첫 화면에서 바로 거는 전화 버튼(선택, 예: 119·112)
export function GuideCHero({ breadcrumbLabel, kicker, title, subtitle, updated, updatedLabel, art, links, linksLabel, calls }) {
  return (
    <header className={s.hero}>
      <div className={s.heroInner}>
        <div className={s.heroText}>
          <GuideBreadcrumb label={breadcrumbLabel} />
          <p className={home.kicker}>{kicker}</p>
          <h1 className={s.title}>{title}</h1>
          <p className={s.subtitle}>{subtitle}</p>
          {links?.length > 0 && (
            <div className={s.officialRow}>
              <span className={s.officialLabel}>{linksLabel}</span>
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={s.officialLink}>
                  {l.title}<ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
          {calls?.length > 0 && (
            <div className={s.callRow}>
              {calls.map((c) => (
                <a key={c.number} href={`tel:${c.number.replace(/[^0-9]/g, '')}`} className={s.callChip}>
                  <Phone aria-hidden="true" /><strong>{c.number}</strong><span>{c.label}</span>
                </a>
              ))}
            </div>
          )}
          <p className={s.updated}>{updatedLabel}: {updated}</p>
        </div>
        {/* art: 홈 장소 그림(정지 + 루프 영상 + 밤) — GuideCHeroArt */}
        {art}
      </div>
    </header>
  );
}

// 섹션 바로가기: 화면 위에 붙는 칩 줄 (폰은 옆으로 넘김)
export function GuideCNav({ sections, label }) {
  return (
    <nav className={s.nav} aria-label={label}>
      <ol className={s.navList}>
        {sections.map((sec, i) => (
          <li key={sec.id}>
            <a href={`#${sec.id}`} className={s.navChip}>
              <span className={s.navNo}>{String(i + 1).padStart(2, '0')}</span>{sec.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function GuideCSection({ id, no, title, children }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={s.sectionTitle}>
        <span className={s.sectionNo} aria-hidden="true">{no}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// 짧은 섹션 여러 개를 데스크톱에서 한 줄에 나란히 (예: 도착 1~2일 / 3~7일 / 2~4주). 태블릿·폰은 차례로 쌓인다.
export function GuideCSectionRow({ children }) {
  return <div className={s.sectionRow}>{children}</div>;
}

// 데스크톱 2단 (폰은 1단)
export function Cols({ children }) {
  return <div className={s.cols}>{children}</div>;
}

// 데스크톱 3단 (태블릿·폰은 1단)
export function Cols3({ children }) {
  return <div className={s.cols3}>{children}</div>;
}

export function SubTitle({ children }) {
  return <h3 className={s.subTitle}>{children}</h3>;
}

export function Lead({ children }) {
  return <p className={s.lead}>{children}</p>;
}

// 표·숫자 아래 작은 설명(기준·출처)
export function CFine({ children }) {
  return <p className={s.fine}>{children}</p>;
}

export function CTable({ headers = [], rows = [] }) {
  if (!headers.length || !rows.length) return null;
  return (
    <TableScroll className={s.tableWrap}>
      <table className={s.table} style={{ '--table-min-width': `${Math.max(20, headers.length * 8)}rem` }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const obj = typeof cell === 'object' && cell !== null;
                return <td key={c} data-hl={obj && cell.highlight ? '' : undefined}>{obj ? cell.text : cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  );
}

export function CSteps({ steps = [] }) {
  return (
    <ol className={s.steps}>
      {steps.map((st, i) => (
        <li key={st.title} className={s.step}>
          <span className={s.stepNo} aria-hidden="true">{i + 1}</span>
          <div>
            <p className={s.stepTitle}>{st.title}</p>
            {st.description && <p className={s.stepText}>{st.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CList({ items = [] }) {
  return <ul className={s.list}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

export function CNote({ tone = 'tip', title, children }) {
  const Icon = tone === 'warn' ? TriangleAlert : Lightbulb;
  return (
    <div className={s.note} data-tone={tone} role={tone === 'warn' ? 'note' : undefined}>
      <p className={s.noteTitle}><Icon aria-hidden="true" />{title}</p>
      <div className={s.noteBody}>{children}</div>
    </div>
  );
}

export function CLinks({ links = [] }) {
  return (
    <ul className={s.links}>
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className={s.linkCard}>
            <span className={s.linkText}><strong>{l.title}</strong>{l.description && <span>{l.description}</span>}</span>
            <ArrowUpRight aria-hidden="true" className={s.linkArrow} />
          </a>
        </li>
      ))}
    </ul>
  );
}

// 제목 + 설명 카드 묶음 (링크 아님)
export function CCards({ items = [] }) {
  return (
    <ul className={s.cards}>
      {items.map((it) => (
        <li key={it.title} className={s.cardItem}><strong>{it.title}</strong><span>{it.text}</span></li>
      ))}
    </ul>
  );
}

// 전화 바로 걸기 카드
export function CContacts({ contacts = [] }) {
  return (
    <ul className={s.contacts}>
      {contacts.map((c) => (
        <li key={c.number}>
          <a href={`tel:${c.number}`} className={s.contact}>
            <span className={s.contactLabel}>{c.label}</span>
            <strong className={s.contactNumber}>{c.number}</strong>
            {c.description && <span className={s.contactText}>{c.description}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

// 페이지 아래쪽 묶음 (신고·후원·공유·이전/다음 등 기존 부품을 넣는다)
export function GuideCTail({ children }) {
  return <div className={s.tail}>{children}</div>;
}

// 첫 화면 답: 큰 선택 카드 (예: EPS-TOPIK / TOPIK)
export function ChoiceCards({ cards }) {
  return (
    <div className={s.choices} data-count={cards.length}>
      {cards.map((c) => (
        <article key={c.title} className={s.choice}>
          <p className={s.choiceFor}>{c.for}</p>
          <h3 className={s.choiceTitle}>{c.title}</h3>
          <ul className={s.choiceFacts}>{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          <div className={s.choiceActions}>
            <a href={`#${c.section}`} className={s.choiceMore}>{c.moreLabel}<ArrowDown aria-hidden="true" /></a>
            {c.official && (
              <a href={c.official.href} target="_blank" rel="noopener noreferrer" className={s.choiceOfficial}>
                {c.official.title}<ExternalLink aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
