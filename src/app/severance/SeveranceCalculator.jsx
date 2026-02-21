'use client';

import { useState, useCallback } from 'react';
import { Calculator, Calendar, Wallet, Gift, Coins, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';
import { analytics } from '@/lib/analytics-events';

function formatNumber(num) {
  return num.toLocaleString('ko-KR');
}

function calculateTotalDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function calculatePeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [allowance, setAllowance] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSalaryChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setSalary(raw ? formatNumber(parseInt(raw, 10)) : '');
  };

  const handleBonusChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setBonus(raw ? formatNumber(parseInt(raw, 10)) : '');
  };

  const handleAllowanceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAllowance(raw ? formatNumber(parseInt(raw, 10)) : '');
  };

  const parseNum = (str) => parseInt((str || '0').replace(/,/g, ''), 10) || 0;

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!startDate || !endDate || !salary) {
      setError('Заавал бөглөх талбарыг бүрэн бөглөнө үү.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      setError('Ажлаас гарсан өдөр нь ажилд орсон өдрөөс хойш байх ёстой.');
      return;
    }

    const totalDays = calculateTotalDays(startDate, endDate);
    const period = calculatePeriod(startDate, endDate);
    const monthlySalary = parseNum(salary);
    const annualBonus = parseNum(bonus);
    const fixedAllowance = parseNum(allowance);

    const threeMonthSalary = monthlySalary * 3;
    const threeMonthBonus = (annualBonus / 12) * 3;
    const threeMonthAllowance = fixedAllowance * 3;
    const totalThreeMonth = threeMonthSalary + threeMonthBonus + threeMonthAllowance;

    const dailyAvg = totalThreeMonth / 90;
    const severancePay = dailyAvg * 30 * (totalDays / 365);

    setResult({
      severancePay: Math.round(severancePay),
      dailyAvg: Math.round(dailyAvg),
      totalDays,
      period,
      isUnderOneYear: totalDays < 365,
      totalThreeMonth: Math.round(totalThreeMonth),
    });

    analytics.severanceCalculate();
  }, [startDate, endDate, salary, bonus, allowance]);

  const reset = () => {
    setStartDate('');
    setEndDate('');
    setSalary('');
    setBonus('');
    setAllowance('');
    setShowAdvanced(false);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Input Form */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Ажилд орсон өдөр
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Гарсан (гарах) өдөр
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
        </div>

        {/* Monthly Salary */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <Wallet className="w-3.5 h-3.5" />
            Сарын үндсэн цалин
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="2,060,740"
              className="w-full px-3 py-2.5 pr-8 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₩</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            2026 доод цалин: ₩10,320/цаг × 209цаг = ₩2,156,880/сар
          </p>
        </div>

        {/* Advanced Options */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer"
        >
          {showAdvanced ? '▲ Нэмэлт сонголтыг хаах' : '▼ Нэмэлт: урамшуулал, тогтмол тэтгэмж'}
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Gift className="w-3.5 h-3.5" />
                Жилийн урамшуулал (шинэ жил, чусок г.м.)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={bonus}
                  onChange={handleBonusChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 pr-8 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₩</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Coins className="w-3.5 h-3.5" />
                Сарын тогтмол тэтгэмж (хоол, зорчих г.м.)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={allowance}
                  onChange={handleAllowanceChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 pr-8 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₩</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-navy text-white hover:bg-navy/90 transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            Тооцоолох
          </button>
          <button
            onClick={reset}
            className="px-3 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Дахин эхлүүлэх"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-2xl border-2 border-gold/40 bg-gold/5 space-y-5">
          {result.isUnderOneYear && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-terracotta/10 text-sm text-terracotta">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              Ажилласан хугацаа 1 жилээс доош бол тэтгэмж авах эрх үүсэхгүй.
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Тооцоолсон тэтгэмж</p>
            <p className="text-3xl font-bold font-heading text-navy dark:text-sky">
              ₩{formatNumber(result.severancePay)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-0.5">Ажилласан хугацаа</p>
              <p className="font-semibold text-foreground">
                {result.period.years > 0 && `${result.period.years} жил `}
                {result.period.months > 0 && `${result.period.months} сар `}
                {result.period.days} өдөр
              </p>
              <p className="text-xs text-muted-foreground">({formatNumber(result.totalDays)} өдөр)</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-0.5">1 өдрийн дундаж цалин</p>
              <p className="font-semibold text-foreground">₩{formatNumber(result.dailyAvg)}</p>
            </div>
            <div className="col-span-2 p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-0.5">3 сарын нийт цалин</p>
              <p className="font-semibold text-foreground">₩{formatNumber(result.totalThreeMonth)}</p>
            </div>
          </div>

          {/* Formula */}
          <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Тооцооллын томьёо:</p>
            <p>1 өдрийн дундаж = 3 сарын нийт цалин ÷ 90</p>
            <p>Тэтгэмж = 1 өдрийн дундаж × 30 × (нийт өдөр ÷ 365)</p>
          </div>
        </div>
      )}

      {/* More tools link */}
      <div className="p-4 rounded-lg border border-border bg-card text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Бусад тооцоолуур & хэрэгтэй апп:
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.everycalc.pe.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy dark:text-sky hover:text-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            EVERYCALC — 76+ тооцоолуур
          </a>
        </div>
      </div>
    </div>
  );
}
