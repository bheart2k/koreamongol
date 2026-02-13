'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * KoreaMongol 텍스트 로고
 * "Korea" = navy, "Mongol" = gold
 */
export function Logo({ variant = 'light', size = 'md', className, href }) {
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const variantStyles = {
    light: {
      korea: 'text-navy',
      mongol: 'text-gold',
    },
    dark: {
      korea: 'text-sky',
      mongol: 'text-gold',
    },
  };

  const colors = variantStyles[variant];

  const LogoContent = () => (
    <div className={cn('font-heading font-extrabold tracking-tight', sizeStyles[size], className)}>
      <span className={colors.korea}>Korea</span>
      <span className={colors.mongol}>Mongol</span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/50 rounded-lg"
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
