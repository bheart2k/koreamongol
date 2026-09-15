import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight, ArrowUpRight } from 'lucide-react';
import { GuideTOC } from '@/components/guide/GuideTOC';
import styles from './IllustratedGuide.module.css';

export function IllustratedGuideHeader({ meta, sections, quickIds, image, icon: Icon, breadcrumbLabel }) {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <nav aria-label="breadcrumb" className={styles.breadcrumb}>
          <Link href="/" aria-label="Нүүр"><Home /></Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{breadcrumbLabel}</span>
        </nav>
        <div className={styles.welcome}>
          <div>
            <span className={styles.emblem}><Icon aria-hidden="true" /></span>
            <h1>{meta.title}</h1>
            <p className={styles.subtitle}>{meta.subtitle}</p>
            <p className={styles.updated}>Сүүлд шинэчилсэн: {meta.lastUpdated}</p>
          </div>
          <Image src={image} alt="" width={1024} height={1536} sizes="(max-width: 639px) 140px, 260px" className={styles.mascot} />
        </div>
        <div className={styles.quickLinks}>
          {quickIds.map((id, index) => {
            const section = sections.find((item) => item.id === id);
            return <a key={id} href={`#${id}`}><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><span>{section.title}</span><ArrowUpRight aria-hidden="true" /></a>;
          })}
        </div>
      </div>
    </header>
  );
}

export function IllustratedGuideBody({ sections, children }) {
  return <div className={styles.layout}>
    <aside className={styles.sidebar}><GuideTOC sections={sections} className={styles.toc} /></aside>
    <div className={styles.content}>{children}</div>
  </div>;
}
