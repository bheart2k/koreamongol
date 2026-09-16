'use client';

import styles from './header.module.css';
import { useEffect, useRef, useState, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, MessageSquareHeart, ChevronDown, ArrowUpRight, FileText, House } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { navItems, secondaryNavItems, getLabel } from './nav-items';

const matches = (path, href) => path === href || path.startsWith(`${href}/`);

export function MobileMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const outside = (event) => {
      if (event.target.closest('[aria-controls="header-menu"]')) return;
      if (!menuRef.current?.contains(event.target)) onClose();
    };
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      onClose();
      document.querySelector('[aria-controls="header-menu"]')?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div ref={menuRef} id="header-menu" className={styles.mobilePanel}
          initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}>
          <div className={styles.panelHeading}>
            <span className="font-heading font-semibold text-base">Цэс</span>
            <button type="button" className={styles.closeButton} aria-label="Цэс хаах"
              onClick={() => { onClose(); document.querySelector('[aria-controls="header-menu"]')?.focus(); }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className={styles.mobileNav} aria-label="Үндсэн цэс">
            {navItems.map((item) => item.type === 'link' ? (
              <MenuLink key={item.href} item={item} pathname={pathname} onClose={onClose} />
            ) : (
              <MenuSection key={`${pathname}-${item.label}`} item={item} pathname={pathname} onClose={onClose} />
            ))}
            <div className={styles.divider} />
            <p className={styles.sectionLabel}>Дэлгэрэнгүй</p>
            {secondaryNavItems.map((item) => (
              <MenuLink key={item.href} item={item} pathname={pathname} onClose={onClose} />
            ))}
            <Link href="/feedback" onClick={onClose} className={styles.feedbackLink}
              aria-current={matches(pathname, '/feedback') ? 'page' : undefined}>
              <MessageSquareHeart className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Санал хүсэлт үлдээх</span>
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuLink({ item, pathname, onClose, child = false }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClose}
      className={cn(styles.mobileLink, child ? styles.childLink : styles.parentLink)}
      aria-current={matches(pathname, item.href) ? 'page' : undefined}>
      <span className={child ? styles.childIcon : styles.parentIcon}><Icon aria-hidden="true" /></span>
      <span className={styles.menuText}>{getLabel(item)}</span>
      {!child && <ArrowUpRight className={styles.menuArrow} aria-hidden="true" />}
    </Link>
  );
}

function MenuSection({ item, pathname, onClose }) {
  const active = item.children.some((child) => matches(pathname, child.href));
  const [open, setOpen] = useState(active);
  const id = useId();
  const Icon = item.children[0].href === '/visa' ? FileText : House;
  return (
    <div className={styles.menuSection}>
      <button type="button" className={cn(styles.mobileLink, styles.parentLink)}
        data-active={active || undefined} aria-expanded={open} aria-controls={id}
        onClick={() => setOpen((value) => !value)}>
        <span className={styles.parentIcon}><Icon aria-hidden="true" /></span>
        <span className={styles.menuText}>{getLabel(item)}</span>
        <ChevronDown className={cn(styles.menuArrow, open && styles.menuArrowOpen)} aria-hidden="true" />
      </button>
      <div id={id} className={styles.submenu} data-open={open || undefined}
        inert={!open ? true : undefined} aria-hidden={!open || undefined}>
        <div className={styles.submenuClip}>
          <div className={styles.submenuLinks}>
            {item.children.map((child) => (
              <MenuLink key={child.href} item={child} pathname={pathname} onClose={onClose} child />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
