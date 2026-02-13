'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserCache } from '@/store/user-cache';

export function AdminButton() {
  const { data: session } = useSession();

  // zustand 캐시에서 관리자 여부 가져오기 (깜빡임 방지)
  const { isAdmin: cachedIsAdmin, setUser } = useUserCache();

  // 세션이 있으면 캐시 업데이트
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session?.user, setUser]);

  const isAdmin = session?.user?.grade <= 20;
  const shouldShow = isAdmin || cachedIsAdmin;

  return (
    <Link
      href="/admin"
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
        "text-hanji-300 hover:text-hanji-100 hover:bg-ink-800",
        !shouldShow && "hidden"
      )}
    >
      <Shield className="w-4 h-4" />
    </Link>
  );
}
