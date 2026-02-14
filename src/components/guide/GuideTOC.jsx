'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GuideTOC({ sections = [], className }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) return null;

  return (
    <nav
      className={cn(
        'mt-6 p-4 rounded-lg bg-white/50 dark:bg-navy-light/20 border border-border/50',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold font-heading text-navy dark:text-sky">
        <List className="w-4 h-4" />
        <span>Агуулга</span>
      </div>
      <ul className="space-y-1.5">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => scrollTo(id)}
              className={cn(
                'text-sm text-left w-full px-3 py-1.5 rounded-md transition-colors',
                activeId === id
                  ? 'bg-gold/10 text-gold-dark font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
