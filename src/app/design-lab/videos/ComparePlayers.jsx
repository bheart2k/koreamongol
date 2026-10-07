'use client';

// 완료된 영상들을 좌우로 나란히 — 동시 재생·일시정지·처음으로 (같은 시점 비교)
import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import s from './videos.module.css';

export default function ComparePlayers({ items }) {
  const refs = useRef([]);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const vids = () => refs.current.filter(Boolean);

  // 첫 영상 기준으로 시간 표시 + 재생 상태 동기화
  useEffect(() => {
    const list = vids();
    const lead = list[0];
    if (!lead) return undefined;
    // 재생 중 0.15초 넘게 벌어지면 나머지를 첫 영상 시점에 맞춘다 (버퍼링 차이 보정)
    const onTime = () => {
      setTime(lead.currentTime);
      if (lead.paused) return;
      list.slice(1).forEach((v) => {
        if (!v.paused && Math.abs(v.currentTime - lead.currentTime) > 0.15) v.currentTime = lead.currentTime;
      });
    };
    const onState = () => setPlaying(list.some((v) => !v.paused));
    lead.addEventListener('timeupdate', onTime);
    list.forEach((v) => { v.addEventListener('play', onState); v.addEventListener('pause', onState); });
    return () => {
      lead.removeEventListener('timeupdate', onTime);
      list.forEach((v) => { v.removeEventListener('play', onState); v.removeEventListener('pause', onState); });
    };
  }, []);

  // 같은 시점으로 이동이 끝난(seeked) 뒤 함께 시작
  const seekAll = (list, t) => Promise.all(list.map((v) => new Promise((resolve) => {
    if (Math.abs(v.currentTime - t) < 0.01) { resolve(); return; }
    v.addEventListener('seeked', resolve, { once: true });
    v.currentTime = t;
  })));
  const playAll = async () => {
    const list = vids();
    const t = Math.min(...list.map((v) => v.currentTime));
    list.forEach((v) => v.pause());
    await seekAll(list, t);
    await Promise.all(list.map((v) => v.play().catch(() => {})));
  };
  const pauseAll = () => vids().forEach((v) => v.pause());
  const restart = () => {
    const list = vids();
    const wasPlaying = list.some((v) => !v.paused);
    list.forEach((v) => { v.pause(); v.currentTime = 0; });
    setTime(0);
    if (wasPlaying) list.forEach((v) => v.play().catch(() => {}));
  };

  return (
    <div className={s.stage}>
      <div className={s.cols} style={{ '--n': items.length }}>
        {items.map((v, i) => (
          <figure key={v.id} className={s.col}>
            <figcaption className={s.colHead}>
              <span className={s.colNo}>{i + 1}</span>
              <span>{v.label}</span>
            </figcaption>
            <video
              ref={(el) => { refs.current[i] = el; }}
              className={s.video}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              poster={v.poster ?? undefined}
            >
              <source src={v.src} type="video/mp4" />
            </video>
          </figure>
        ))}
      </div>

      <div className={s.controls} role="group" aria-label="영상 함께 조작">
        <button type="button" className={s.btn} onClick={playAll} aria-pressed={playing}>
          <Play aria-hidden="true" />동시 재생
        </button>
        <button type="button" className={s.btn} onClick={pauseAll}>
          <Pause aria-hidden="true" />일시정지
        </button>
        <button type="button" className={s.btn} onClick={restart}>
          <RotateCcw aria-hidden="true" />처음으로
        </button>
        <span className={s.time} aria-live="off">{time.toFixed(1)}초</span>
      </div>
    </div>
  );
}
