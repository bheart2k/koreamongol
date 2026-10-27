'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import s from './guideCParts.module.css';

// 체크리스트 — 예전 CheckList 와 같은 저장 키(guide-check-<storageKey>)를 써서 개편 전에 체크한 상태가 이어진다
export default function GuideCCheckList({ items = [], storageKey }) {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`guide-check-${storageKey}`);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    if (!storageKey) return;
    try {
      localStorage.setItem(`guide-check-${storageKey}`, JSON.stringify(next));
    } catch {}
  };

  if (!items.length) return null;
  const done = items.filter((it) => checked[it.id]).length;

  return (
    <div className={s.check}>
      <div className={s.checkHead}>
        <span aria-live="polite">{done}/{items.length} бэлэн</span>
        <span className={s.checkBar} aria-hidden="true">
          <span style={{ width: `${(done / items.length) * 100}%` }} />
        </span>
      </div>
      <ul className={s.checkList}>
        {items.map((it) => {
          const on = !!checked[it.id];
          return (
            <li key={it.id}>
              <button type="button" className={s.checkItem} aria-pressed={on} onClick={() => toggle(it.id)}>
                <span className={s.checkBox} aria-hidden="true">{on && <Check />}</span>
                <span className={s.checkText}>
                  <strong>{it.label}</strong>
                  {it.sub && <span>{it.sub}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
