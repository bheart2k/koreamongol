'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { searchIndex } from '@/lib/search-index';

export function SearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'keywords', weight: 1.5 },
          { name: 'category', weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    []
  );

  const results = useMemo(
    () => (query.trim() ? fuse.search(query.trim()).slice(0, 10) : []),
    [fuse, query]
  );

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const go = (href) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 top-[20%] translate-y-0">
        <DialogTitle className="sr-only">Хайлт</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) go(results[0].item.href);
            }}
            placeholder="Хайх... (виз, цалин, банк, 알바)"
            className="w-full h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              Гарын авлага, FAQ, хэрэгслээс хайна
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Илэрц олдсонгүй
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map(({ item }) => (
                <li key={item.href + item.title}>
                  <button
                    onClick={() => go(item.href)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-accent/5 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                      {item.category}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
