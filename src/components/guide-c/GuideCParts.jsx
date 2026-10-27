// 세부 가이드 새 틀 (시안 C) — 추가 부품. 서버 컴포넌트만. 체크리스트(클라이언트)는 GuideCCheckList.jsx
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, ExternalLink, Flag, MapPin, Phone } from 'lucide-react';
import p from './guideCParts.module.css';

// 짧은 이름 묶음 (예: 허용 업종)
export function CChips({ items = [] }) {
  return <ul className={p.chips}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

// 큰 숫자 카드 (예: 최저임금)
export function CStats({ items = [], small = false }) {
  return (
    <div className={p.stats} data-count={items.length} data-size={small ? 'sm' : undefined}>
      {items.map((it) => (
        <div key={it.label} className={p.stat}>
          <p className={p.statLabel}>{it.label}</p>
          <p className={p.statValue}>{it.value}</p>
        </div>
      ))}
    </div>
  );
}

// 이름 - 값 줄 목록 (예: 급여 공제)
export function CRows({ rows = [] }) {
  return (
    <ul className={p.rows}>
      {rows.map((r) => (
        <li key={r.name} className={p.row}><strong>{r.name}</strong><span>{r.value}</span></li>
      ))}
    </ul>
  );
}

// 방법 카드: 제목 + 대상 꼬리표 + 설명 (+ 짧은 기능 목록·메모) — href 가 있으면 카드 전체가 링크(internal 이면 같은 창),
// 링크가 여럿이면 href 대신 links 로 작은 링크 버튼을 단다(예: Play Store / Вэбсайт)
export function CMethods({ items = [] }) {
  return (
    <ul className={p.methods} data-count={items.length}>
      {items.map((it) => {
        const body = (
          <>
            <span className={p.methodHead}>
              <strong className={p.methodTitle}>{it.title}</strong>
              {it.href && (it.internal
                ? <ArrowRight aria-hidden="true" className={p.methodArrow} />
                : <ArrowUpRight aria-hidden="true" className={p.methodArrow} />)}
            </span>
            {it.tag && <span className={p.methodTag}>{it.tag}</span>}
            <span className={p.methodText}>{it.text}</span>
            {it.list?.length > 0 && <ul className={p.methodList}>{it.list.map((x) => <li key={x}>{x}</li>)}</ul>}
            {it.note && <span className={p.methodNote}>{it.note}</span>}
            {it.links?.length > 0 && (
              <span className={p.methodLinks}>
                {it.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={p.methodLink}>
                    {l.label}<ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </span>
            )}
          </>
        );
        return (
          <li key={it.title}>
            {!it.href && <div className={p.method}>{body}</div>}
            {it.href && it.internal && <Link href={it.href} className={p.method}>{body}</Link>}
            {it.href && !it.internal && <a href={it.href} target="_blank" rel="noopener noreferrer" className={p.method}>{body}</a>}
          </li>
        );
      })}
    </ul>
  );
}

// 종류 비교 카드: 이름 + 설명 + 좋은 점(+) / 아쉬운 점(−)
export function CTypeCards({ items = [], prosLabel, consLabel }) {
  return (
    <ul className={p.methods} data-count={items.length}>
      {items.map((it) => (
        <li key={it.title} className={p.method}>
          <strong className={p.methodTitle}>{it.title}</strong>
          {it.text && <span className={p.methodText}>{it.text}</span>}
          <span className={p.pcLabel}>{prosLabel}</span>
          <ul className={p.pcList} data-kind="pro">{it.pros.map((x) => <li key={x}>{x}</li>)}</ul>
          <span className={p.pcLabel}>{consLabel}</span>
          <ul className={p.pcList} data-kind="con">{it.cons.map((x) => <li key={x}>{x}</li>)}</ul>
        </li>
      ))}
    </ul>
  );
}

// 위험 신호 카드: 신호 + 이유
export function CFlags({ items = [] }) {
  return (
    <ul className={p.flags}>
      {items.map((it) => (
        <li key={it.title} className={p.flag}>
          <strong><Flag aria-hidden="true" />{it.title}</strong>
          <span>{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

// 전화 카드(자세히): 이름·한국어 이름·번호 버튼·설명·운영시간·몽골어 가능 여부·주소·사이트. dial 이 없으면 번호에서 숫자만 뽑아 건다.
export function CPhoneCards({ items = [] }) {
  return (
    <ul className={p.phones}>
      {items.map((c) => (
        <li key={c.number} className={p.phone} data-important={c.important ? '' : undefined}>
          <div className={p.phoneHead}>
            <p className={p.phoneName}><strong>{c.label}</strong>{c.labelKo && <span>{c.labelKo}</span>}</p>
            <a href={`tel:${c.dial || c.number.replace(/[^0-9]/g, '')}`} className={p.phoneCall}>
              <Phone aria-hidden="true" />{c.number}
            </a>
          </div>
          {c.description && <p className={p.phoneText}>{c.description}</p>}
          {c.dialNote && <p className={p.phoneMeta}>{c.dialNote}</p>}
          {c.hours && <p className={p.phoneMeta}><Clock aria-hidden="true" />{c.hours}</p>}
          {c.mongolian && <p className={p.phoneMongolian}><CheckCircle2 aria-hidden="true" />{c.mongolianHours || 'Монгол хэл боломжтой'}</p>}
          {c.address && <p className={p.phoneMeta}><MapPin aria-hidden="true" />{c.address}</p>}
          {c.url && (
            <a href={c.url} target="_blank" rel="noopener noreferrer" className={p.phoneLink}>
              <ExternalLink aria-hidden="true" />{c.url}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

// 한국어 표현 카드: 한국어 · [발음] · 뜻 · 쓰는 때 (+ 설명)
export function CPhrases({ items = [] }) {
  return (
    <ul className={p.phrases}>
      {items.map((it) => (
        <li key={it.korean} className={p.phrase}>
          <strong className={p.phraseKo} lang="ko">{it.korean}</strong>
          {it.pronunciation && <span className={p.phrasePron}>[{it.pronunciation}]</span>}
          <span className={p.phraseMeaning}>{it.meaning}</span>
          {it.situation && <span className={p.phraseWhen}>{it.situation}</span>}
          {it.description && <span className={p.phraseNote}>{it.description}</span>}
        </li>
      ))}
    </ul>
  );
}
