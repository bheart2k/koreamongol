// /design-lab/videos — 젠스파크 생성 영상 나란히 비교 (서버 컴포넌트, 플레이어만 클라이언트)
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { videos, METHOD_LABEL, commonUserNote } from './videos';
import ComparePlayers from './ComparePlayers';
import lab from '../_shared/lab-index.module.css';
import s from './videos.module.css';

export const metadata = {
  title: '생성 영상 비교 — Design Lab',
  description: '젠스파크로 생성한 영상을 나란히 비교 (내부용)',
};

const n = (x) => x.toLocaleString('en-US');
const mb = (b) => `${(b / 1e6).toFixed(2)}MB`;

// 비교표 행: [항목, 값 렌더러] — 렌더러가 'COMMON' 이면 두 열에 걸친 공통 행
const ROWS = [
  ['장면', (v) => v.scene],
  ['모델', (v) => v.model],
  ['설정', (v) => v.settings],
  ['생성 방식', (v) => METHOD_LABEL[v.method]],
  ['해상도·fps·길이', (v) => v.output],
  ['오디오', (v) => v.audio],
  ['원본 용량', (v) => v.bytes && <>{mb(v.bytes.original)} <span className={s.sub}>({n(v.bytes.original)} B)</span></>],
  ['웹 용량', (v) => v.bytes && (
    <>{mb(v.bytes.web)} <span className={s.sub}>({n(v.bytes.web)} B · 원본의 {Math.round((v.bytes.web / v.bytes.original) * 100)}%)</span></>
  )],
  ['크레딧', (v) => v.credits && (
    <>표시 ≈{n(v.credits.estimate)} · 실제 <strong>{n(v.credits.actual)}</strong> <span className={s.sub}>(잔액 {n(v.credits.before)} → {n(v.credits.after)})</span></>
  )],
  ['소요 시간', (v) => v.elapsed],
  ['시작·끝 프레임 일치도', (v) => v.frameMatch && (
    <>시작 {v.frameMatch.start} · 끝 {v.frameMatch.end} <span className={s.sub}>(반대 이미지와는 약 {v.frameMatch.opposite})</span></>
  )],
  ['사용자 소견 · 공통', 'COMMON'],
  ['사용자 소견', (v) => v.userNote],
  ['검수 메모', (v) => v.reviewNotes?.length > 0 && <ul className={s.notes}>{v.reviewNotes.map((x) => <li key={x}>{x}</li>)}</ul>],
  ['젠스파크 대화', (v) => v.genspark && (
    <a className={s.ext} href={v.genspark} target="_blank" rel="noopener noreferrer">열기<ArrowUpRight aria-hidden="true" /></a>
  )],
];

export default function DesignLabVideos() {
  const done = videos.filter((v) => v.status === 'done');
  const waiting = videos.filter((v) => v.status !== 'done');
  // 클라이언트 플레이어에는 필요한 값만
  const players = done.map(({ id, label, src, poster }) => ({ id, label, src, poster }));

  return (
    <main className={`${lab.lab} min-h-content`}>
      <div className={lab.container}>
        <header className={`${lab.masthead} ${s.masthead}`}>
          <Link href="/design-lab" className={s.back}><ArrowLeft aria-hidden="true" />시안 비교로</Link>
          <p className={`${lab.kicker} ${lab.rise}`}>KoreaMongol · Design Lab</p>
          <h1 className={lab.title}>
            <span className={lab.line}><span style={{ '--d': 0 }}>생성 영상</span></span>{' '}
            <span className={lab.line}><span style={{ '--d': 140 }}><em>{done.length}편 비교</em></span></span>
          </h1>
          <p className={`${lab.sub} ${lab.rise}`} style={{ '--i': 2 }}>
            젠스파크로 만든 영상을 나란히 놓았습니다. ‘동시 재생’으로 같은 시점을 비교하고, 아래 표에서 항목별로 대조하세요.
          </p>
        </header>

        <section className={s.compare} aria-label="영상 나란히 비교">
          <ComparePlayers items={players} />

          <div className={s.cols} style={{ '--n': done.length }}>
            {done.map((v) => (
              <div key={v.id} className={s.inputs}>
                <p className={s.inputsLabel}>입력 프레임</p>
                <div className={s.frames}>
                  {[['시작', v.start], ['끝', v.end]].map(([label, src]) => (
                    <figure key={label} className={s.frame}>
                      <img src={src} alt={`${v.label} — 입력 ${label} 프레임`} loading="lazy" />
                      <figcaption>{label}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={s.tableWrap} aria-labelledby="cmp-title">
          <h2 id="cmp-title" className={s.tableTitle}>항목별 비교</h2>
          <table className={s.table} style={{ '--n': done.length }}>
            <thead>
              <tr>
                <th scope="col" className={s.corner}>항목</th>
                {done.map((v, i) => (
                  <th key={v.id} scope="col"><span className={s.colNo}>{i + 1}</span>{v.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, render]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {render === 'COMMON' ? (
                    <td colSpan={done.length} className={s.span}>{commonUserNote}</td>
                  ) : (
                    done.map((v) => <td key={v.id}>{render(v) || <span className={s.sub}>—</span>}</td>)
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.note}>
            프레임 일치도 = 영상의 첫·끝 프레임과 입력 이미지의 평균 절대 픽셀 차(0–255, 낮을수록 일치). 용량은 실제 파일 크기(stat) 실측.
            크레딧 실제값은 생성 전후 잔액 차이입니다(이날 생성은 이 2건뿐).
          </p>
        </section>

        {waiting.length > 0 && (
          <section className={s.waiting} aria-label="생성 중">
            {waiting.map((v) => <p key={v.id}><strong>{v.status === 'failed' ? '실패' : '생성 중'}</strong> · {v.title}</p>)}
          </section>
        )}

        <p className={s.foot}>검색 엔진에 노출되지 않는 내부 페이지입니다. 웹용 영상은 소리가 없습니다.</p>
      </div>
    </main>
  );
}
