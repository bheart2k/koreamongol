'use client';

import styles from './header.module.css';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Logo } from '@/components/ui/logo';
import { motion, AnimatePresence } from 'motion/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { navItems, getLabel, getDesc } from './nav-items';
import { MobileMenu } from './mobile-menu';
import { UserMenu } from './user-menu';
import { AdminButton } from './admin-button';
import { SearchDialog } from './search-dialog';

function NavLink({ item, pathname, index }) {
  const isActive = pathname.startsWith(item.href);

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={cn(
        navigationMenuTriggerStyle(),
        styles.navTrigger,
        isActive && styles.active
      )}>
        <Link href={item.href} data-selected={isActive} aria-current={isActive ? 'page' : undefined}>
          {getLabel(item)}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function DropdownMenu({ item, index, pathname }) {
  const router = useRouter();
  const { children, align = 'left' } = item;
  const isActive = children.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));

  const alignClass = {
    left: '',
    center: '!left-1/2 !-translate-x-1/2',
    right: '!left-auto !right-0',
  }[align];

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={styles.navTrigger}
        data-selected={isActive}
        onClick={() => {
          if (children[0]?.href) router.push(children[0].href);
        }}
      >
        {getLabel(item)}
      </NavigationMenuTrigger>
      <NavigationMenuContent className={cn(styles.dropdown, alignClass)}>
        <div className="p-2 space-y-1">
          {children.map((child) => {
            const Icon = child.icon;
            return (
              <NavigationMenuLink asChild key={child.href}>
                <Link
                  href={child.href}
                  className={styles.dropdownLink}
                >
                  <div className={styles.dropdownIcon}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {getLabel(child)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {getDesc(child)}
                    </p>
                  </div>
                </Link>
              </NavigationMenuLink>
            );
          })}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn(styles.iconPlaceholder, className)} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        styles.iconButton,
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.bar}>
          <Logo variant="dark" size="sm" href="/" className={styles.logo} />

          <NavigationMenu viewport={false} className="hidden xl:flex">
            <NavigationMenuList className={styles.navList}>
              {navItems.map((item, index) => (
                item.type === 'link' ? (
                  <NavLink key={item.href} item={item} pathname={pathname} index={index} />
                ) : (
                  <DropdownMenu key={item.label} item={item} index={index} pathname={pathname} />
                )
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className={styles.actions}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={styles.iconButton}
              aria-label="Хайх"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <div className={styles.accountActions}>
              <AdminButton />
              <UserMenu />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className={cn(styles.iconButton, isMenuOpen && styles.active)}
                aria-label="Цэс" aria-expanded={isMenuOpen} aria-controls="header-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
