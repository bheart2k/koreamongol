'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const footerLinks = {
  company: [
    { href: '/about', label: 'Танилцуулга' },
    { href: '/faq', label: 'Түгээмэл асуулт' },
    { href: '/contact', label: 'Холбоо барих' },
    { href: '/donate', label: 'Дэмжлэг' },
  ],
  legal: [
    { href: '/privacy', label: 'Нууцлалын бодлого' },
    { href: '/terms', label: 'Үйлчилгээний нөхцөл' },
  ],
};

export function Footer() {
  const pathname = usePathname();

  if (pathname?.includes('/community')) {
    return null;
  }

  return (
    <footer className="bg-navy border-t border-navy-light/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* 로고 및 소개 */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="dark" size="sm" href="/" />
            <p className="text-sm text-sky/60 max-w-sm leading-relaxed mt-2">
              Монгол иргэдэд зориулсан Солонгос амьдралын бүрэн гарын авлага. Виз, бүртгэл, эмнэлэг, мөнгө шилжүүлэг зэрэг бүх мэдээллийг нэг дороос.
            </p>
            <p className="text-sm text-sky/40 mt-2">
              🇲🇳 Монголын Элчин Сайдын Яам: 02-798-3464
            </p>
          </div>

          {/* KoreaMongol 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-sky mb-4">
              KoreaMongol
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sky/60 hover:text-sky transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-sky mb-4">
              Бодлого
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sky/60 hover:text-sky transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-10 pt-6 border-t border-navy-light/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-sky/40">
              © {new Date().getFullYear()} KoreaMongol. All rights reserved.
            </p>
            <p className="text-xs text-sky/40">
              Нутаг — Таны Солонгос амьдралын хөтөч
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
