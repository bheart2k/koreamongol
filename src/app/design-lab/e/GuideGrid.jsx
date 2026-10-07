import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import g from './grid.module.css';

// 가이드 14개 전체 — 검색하듯 훑을 수 있는 밀도 높은 그리드 + 긴급번호 띠 (서버 컴포넌트)
export default function GuideGrid({ section, guides, emergency, emergencyGuide }) {
  return (
    <section id={section.id} className={g.section} aria-labelledby="e-guides-title">
      <div className={g.skyMark} data-sky-stop="day" data-sky-at="early" aria-hidden="true" />
      <div className={g.wrap}>
        <header className={g.head}>
          <h2 id="e-guides-title" className={g.label}>{section.title}</h2>
          <p className={g.sub}>{section.subtitle}</p>
        </header>

        <ul className={g.grid}>
          {guides.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <li key={guide.id} style={{ '--i': i }}>
                <Link href={guide.href} className={g.tile}>
                  <span className={g.icon} aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                  <span className={g.text}>
                    <span className={g.title}>{guide.title}</span>
                    <span className={g.desc}>{guide.desc}</span>
                  </span>
                  <ArrowUpRight className={g.arrow} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={g.sos} role="group" aria-label={emergency.ariaLabel}>
          <ul className={g.sosNums}>
            {emergency.items.map((e) => (
              <li key={e.number}>
                <a href={`tel:${e.number}`} className={g.sosNum}>
                  <span aria-hidden="true">{e.emoji}</span>
                  <span>{e.label}</span>
                  <strong>{e.number}</strong>
                </a>
              </li>
            ))}
          </ul>
          <Link href={emergencyGuide.href} className={g.sosGuide}>
            <span>{emergencyGuide.title}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
