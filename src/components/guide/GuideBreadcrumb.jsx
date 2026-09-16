'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { navItems } from '@/components/layout/nav-items';
import styles from './GuideBreadcrumb.module.css';

export function GuideBreadcrumb({ label }) {
  const pathname = usePathname();
  const ref = useRef(null);
  const group = navItems.find((item) => item.children?.some((child) => child.href === pathname));
  const support = [{ href: '/tips', label: 'Түргэн хариулт' }, { href: '/faq', label: 'Түгээмэл асуулт' }];
  const siblings = group?.children || (support.some((item) => item.href === pathname) ? support : navItems.filter((item) => item.type === 'link'));

  const closePickers = () => {
    ref.current?.querySelectorAll('details[data-picker]').forEach((picker) => { picker.open = false; });
  };
  const selectPicker = (event) => {
    const selected = event.currentTarget.parentElement;
    ref.current?.querySelectorAll('details[data-picker]').forEach((picker) => {
      if (picker !== selected) picker.open = false;
    });
  };

  useEffect(() => {
    const outside = (event) => {
      ref.current?.querySelectorAll('details[data-picker][open]').forEach((picker) => {
        if (!picker.contains(event.target)) picker.open = false;
      });
    };
    const escape = (event) => {
      const picker = ref.current?.querySelector('details[data-picker][open]');
      if (event.key === 'Escape' && picker) {
        picker.open = false;
        picker.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('keydown', escape); };
  }, []);

  return (
    <nav ref={ref} key={pathname} className={styles.breadcrumb} aria-label="Хуудасны зам">
      <Link href="/" aria-label="Нүүр" className={styles.home}><Home aria-hidden="true" /></Link>
      <ChevronRight className={styles.separator} aria-hidden="true" />
      {group && <>
        <details data-picker="" className={styles.picker}>
          <summary onClick={selectPicker}><span>{group.label}</span><ChevronDown aria-hidden="true" /></summary>
          <NavigationOptions items={navItems} pathname={pathname} onNavigate={closePickers} />
        </details>
        <ChevronRight className={styles.separator} aria-hidden="true" />
      </>}
      <details data-picker="" className={styles.picker}>
        <summary onClick={selectPicker}><span aria-current="page">{label}</span><ChevronDown aria-hidden="true" /></summary>
        <NavigationOptions items={group ? siblings : (support.some((item) => item.href === pathname) ? support : navItems)}
          pathname={pathname} onNavigate={closePickers} />
      </details>
    </nav>
  );
}

function NavigationOptions({ items, pathname, onNavigate }) {
  const link = (item) => (
    <Link key={item.href} href={item.href} aria-current={item.href === pathname ? 'page' : undefined} onClick={onNavigate}>
      <span>{item.label}</span>{item.href === pathname && <Check aria-hidden="true" />}
    </Link>
  );
  return <div className={styles.options}>
    {items.map((item) => item.children ? (
      <details key={item.label} className={styles.branch}>
        <summary data-active={item.children.some((child) => child.href === pathname) || undefined}>
          <span>{item.label}</span><ChevronDown aria-hidden="true" />
        </summary>
        <div className={styles.children}>{item.children.map(link)}</div>
      </details>
    ) : link(item))}
  </div>;
}
