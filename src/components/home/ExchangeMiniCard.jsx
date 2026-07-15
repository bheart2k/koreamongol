'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

// 홈 "오늘의 환율" 미니 카드 — /api/exchange-rate 재사용 (1시간 캐싱)
export function ExchangeMiniCard() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rate) setRate(data.rate);
      })
      .catch(() => {});
  }, []);

  return (
    <Link
      href="/exchange"
      className="group block rounded-2xl border border-gold/40 bg-gold/5 p-6 hover:shadow-md hover:border-gold/60 transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-gold" />
        <h2 className="text-base font-semibold font-heading text-navy dark:text-sky">
          Өнөөдрийн ханш
        </h2>
      </div>
      <p className="text-2xl font-bold text-navy dark:text-gold mb-1">
        {rate ? `₮ ${Math.round(rate * 1000).toLocaleString('en-US')}` : '—'}
      </p>
      <p className="text-xs text-muted-foreground mb-3">1,000 ₩ тутамд</p>
      <span className="inline-flex items-center gap-1 text-sm text-terracotta font-medium group-hover:gap-2 transition-all">
        Тооцоолуур
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}
