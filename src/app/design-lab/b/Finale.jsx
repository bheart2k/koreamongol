// 마무리: 한 탁자 위 두 그릇(시네마그래프) + 05 커뮤니티 · 06 후원
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import LoopVideo from './LoopVideo';
import p from './plates.module.css';

export default function Finale({ media, community, donate }) {
  return (
    <section className={p.finale} aria-labelledby="b-community">
      <div className={p.finaleMedia} data-reveal="wipe">
        <div className={p.finaleInner} data-reveal-media="">
          <picture>
            <source media="(max-width: 767px)" srcSet={media.mobile} />
            <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
          </picture>
          <LoopVideo src={media.video} srcMobile={media.videoMobile} className={p.finaleVideo} />
        </div>
        <div className={p.finaleShade} aria-hidden="true" />
      </div>

      <div className={p.finaleText}>
        <div className={p.finaleBlock}>
          <p className={p.secNo}><span>05</span> Хамт олон</p>
          <h2 id="b-community" className={p.finaleTitle} data-reveal="lines">{community.title}</h2>
          <p className={p.finaleDesc}>{community.desc}</p>
          <Link href={community.href} className={p.finaleLink}>
            {community.title}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div className={`${p.finaleBlock} ${p.finaleDonate}`}>
          <p className={p.secNo}><span>06</span> Дэмжлэг</p>
          <p className={p.donateLine}>
            <strong>{donate.strong}</strong> {donate.text}
          </p>
          <Link href={donate.link.href} className={p.donateBtn}>
            {donate.link.label}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
