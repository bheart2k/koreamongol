'use client';

import styles from './floorplan.module.css';

// 전시 안내도 좌표: k0 기준 % → 크롭 영역 기준 %
const toPlan = ([x, y], c) => [((x - c.x0) / (c.x1 - c.x0)) * 100, ((y - c.y0) / (c.y1 - c.y0)) * 100];

// 전시실을 지나는 동안 화면 좌하단에 고정되는 안내도 — 기준 전경 위에 브라스 동선
export default function FloorPlan({ rooms, crop, img, night, active, visible, label, roomLabel }) {
  const pts = rooms.map((r) => toPlan(r.plan, crop));
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const style = {
    '--img-w': `${(100 / (crop.x1 - crop.x0)) * 100}%`,
    '--img-l': `${(-crop.x0 / (crop.x1 - crop.x0)) * 100}%`,
    '--img-t': `${(-crop.y0 / (crop.y1 - crop.y0)) * 100}%`,
    '--ratio': `${((crop.x1 - crop.x0) * 1672) / ((crop.y1 - crop.y0) * 941)}`,
  };
  const cur = active >= 0 ? rooms[active] : null;
  return (
    <div className={styles.plan} data-visible={visible || undefined} aria-hidden="true" style={style}>
      <div className={styles.map}>
        <img src={img} alt="" className={styles.img} loading="lazy" decoding="async" />
        {night && <img src={night} alt="" className={`${styles.img} ${styles.night}`} loading="lazy" decoding="async" />}
        <svg className={styles.route} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={path} pathLength="1" style={{ strokeDashoffset: 1 - (active < 0 ? 0 : active / (rooms.length - 1)) }} />
        </svg>
        {pts.map(([x, y], i) => (
          <span key={rooms[i].id} className={styles.dot} data-on={i === active || undefined}
            data-done={i < active || undefined} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
      <p className={styles.label}>
        <span>{label}</span>
        <strong>{cur ? `${roomLabel} ${cur.no} · ${cur.title}` : ''}</strong>
      </p>
    </div>
  );
}
