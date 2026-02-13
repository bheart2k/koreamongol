'use client';

import { Users, Eye, MousePointerClick, Clock, Smartphone, Monitor, Tablet, Info } from 'lucide-react';
import { useAnalytics } from './AnalyticsContext';
import { StatCard, DataCard, EmptyState, LoadingSkeleton } from './StatCard';
import { AnalyticsError } from './AnalyticsState';
import { formatDuration, formatNumber, formatDate } from './utils';

// 도움말 툴팁 컴포넌트
function HelpTip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Info className="size-3" />
      {children}
    </span>
  );
}

export function OverviewTab() {
  const { overviewData: data, overviewLoading: isLoading, overviewError, refreshCurrentTab, realtimeData } = useAnalytics();

  // 에러 상태 처리
  if (overviewError && !data) {
    return <AnalyticsError error={overviewError} onRetry={refreshCurrentTab} />;
  }

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  return (
    <div className="space-y-6">
      {/* 실시간 방문자 */}
      {realtimeData && (
        <div className="rounded-xl border bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 size-3 rounded-full bg-green-500 animate-ping" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">실시간 방문자</p>
                <p className="text-2xl font-bold">{realtimeData.activeUsers || 0}명</p>
              </div>
            </div>
            <HelpTip>최근 30분 내 활성 사용자 (30초마다 갱신)</HelpTip>
          </div>
        </div>
      )}

      {/* 개요 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="방문자"
          value={formatNumber(data?.overview?.activeUsers)}
          icon={Users}
          loading={isLoading}
          description="사이트를 방문한 고유 사용자 수"
        />
        <StatCard
          title="페이지뷰"
          value={formatNumber(data?.overview?.pageViews)}
          icon={Eye}
          loading={isLoading}
          description="전체 페이지 조회 수 (한 사람이 여러 번 볼 수 있음)"
        />
        <StatCard
          title="세션"
          value={formatNumber(data?.overview?.sessions)}
          icon={MousePointerClick}
          loading={isLoading}
          description="방문 횟수 (30분 이상 지나면 새 세션)"
        />
        <StatCard
          title="평균 체류시간"
          value={formatDuration(data?.overview?.avgSessionDuration || 0)}
          icon={Clock}
          loading={isLoading}
          description="한 번 방문 시 평균 머문 시간"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 인기 페이지 */}
        <DataCard title="인기 페이지" description="페이지별 조회 수" loading={isLoading}>
          {data?.pages?.length > 0 ? (
            <div className="space-y-3">
              {data.pages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      {index + 1}
                    </span>
                    <span className="text-sm truncate" title={page.path}>
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(page.views)}회
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>

        {/* 기기별 방문자 */}
        <DataCard title="기기별 방문자" description="어떤 기기로 접속했는지" loading={isLoading}>
          {data?.devices?.length > 0 ? (
            <div className="space-y-4">
              {data.devices.map((device) => {
                const Icon = getDeviceIcon(device.device);
                const total = data.devices.reduce((sum, d) => sum + d.users, 0);
                const percentage = total > 0 ? (device.users / total) * 100 : 0;
                return (
                  <div key={device.device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="text-sm capitalize">
                          {device.device === 'desktop' ? '데스크톱' :
                           device.device === 'mobile' ? '모바일' :
                           device.device === 'tablet' ? '태블릿' : device.device}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatNumber(device.users)}명 ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>
      </div>

      {/* 일별 추이 */}
      {data?.daily && data.daily.length > 1 && (
        <DataCard title="일별 추이" loading={isLoading}>
          {/* 범례 */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary/80" />
              막대 = 페이지뷰
            </span>
            <span className="flex items-center gap-1.5">
              <span>오른쪽 숫자 = 방문자 수</span>
            </span>
          </div>
          <div className="space-y-2">
            {data.daily.map((day) => {
              const maxPageviews = Math.max(...data.daily.map(d => d.pageviews));
              const percentage = maxPageviews > 0 ? (day.pageviews / maxPageviews) * 100 : 0;
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-12">
                    {formatDate(day.date)}
                  </span>
                  <div className="flex-1 h-6 rounded bg-muted overflow-hidden">
                    <div
                      className="h-full rounded bg-primary/80 transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                      <span className="text-xs text-primary-foreground font-medium">
                        {day.pageviews}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {day.users}명
                  </span>
                </div>
              );
            })}
          </div>
        </DataCard>
      )}
    </div>
  );
}
