'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, X } from 'lucide-react';
import d from './dock.module.css';

// 좌하단 고정 긴급번호 (우하단은 사이트 공통 피드백 버튼 자리)
export default function EmergencyDock({ emergency, guide, toggleLabel }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={d.dock} data-open={open ? '' : undefined}>
      <div id="a-sos-panel" className={d.panel} role="region" aria-label={emergency.ariaLabel} hidden={!open}>
        <ul className={d.list}>
          {emergency.items.map((item, i) => (
            <li key={item.number} style={{ '--i': i }}>
              <a href={`tel:${item.number}`} className={d.call}>
                <span className={d.emoji} aria-hidden="true">{item.emoji}</span>
                <span className={d.label}>{item.label}</span>
                <strong className={d.num}>{item.number}</strong>
              </a>
            </li>
          ))}
        </ul>
        <Link href={guide.href} className={d.guide}>
          {guide.title}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <button
        ref={btnRef}
        type="button"
        className={d.toggle}
        aria-expanded={open}
        aria-controls="a-sos-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={d.pulse} aria-hidden="true" />
        {open ? <X aria-hidden="true" /> : <Phone aria-hidden="true" />}
        <span>{toggleLabel}</span>
        <span className={d.nums} aria-hidden="true">{emergency.items.map((item) => item.number).join(' · ')}</span>
      </button>
    </div>
  );
}
