// 딥틱 플레이트 (Pl. I–IV) — 몽골·한국 짝 사진. 서버 컴포넌트, 루프 영상만 클라이언트.
import LoopVideo from './LoopVideo';
import p from './plates.module.css';

function Figure({ side, item, label, className, delay }) {
  return (
    <figure className={`${p.fig} ${className}`}>
      <div className={p.frame} data-reveal="wipe" data-delay={delay}>
        <div className={p.media} data-reveal-media="" data-parallax={side === 'kr' ? '-8' : '6'}>
          <img
            src={item.src}
            srcSet={`${item.sm} 640w, ${item.src} 1122w`}
            sizes="(max-width: 767px) 46vw, 48vw"
            alt={item.alt}
            loading="lazy"
            decoding="async"
          />
          {item.video && <LoopVideo src={item.video} className={p.video} />}
        </div>
      </div>
      <figcaption className={p.cap}>
        <span className={p.capSide}>{label}</span>
        <span className={p.capWord}>
          {item.hangul && <span lang="ko" className={p.hangul}>{item.hangul}</span>}
          {item.word}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Plate({ plate, variant = 'a', children }) {
  return (
    <section className={`${p.plate} ${p[variant]}`} aria-label={`${plate.mn.word} — ${plate.kr.word}`}>
      <div className={p.inner}>
        <header className={p.head}>
          <span className={p.pl}>Pl. {plate.numeral}</span>
          <span className={p.headRule} data-reveal="rule" aria-hidden="true" />
          <span className={p.headPair}>Монгол <i>×</i> Солонгос</span>
        </header>

        <p className={p.words} aria-hidden="true">
          <span className={p.wordMn} data-reveal="lines">{plate.mn.word}</span>
          <span className={p.wordKr} data-reveal="lines" data-delay="0.12">{plate.kr.word}</span>
        </p>

        <div className={p.grid}>
          <Figure side="mn" item={plate.mn} label="Монгол" className={p.figMn} delay="0" />
          <Figure side="kr" item={plate.kr} label="Солонгос" className={p.figKr} delay="0.15" />
        </div>

        {children}
      </div>
    </section>
  );
}
