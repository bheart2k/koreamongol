'use client';

// 전역 피드백 플로팅 버튼(FAB) — layout-shell에 1회 마운트되는 말단 클라이언트 컴포넌트.
// 2026-09-01 확정(한글허브 원형): 라벨 알약형("Санал хүсэлт") — 데스크톱은 항상 라벨,
// 모바일은 스크롤 시작하면 아이콘만으로 축소. 클릭하면 버튼 바로 위(우하단 고정)에
// 통합 패널(feedback-panel — 평가 기본 + 기능요청/개선/버그/기타)이 뜬다.
// 계약서: bloomingheart_next/docs/feedback-hub-스펙.md §4. 코리아몽골 조정: terracotta 버튼(기존 FAB 색 유지),
// /feedback 페이지(같은 패널의 전체 화면)에서는 숨김.
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquareHeart, X } from 'lucide-react';
import { FeedbackPanel } from './feedback-panel';

export function FeedbackFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 모바일: 스크롤 시작하면 라벨 접고 아이콘만

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 스크롤 감지 — 라벨 접힘은 모바일에서만 적용(클래스로 분기), 데스크톱은 항상 라벨 유지
  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 피드백 페이지 자체에서는 숨김 (같은 패널이 전체 화면으로 렌더됨)
  if (pathname === '/feedback') return null;

  return (
    <>
      {/* 패널 - 버튼 근처(우하단 고정) 팝오버 */}
      {open && (
        <div className="fixed bottom-20 right-5 z-40 max-h-[calc(100dvh-6.5rem)] w-96 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Санал хүсэлт</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Хаах"
              className="cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <FeedbackPanel source="quick" onDone={() => setOpen(false)} />
        </div>
      )}

      {/* 플로팅 버튼 - 라벨 알약형(인지도용) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Хаах' : 'Санал хүсэлт'}
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-terracotta px-3.5 text-white text-sm font-medium shadow-lg shadow-black/20 hover:bg-terracotta/90 hover:shadow-xl transition-all"
      >
        {open ? <X className="w-5 h-5 shrink-0" /> : <MessageSquareHeart className="w-5 h-5 shrink-0" />}
        {/* 라벨: 패널 열림 중엔 숨김 / 모바일은 스크롤 시 접힘 / 데스크톱(sm~)은 항상 표시 */}
        {!open && (
          <span className={`whitespace-nowrap ${collapsed ? 'hidden sm:inline' : ''}`}>
            Санал хүсэлт
          </span>
        )}
      </button>
    </>
  );
}
