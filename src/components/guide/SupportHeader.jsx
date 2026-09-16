import { GuideBreadcrumb } from '@/components/guide/GuideBreadcrumb';
import Image from 'next/image';
import styles from './SupportPages.module.css';

export function SupportHeader({ title, subtitle, image }) {
  return <header className={styles.hero}>
    <GuideBreadcrumb label={title} />
    <div className={styles.intro}>
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      <Image src={image} alt="" width={1024} height={1536} sizes="(max-width: 639px) 110px, 180px" className={styles.mascot} />
    </div>
  </header>;
}
