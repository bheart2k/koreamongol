'use client';

import styles from './header.module.css';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, MessageSquareHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { navItems, secondaryNavItems, getLabel } from './nav-items';

/**
 * MobileMenu - 드롭다운 메뉴 (데스크톱/모바일 공용)
 */
export function MobileMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.closest('button')?.querySelector('.lucide-menu')) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          id="header-menu" className={styles.mobilePanel}
        >
          {/* 헤더 */}
          <div className={styles.panelHeading}>
            <span className="font-heading font-semibold text-base">
              Цэс
            </span>
            <button
              onClick={onClose}
              className={styles.closeButton} aria-label="Цэс хаах"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 메뉴 목록 */}
          <nav className={styles.mobileNav}>
            {navItems.map((item, index) => (
              item.type === 'link' ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={styles.mobileLink}
                >
                  {getLabel(item)}
                </Link>
              ) : (
                <MenuSection
                  key={item.label}
                  item={item}
                  onClose={onClose}
                  isFirst={index === navItems.findIndex(i => i.type === 'dropdown')}
                />
              )
            ))}

            <div className={styles.divider} />

            <p className={styles.sectionLabel}>
              Дэлгэрэнгүй
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={styles.mobileLink}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {getLabel(item)}
                </Link>
              );
            })}

            {/* 피드백 CTA — 눈에 띄게 강조 */}
            <Link
              href="/feedback"
              onClick={onClose}
              className={styles.feedbackLink}
            >
              <MessageSquareHeart className="w-4 h-4" />
              Санал хүсэлт үлдээх
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuSection({ item, onClose, isFirst }) {
  return (
    <div className={cn(
      styles.menuSection,
      isFirst && "pt-2 mt-2"
    )}>
      <p className={styles.sectionLabel}>
        {getLabel(item)}
      </p>
      {item.children.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onClose}
          className={styles.mobileLink}
        >
          {getLabel(child)}
        </Link>
      ))}
    </div>
  );
}
