import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, TriangleAlert } from 'lucide-react';
import { ARCHIVED_LABEL, BUDGET, METRICS_NOTE } from './lab-meta';
import styles from './lab-index.module.css';

// 전달받은 정밀도 유지: 1MB 미만은 0.37 처럼 둘째 자리, 그 외는 1.25·17.2·7.0 (불필요한 0만 생략)
function fmtMb(value) {
  if (value < 1) return value.toFixed(2);
  const s = String(Number(value.toFixed(2)));
  return s.includes('.') ? s : `${s}.0`;
}

// 실측 MB → 예산 대비 상태. value 가 없으면 '측정 전'
function sizeRow(label, value, budget) {
  if (value == null) return { label, state: 'pending' };
  return {
    label,
    state: value <= budget ? 'ok' : 'over',
    value: `${fmtMb(value)}MB`,
    limit: `/ ${budget}MB`,
    fill: Math.min(value / budget, 1),
  };
}

// Lighthouse 기준: 90+ 양호, 50–89 개선 필요, 50 미만 나쁨
function scoreRow(label, value) {
  if (value == null) return { label, state: 'pending' };
  return {
    label,
    state: value >= 90 ? 'ok' : value >= 50 ? 'warn' : 'over',
    value: String(value),
    limit: '/ 100',
    fill: value / 100,
  };
}

function buildRows(metrics) {
  return [
    sizeRow('첫 화면', metrics?.firstView, BUDGET.firstView),
    sizeRow('전체 · 데스크톱', metrics?.desktop, BUDGET.desktop),
    sizeRow('전체 · 모바일', metrics?.mobile, BUDGET.mobile),
    scoreRow('Lighthouse 모바일', metrics?.lighthouse),
  ];
}

export default function LabCard({ variant, index }) {
  const { id, letter, href, en, name, summary, keywords, pros, risks, cover, metrics, archived } = variant;
  const rows = buildRows(metrics);

  return (
    <article
      className={`${styles.card} ${styles.rise}`}
      style={{ '--i': index + 3 }}
      data-variant={id}
      data-archived={archived ? 'true' : undefined}
    >
      <div className={styles.cover}>
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 368px, (min-width: 720px) 45vw, 100vw"
            className={styles.coverImg}
          />
        ) : (
          <div className={styles.placeholder} data-tone={id}>
            <span className={styles.letter} aria-hidden="true">{letter}</span>
            <span className={styles.pendingPill}>대표 이미지 준비 중</span>
          </div>
        )}
        <span className={styles.badge}>시안 {letter}</span>
        {archived && <span className={styles.archivedBadge}>{ARCHIVED_LABEL}</span>}
        {/* 표지 전체를 누르는 중복 링크 — 키보드·스크린리더는 아래 CTA 를 쓴다 */}
        <Link href={href} className={styles.coverLink} tabIndex={-1} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <p className={styles.en}>{en}</p>
        <h2 className={styles.name}>「{name}」</h2>
        <p className={styles.summary}>{summary}</p>

        <ul className={styles.keywords} aria-label="키워드">
          {keywords.map((k) => <li key={k}>{k}</li>)}
        </ul>

        <div className={styles.split}>
          <section aria-labelledby={`${id}-pros`}>
            <h3 id={`${id}-pros`} className={styles.listHead}>강점</h3>
            <ul className={styles.list} data-kind="pros">
              {pros.map((t) => (
                <li key={t}><Check aria-hidden="true" strokeWidth={2.4} /><span>{t}</span></li>
              ))}
            </ul>
          </section>
          <section aria-labelledby={`${id}-risks`}>
            <h3 id={`${id}-risks`} className={styles.listHead}>리스크</h3>
            <ul className={styles.list} data-kind="risks">
              {risks.map((t) => (
                <li key={t}><TriangleAlert aria-hidden="true" strokeWidth={2.2} /><span>{t}</span></li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.metrics} aria-labelledby={`${id}-metrics`}>
          <div className={styles.metricsHead}>
            <h3 id={`${id}-metrics`} className={styles.listHead}>실측</h3>
            <span>{METRICS_NOTE}</span>
          </div>
          <dl>
            {rows.map((r) => (
              <div key={r.label} className={styles.metric} data-state={r.state}>
                <dt>{r.label}</dt>
                <dd>
                  <span className={styles.bar} aria-hidden="true"><i style={{ '--fill': r.fill ?? 0 }} /></span>
                  <span className={styles.val}>
                    {r.state === 'pending' ? (
                      <span className={styles.pendingText}>측정 전</span>
                    ) : (
                      <><strong>{r.value}</strong> <small>{r.limit}</small></>
                    )}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Link href={href} className={styles.cta}>
          시안 {letter} 열기<ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
