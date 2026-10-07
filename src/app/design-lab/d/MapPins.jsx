'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { GuideIcon } from './icons';
import styles from './pins.module.css';
import pc from './pinCard.module.css';

// 핀 카드 안의 가이드 링크 목록 (데스크톱 팝업·모바일 시트 공용)
function GuideLinks({ place, guideMap }) {
  return (
    <ul className={pc.cardList}>
      {place.guides.map((id) => {
        const g = guideMap[id];
        if (!g) return null;
        return (
          <li key={id}>
            <Link href={g.href} className={pc.cardLink}>
              <span className={pc.cardIcon}><GuideIcon name={g.iconName} strokeWidth={1.6} /></span>
              <span className={pc.cardText}>
                <strong>{g.title}</strong>
                <span>{g.desc}</span>
              </span>
              <ArrowUpRight className={pc.cardArrow} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// 지도 위 핀 — 좌표는 cover 박스 기준 % (데스크톱 d / 세로 화면 m 은 CSS 미디어쿼리로 선택)
export function Pins({ places, guideMap, active, setActive, portrait, inert }) {
  const closeTimer = useRef(0);
  const locked = useRef(false);

  const open = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setActive(id);
  }, [setActive]);

  const scheduleClose = useCallback(() => {
    if (locked.current) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 260);
  }, [setActive]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => { if (!active) locked.current = false; }, [active]);

  return (
    <div className={styles.pins} inert={inert || undefined}>
      {places.map((p, i) => {
        const isActive = active === p.id;
        // 카드는 핀 머리 아래(위쪽 핀) 또는 라벨 위(아래쪽 핀)에 가운데 정렬 — 라벨을 가리지 않는다
        const vert = p.d[1] < 50 ? 'below' : 'above';
        return (
          <div
            key={p.id}
            data-pin=""
            className={styles.pin}
            data-active={isActive || undefined}
            data-vert={vert}
            style={{ '--dx': p.d[0], '--dy': p.d[1], '--mx': p.m[0], '--my': p.m[1], '--i': i }}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !portrait) open(p.id); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !portrait) scheduleClose(); }}
          >
            <button
              type="button"
              className={styles.pinBtn}
              aria-expanded={isActive}
              aria-controls={portrait ? 'd-pin-sheet' : `d-pin-card-${p.id}`}
              onClick={() => {
                if (isActive && locked.current) { locked.current = false; setActive(null); return; }
                locked.current = true;
                open(p.id);
              }}
              onFocus={() => { if (!portrait) open(p.id); }}
            >
              <span className={styles.label}>
                <span className={styles.labelNo} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {p.name}
              </span>
              <span className={styles.stem} data-pin-stem="" aria-hidden="true" />
              <span className={styles.head} aria-hidden="true"><span /></span>
            </button>
            {!portrait && isActive && (
              <div id={`d-pin-card-${p.id}`} className={pc.card} role="group" aria-label={p.name}>
                <p className={pc.cardKicker}>{p.name}</p>
                <GuideLinks place={p} guideMap={guideMap} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 세로 화면: 핀을 탭하면 하단 시트 (피드백 버튼 위로 띄움)
export function PinSheet({ places, guideMap, active, setActive, closeLabel }) {
  const place = places.find((p) => p.id === active);
  return (
    <div id="d-pin-sheet" className={pc.sheet} data-open={place ? '' : undefined} aria-live="polite">
      {place && (
        <div className={pc.sheetInner} role="group" aria-label={place.name}>
          <div className={pc.sheetHead}>
            <p className={pc.cardKicker}>{place.name}</p>
            <button type="button" className={pc.sheetClose} onClick={() => setActive(null)} aria-label={closeLabel}>
              <X aria-hidden="true" />
            </button>
          </div>
          <GuideLinks place={place} guideMap={guideMap} />
        </div>
      )}
    </div>
  );
}

// 장소 칩 목록 — 키보드·스크린리더용 지도 범례 겸 빠른 이동
export function PlaceChips({ places, active, setActive, label }) {
  return (
    <ul className={pc.chips} aria-label={label}>
      {places.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className={pc.chip}
            data-active={active === p.id || undefined}
            aria-pressed={active === p.id}
            onClick={() => setActive(active === p.id ? null : p.id)}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(p.id); }}
          >
            {p.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
