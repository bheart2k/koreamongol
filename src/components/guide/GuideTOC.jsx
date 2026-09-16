'use client';

import { useState, useEffect, useId } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GuideTOC({ sections = [], className }) {
  const [activeId, setActiveId] = useState('');
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const listId = useId();
  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

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
    document.dispatchEvent(new CustomEvent('guide:reveal', { detail: id }));
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) return null;

  return (
    <nav aria-label="Агуулга"
      className={cn(
        'mt-6 p-4 rounded-lg bg-white/50 dark:bg-navy-light/20 border border-border/50',
        className
      )}
    >
      {mobile ? (
        <button type="button" className="flex items-center gap-2 w-full text-left text-sm font-semibold text-foreground"
          aria-expanded={open} aria-controls={listId} onClick={() => setOpen((value) => !value)}>
          <List className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Агуулга</span>
          <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      ) : (
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
          <List className="w-4 h-4" aria-hidden="true" /><span>Агуулга</span>
        </div>
      )}
      <div id={listId} hidden={mobile && !open}>
      <ul className={cn('space-y-1.5', mobile && 'mt-3')}>
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
      </div>
    </nav>
  );
}
