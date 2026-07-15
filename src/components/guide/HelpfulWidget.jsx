'use client';

import { useEffect, useState } from 'react';
import { Eye, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics-events';

// "도움됐어요" 위젯 — 조회 기록(세션당 1회) + 👍 집계 (analytics_events 재사용)
export function HelpfulWidget({ path }) {
  const [stats, setStats] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const viewKey = `km_tip_view:${path}`;
    if (!sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, '1');
      trackEvent('tip_view', { category: 'guide', label: path });
    }
    setVoted(!!localStorage.getItem(`km_tip_helpful:${path}`));

    fetch(`/api/analytics/page-stats?path=${encodeURIComponent(path)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(() => {});
  }, [path]);

  const handleHelpful = () => {
    if (voted) return;
    localStorage.setItem(`km_tip_helpful:${path}`, '1');
    setVoted(true);
    setStats((s) => (s ? { ...s, helpful: s.helpful + 1 } : s));
    trackEvent('tip_helpful', { category: 'guide', label: path });
    toast.success('Баярлалаа! Таны санал бидэнд тусална.');
  };

  return (
    <div className="p-5 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-foreground">
          Энэ мэдээлэл тусалсан уу?
        </p>
        {stats?.views > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            {stats.views.toLocaleString('en-US')}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={handleHelpful}
        disabled={voted}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          voted
            ? 'border-gold/60 bg-gold/10 text-gold-dark cursor-default'
            : 'border-border bg-card text-foreground hover:border-gold/50 hover:bg-gold/5'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        {voted ? 'Тусалсан' : 'Тийм, тусалсан'}
        {stats?.helpful > 0 && (
          <span className="text-xs text-muted-foreground">
            {stats.helpful.toLocaleString('en-US')}
          </span>
        )}
      </button>
    </div>
  );
}
