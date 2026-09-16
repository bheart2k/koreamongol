'use client';

import { useState, useEffect, useCallback } from 'react';
import { Share2, Facebook, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics-events';

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareToFacebook = useCallback(() => {
    if (!url) return;
    analytics.shareFacebook(new URL(url).pathname);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400,scrollbars=yes');
  }, [url]);

  const copyLink = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      analytics.shareCopyLink(new URL(url).pathname);
      setCopied(true);
      toast.success('Линк хуулагдлаа');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Линк хуулж чадсангүй');
    }
  }, [url]);

  return (
    <div className="py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-navy dark:text-sky shrink-0" />
          <p className="text-xs text-muted-foreground">
            Найзууддаа хуваалцаарай
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={shareToFacebook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-11 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-navy-light/40 dark:hover:border-sky/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            aria-label="Facebook-д хуваалцах"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </button>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-11 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-navy-light/40 dark:hover:border-sky/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            aria-label="Линк хуулах"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Link2 className="w-3.5 h-3.5" />
            )}
            {copied ? 'Хуулсан' : 'Линк'}
          </button>
        </div>
      </div>
    </div>
  );
}
