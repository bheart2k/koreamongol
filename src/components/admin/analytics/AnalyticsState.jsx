'use client';

import { AlertCircle, Loader2 } from 'lucide-react';

/**
 * 로딩 상태 표시
 */
export function AnalyticsLoading({ message = '데이터를 불러오는 중...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Loader2 className="size-8 animate-spin mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * 에러 상태 표시
 */
export function AnalyticsError({ error, onRetry }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || '데이터를 불러오는데 실패했습니다';

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex items-center gap-2 text-destructive mb-4">
        <AlertCircle className="size-6" />
        <span className="font-medium">오류 발생</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

/**
 * 데이터 없음 상태 표시
 */
export function AnalyticsEmpty({ message = '데이터가 없습니다' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * 스탯 카드 (숫자 표시용)
 */
export function StatCard({ title, value, description, icon: Icon, trend, className }) {
  return (
    <div className={`p-6 bg-card border rounded-xl ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="size-5 text-primary" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
}
