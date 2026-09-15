import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import styles from './SupportPages.module.css';

export function SupportHeader({ title, subtitle, image, icon: Icon }) {
  return <header className={styles.hero}>
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <Link href="/" aria-label="Нүүр"><Home /></Link><ChevronRight aria-hidden="true" /><span aria-current="page">{title}</span>
    </nav>
    <div className={styles.intro}>
      <div><span className={styles.emblem}><Icon aria-hidden="true" /></span><h1>{title}</h1><p>{subtitle}</p></div>
      <Image src={image} alt="" width={1024} height={1536} sizes="(max-width: 639px) 110px, 180px" className={styles.mascot} />
    </div>
  </header>;
}
