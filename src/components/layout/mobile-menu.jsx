'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
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
          className="absolute top-full right-0 mt-2 w-64 bg-navy border border-navy-light rounded-xl shadow-xl shadow-black/20"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-3 border-b border-navy-light">
            <span className="font-heading font-bold text-base text-sky">
              Цэс
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-sky/70 hover:bg-navy-light hover:text-sky transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 메뉴 목록 */}
          <nav className="p-2 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item, index) => (
              item.type === 'link' ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="block px-3 py-2.5 text-sm text-sky/70 hover:text-sky hover:bg-navy-light rounded-lg transition-colors"
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

            <div className="my-2 border-t border-navy-light" />

            <p className="px-3 py-1 text-xs text-sky/40">
              Дэлгэрэнгүй
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-sky/70 hover:text-sky hover:bg-navy-light rounded-lg transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4 text-sky/50" />}
                  {getLabel(item)}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuSection({ item, onClose, isFirst }) {
  return (
    <div className={cn(
      "pt-2 mt-2 border-t border-navy-light",
      isFirst && "pt-2 mt-2"
    )}>
      <p className="px-3 py-1 text-xs text-sky/40">
        {getLabel(item)}
      </p>
      {item.children.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onClose}
          className="block px-3 py-2 pl-5 text-sm text-sky/60 hover:text-sky hover:bg-navy-light rounded-lg transition-colors"
        >
          {getLabel(child)}
        </Link>
      ))}
    </div>
  );
}
