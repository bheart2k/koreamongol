'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Loader2, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORY_TABS = [
  { value: '', label: '전체' },
  { value: 'opinion', label: '의견' },
  { value: 'bug', label: '버그' },
  { value: 'improvement', label: '개선' },
];

const CATEGORY_LABELS = {
  opinion: { label: '의견', color: 'text-blue-600 bg-blue-100' },
  bug: { label: '버그', color: 'text-red-600 bg-red-100' },
  improvement: { label: '개선', color: 'text-green-600 bg-green-100' },
};

const RATING_LABELS = [
  { key: 'ratingUseful', label: '유용성', statKey: 'avgUseful' },
  { key: 'ratingTrust', label: '신뢰도', statKey: 'avgTrust' },
  { key: 'ratingEasy', label: '편의성', statKey: 'avgEasy' },
  { key: 'ratingRecommend', label: '추천', statKey: 'avgRecommend' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function StarValue({ value }) {
  if (value == null) return <span className="text-muted-foreground/50">—</span>;
  return (
    <span className="inline-flex items-center gap-0.5">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      {value}
    </span>
  );
}

export default function AdminFeedbackPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (category) params.set('category', category);
      const res = await fetch(`/api/admin/feedback?${params}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = data?.stats;
  const rows = data?.rows || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">피드백</h1>
        <p className="text-sm text-muted-foreground mt-1">
          사용자 평점(5점 만점)과 의견 · 버그 · 개선 제안
        </p>
      </div>

      {/* 평균 평점 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">총 건수</p>
          <p className="text-2xl font-bold">{stats?.totalAll ?? '—'}</p>
        </div>
        {RATING_LABELS.map(({ label, statKey }) => (
          <div key={statKey} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">{label} 평균</p>
            <p className="text-2xl font-bold inline-flex items-center gap-1.5">
              {stats?.[statKey] != null ? (
                <>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  {stats[statKey]}
                </>
              ) : (
                '—'
              )}
            </p>
          </div>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2">
        {CATEGORY_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={category === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCategory(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          피드백이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((item) => {
            const cat = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.opinion;
            return (
              <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    {item.nickname || (item.email ? '비로그인' : '익명')}
                  </span>
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      {item.email}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm mb-2">
                  {RATING_LABELS.map(({ key, label }) => (
                    <span key={key} className="text-muted-foreground">
                      {label} <StarValue value={item[key]} />
                    </span>
                  ))}
                </div>

                {item.comment && (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed p-3 bg-muted/50 rounded-lg">
                    {item.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
