'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, Sun, Moon } from 'lucide-react';
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

function NavLink({ item, pathname, index }) {
  const isActive = pathname.startsWith(item.href);

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={cn(
        navigationMenuTriggerStyle(),
        "bg-transparent text-sky/70 hover:text-sky hover:bg-navy-light transition-all duration-200",
        isActive && "text-sky bg-navy-light"
      )}>
        <Link href={item.href}>
          {getLabel(item)}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function DropdownMenu({ item, index }) {
  const { children, align = 'left' } = item;

  const alignClass = {
    left: '',
    center: '!left-1/2 !-translate-x-1/2',
    right: '!left-auto !right-0',
  }[align];

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent text-sky/70 hover:text-sky hover:bg-navy-light data-[state=open]:bg-navy-light data-[state=open]:text-sky transition-all duration-200">
        {getLabel(item)}
      </NavigationMenuTrigger>
      <NavigationMenuContent className={cn("min-w-[280px]", alignClass)}>
        <div className="p-2 space-y-1">
          {children.map((child) => {
            const Icon = child.icon;
            return (
              <NavigationMenuLink asChild key={child.href}>
                <Link
                  href={child.href}
                  className="group flex items-start gap-4 select-none rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-accent/5 focus:bg-accent/5 border border-transparent hover:border-accent/10"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky/50 text-navy group-hover:bg-gold/10 transition-colors">
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
    return <div className={cn("w-9 h-9 rounded-lg", className)} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer",
        "text-sky/70 hover:text-sky hover:bg-navy-light",
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-navy border-b border-navy-light/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo variant="dark" size="sm" href="/" className="hover:opacity-90 transition-opacity" />

          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item, index) => (
                item.type === 'link' ? (
                  <NavLink key={item.href} item={item} pathname={pathname} index={index} />
                ) : (
                  <DropdownMenu key={item.label} item={item} index={index} />
                )
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-1 lg:gap-1">
            <ThemeToggle />
            <div className="flex items-center gap-1">
              <AdminButton />
              <UserMenu />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="flex items-center justify-center w-9 h-9 text-sky/70 rounded-lg hover:bg-navy-light hover:text-sky transition-colors cursor-pointer"
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
    </header>
  );
}
