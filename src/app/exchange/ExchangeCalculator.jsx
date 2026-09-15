'use client';

import styles from '@/components/guide/SupportPages.module.css';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { analytics } from '@/lib/analytics-events';

export default function ExchangeCalculator() {
  const [rate, setRate] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [krw, setKrw] = useState('100000');
  const [mnt, setMnt] = useState('');
  const [direction, setDirection] = useState('krw-to-mnt'); // or 'mnt-to-krw'
  const tracked = useRef(false);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/exchange-rate');
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRate(data.rate);
      setDate(data.fetchedAt || data.date || '');
    } catch {
      setError('Ханш авах боломжгүй байна. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  // rate가 로드되면 초기 계산
  useEffect(() => {
    if (rate && krw && direction === 'krw-to-mnt') {
      const val = parseFloat(krw.replace(/,/g, ''));
      if (!isNaN(val)) setMnt(formatNumber(Math.round(val * rate)));
    }
  }, [rate]); // eslint-disable-line react-hooks/exhaustive-deps

  function formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${month}сарын ${day} — ${hours}:${mins}`;
    } catch {
      return isoStr;
    }
  }

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function parseInput(str) {
    return parseFloat(str.replace(/,/g, ''));
  }

  function handleKrwChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setKrw('');
      setMnt('');
      return;
    }
    const num = parseInt(raw, 10);
    setKrw(formatNumber(num));
    if (rate) setMnt(formatNumber(Math.round(num * rate)));
    setDirection('krw-to-mnt');
    if (!tracked.current) { analytics.exchangeCalculate('krw_to_mnt'); tracked.current = true; }
  }

  function handleMntChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setKrw('');
      setMnt('');
      return;
    }
    const num = parseInt(raw, 10);
    setMnt(formatNumber(num));
    if (rate) setKrw(formatNumber(Math.round(num / rate)));
    setDirection('mnt-to-krw');
    if (!tracked.current) { analytics.exchangeCalculate('mnt_to_krw'); tracked.current = true; }
  }

  function handleSwap() {
    if (direction === 'krw-to-mnt') {
      setDirection('mnt-to-krw');
    } else {
      setDirection('krw-to-mnt');
    }
  }

  const krwField = (
    <div>
      <label htmlFor="exchange-krw" className="block text-xs font-medium text-muted-foreground mb-1.5">
        🇰🇷 Солонгос вон (KRW)
      </label>
      <div className="relative">
        <input id="exchange-krw"

          type="text"
          inputMode="numeric"
          value={krw}
          onChange={handleKrwChange}
          placeholder="100,000"
          className="w-full px-4 py-3 pr-12 text-lg font-semibold rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₩</span>
      </div>
    </div>
  );

  const mntField = (
    <div>
      <label htmlFor="exchange-mnt" className="block text-xs font-medium text-muted-foreground mb-1.5">
        🇲🇳 Монгол төгрөг (MNT)
      </label>
      <div className="relative">
        <input id="exchange-mnt"

          type="text"
          inputMode="numeric"
          value={mnt}
          onChange={handleMntChange}
          placeholder="247,000"
          className="w-full px-4 py-3 pr-12 text-lg font-semibold rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₮</span>
      </div>
    </div>
  );

  return (
    <div className={styles.calculator}>
      <div className={styles.form}>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Ханш ачааллаж байна...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              onClick={fetchRate}
              className="px-4 py-2 text-sm rounded-lg bg-terracotta text-white hover:bg-terracotta/90 transition-colors cursor-pointer"
            >
              Дахин оролдох
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {direction === 'krw-to-mnt' ? krwField : mntField}

              <div className="flex justify-center">
                <button
                  onClick={handleSwap}
                  className={styles.swap}
                  aria-label="Солих"
                >
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {direction === 'krw-to-mnt' ? mntField : krwField}
            </div>

            {rate && (
              <div className={styles.rate}>
                <p className="text-sm text-muted-foreground">
                  1,000 ₩ ≈ {formatNumber(Math.round(rate * 1000))} ₮
                </p>
                {date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Шинэчлэгдсэн: {formatDate(date)}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick amounts */}
      {rate && !loading && !error && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold font-heading text-foreground mb-3">Түгээмэл дүн</h3>
          <div className="grid grid-cols-2 gap-2">
            {[10000, 50000, 100000, 500000, 1000000, 3000000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setKrw(formatNumber(amount));
                  setMnt(formatNumber(Math.round(amount * rate)));
                  setDirection('krw-to-mnt');
                }}
                className={styles.quickAmount}
              >
                <span className="font-medium text-foreground">{formatNumber(amount)} ₩</span>
                <span className="block text-xs text-muted-foreground">{formatNumber(Math.round(amount * rate))} ₮</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
