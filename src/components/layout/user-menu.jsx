'use client';

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
      className={cn(
        "flex items-center gap-2 p-1 pr-2 rounded-full transition-colors cursor-pointer",
        "hover:bg-navy-light",
        isOpen && "bg-navy-light"
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
  const menuRef = useRef(null);

  const { user: cachedUser, setUser } = useUserCache();

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

  const showProfile = !!displayUser;
  const isFirstLoading = status === 'loading' && !displayUser;

  if (isFirstLoading) {
    return (
      <div className="w-9 h-9 lg:w-[68px] rounded-full bg-navy-light animate-pulse" />
    );
  }

  if (!showProfile) {
    return (
      <button
        onClick={() => signIn('google')}
        className={cn(
          "flex items-center justify-center w-9 h-9 lg:w-[68px] rounded-full transition-colors cursor-pointer",
          "text-sky/70 hover:text-sky hover:bg-navy-light"
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
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy rounded-xl shadow-lg border border-border dark:border-navy-light overflow-hidden z-50"
          >
            <div className="p-3 border-b border-border dark:border-navy-light">
              <p className="text-sm font-medium text-foreground dark:text-sky truncate">
                {displayUser.nickname || 'Нэрээ тохируулна уу'}
              </p>
            </div>

            <div className="p-1">
              <Link
                href="/mypage"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground dark:text-sky/70 hover:bg-muted dark:hover:bg-navy-light rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Миний хуудас
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
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
