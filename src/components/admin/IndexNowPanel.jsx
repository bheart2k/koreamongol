'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * IndexNow 수동 제출 패널 (관리자 설정)
 * — 사이트맵 전체 URL을 Bing/Yandex 등에 즉시 통보
 */
export default function IndexNowPanel({ keyLocation }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmitAll = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.skipped === 'non-production') {
          toast.info(`개발 환경이라 실제 제출은 생략됐습니다 (대상 ${data.total}개)`);
        } else {
          toast.success(`IndexNow 제출 완료 — ${data.submitted}개 URL`);
        }
      } else {
        toast.error(data.error || `제출 실패 (HTTP ${data.status ?? res.status})`);
      }
      setResult(data);
    } catch (error) {
      toast.error('제출 중 오류가 발생했습니다.');
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold">IndexNow 색인 제출</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        사이트맵의 모든 URL을 Bing·Yandex 등 IndexNow 참여 검색엔진에 통보합니다.
        게시글 작성/수정/삭제 시에는 자동으로 제출되므로, 이 버튼은 가이드 페이지를 대량
        수정했거나 최초 등록할 때만 사용하세요.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        키 파일:{' '}
        <a
          href={keyLocation}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          {keyLocation}
        </a>
      </p>

      <Button
        onClick={handleSubmitAll}
        disabled={loading}
        variant="navy"
        className="mt-4"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send />}
        {loading ? '제출 중...' : '사이트맵 전체 제출'}
      </Button>

      {result && (
        <p className="mt-3 text-sm text-muted-foreground">
          대상 {result.total ?? 0}개 / 제출 {result.submitted ?? 0}개
          {result.status ? ` (HTTP ${result.status})` : ''}
          {result.error ? ` — ${result.error}` : ''}
        </p>
      )}
    </div>
  );
}
