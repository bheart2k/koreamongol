'use client';

import styles from './header.module.css';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserCache } from '@/store/user-cache';

const ProfileButton = memo(function ProfileButton({ user, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Миний хуудас" aria-expanded={isOpen} aria-controls="header-user-menu"
      className={cn(
        styles.profileButton,
        isOpen && styles.active
      )}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <User className="w-4 h-4 text-gold" />
        </div>
      )}
      <ChevronDown className={cn(
        "w-4 h-4 text-sky/60 transition-transform",
        isOpen && "rotate-180"
      )} />
    </button>
  );
});

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);

  const { user: cachedUser, setUser } = useUserCache();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session?.user, setUser]);

  const displayUser = session?.user || cachedUser;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // SSR과 클라이언트 초기 렌더를 일치시켜 hydration error 방지
  if (!mounted) {
    return (
      <div className={styles.iconPlaceholder} />
    );
  }

  const showProfile = !!displayUser;
  const isFirstLoading = status === 'loading' && !displayUser;

  if (isFirstLoading) {
    return (
      <div className={cn(styles.iconPlaceholder, "bg-navy-light animate-pulse")} />
    );
  }

  if (!showProfile) {
    return (
      <button
        onClick={() => signIn('google')}
        aria-label="Нэвтрэх"
        className={cn(
          styles.iconButton
        )}
      >
        <LogIn className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <ProfileButton
        user={displayUser}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            id="header-user-menu" className={styles.userPanel}
          >
            <div className={styles.panelHeading}>
              <p className="text-sm font-medium text-foreground dark:text-sky truncate">
                {displayUser.nickname || 'Нэрээ тохируулна уу'}
              </p>
            </div>

            <div className="p-1">
              <Link
                href="/mypage"
                onClick={() => setIsOpen(false)}
                className={styles.mobileLink}
              >
                <User className="w-4 h-4" />
                Миний хуудас
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className={cn(styles.mobileLink, "text-red-700 dark:text-red-300")}
              >
                <LogOut className="w-4 h-4" />
                Гарах
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
