'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CheckList({ items = [], storageKey, className }) {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`guide-check-${storageKey}`);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    if (storageKey) {
      try {
        localStorage.setItem(`guide-check-${storageKey}`, JSON.stringify(next));
      } catch {}
    }
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = items.length;

  if (total === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{checkedCount}/{total} бэлэн</span>
        <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (checkedCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex items-start gap-3 w-full text-left p-3 rounded-lg border transition-colors',
                  isChecked
                    ? 'bg-sky/30 dark:bg-navy-light/30 border-gold/30'
                    : 'bg-card border-border hover:border-gold/20'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isChecked
                      ? 'bg-gold border-gold text-white'
                      : 'border-muted-foreground/40'
                  )}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isChecked && 'line-through text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                  {item.sub && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
