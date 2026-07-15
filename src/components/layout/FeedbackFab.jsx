'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareHeart } from 'lucide-react';

// 전 페이지 우하단 고정 피드백 버튼 (/feedback 진입점)
export function FeedbackFab() {
  const pathname = usePathname();

  // 피드백 페이지 자체에서는 숨김
  if (pathname === '/feedback') return null;

  return (
    <Link
      href="/feedback"
      aria-label="Санал хүсэлт"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-terracotta text-white text-sm font-medium shadow-lg shadow-black/20 hover:bg-terracotta/90 hover:shadow-xl transition-all"
    >
      <MessageSquareHeart className="w-5 h-5" />
      <span className="hidden sm:inline">Санал хүсэлт</span>
    </Link>
  );
}
