'use client';

import { Clock, TrendingDown, MousePointerClick, FileText, ArrowRight } from 'lucide-react';
import { useAnalytics } from './AnalyticsContext';
import { StatCard, DataCard, EmptyState, ProgressBar } from './StatCard';
import { AnalyticsError, AnalyticsLoading } from './AnalyticsState';
import { formatDuration, formatNumber } from './utils';

export function BehaviorTab() {
  const { behaviorData: data, behaviorLoading: isLoading, behaviorError, refreshCurrentTab } = useAnalytics();

  // 에러 상태 처리
  if (behaviorError && !data) {
    return <AnalyticsError error={behaviorError} onRetry={refreshCurrentTab} />;
  }

  // 첫 로딩 상태
  if (isLoading && !data) {
    return <AnalyticsLoading message="행동 데이터를 불러오는 중..." />;
  }

  // 참여율/이탈률 평가
  const bounceRatePercent = (data?.bounceRate || 0) * 100;
  const engagementRatePercent = (data?.engagementRate || 0) * 100;

  const getBounceRateStatus = () => {
    if (bounceRatePercent < 40) return { text: '매우 좋음', color: 'text-green-600' };
    if (bounceRatePercent < 55) return { text: '좋음', color: 'text-green-600' };
    if (bounceRatePercent < 70) return { text: '보통', color: 'text-yellow-600' };
    return { text: '개선 필요', color: 'text-red-600' };
  };

  const getEngagementStatus = () => {
    if (engagementRatePercent > 70) return { text: '매우 좋음', color: 'text-green-600' };
    if (engagementRatePercent > 50) return { text: '좋음', color: 'text-green-600' };
    if (engagementRatePercent > 30) return { text: '보통', color: 'text-yellow-600' };
    return { text: '개선 필요', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* 개요 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="평균 체류시간"
          value={formatDuration(data?.avgEngagementTime || 0)}
          icon={Clock}
          loading={isLoading}
          description="길수록 콘텐츠에 관심이 많다는 의미"
        />
        <StatCard
          title="이탈률"
          value={`${bounceRatePercent.toFixed(1)}%`}
          icon={TrendingDown}
          loading={isLoading}
          description={`한 페이지만 보고 나간 비율 (낮을수록 좋음)`}
          status={getBounceRateStatus()}
        />
        <StatCard
          title="참여율"
          value={`${engagementRatePercent.toFixed(1)}%`}
          icon={MousePointerClick}
          loading={isLoading}
          description={`10초↑ 머물거나 2페이지↑ 본 비율 (높을수록 좋음)`}
          status={getEngagementStatus()}
        />
        <StatCard
          title="세션당 페이지뷰"
          value={data?.pagesPerSession?.toFixed(2) || '0'}
          icon={FileText}
          loading={isLoading}
          description="한 번 방문에 평균 몇 페이지 봤는지"
        />
      </div>

      {/* 페이지별 상세 */}
      <DataCard
        title="페이지별 체류시간 및 이탈률"
        description="이탈률 70% 이상은 빨간색으로 표시"
        loading={isLoading}
      >
        {data?.pageMetrics?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">#</th>
                  <th className="text-left py-3 font-medium">페이지</th>
                  <th className="text-right py-3 font-medium">조회수</th>
                  <th className="text-right py-3 font-medium">체류시간</th>
                  <th className="text-right py-3 font-medium">이탈률</th>
                </tr>
              </thead>
              <tbody>
                {data.pageMetrics.map((page, index) => (
                  <tr key={page.path} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 text-muted-foreground">{index + 1}</td>
                    <td className="py-3">
                      <span className="truncate block max-w-[300px]" title={page.path}>
                        {page.path}
                      </span>
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {formatNumber(page.views)}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {formatDuration(page.avgTime)}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      <span className={page.bounceRate > 0.7 ? 'text-destructive' : ''}>
                        {(page.bounceRate * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </DataCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 인기 이벤트 */}
        <DataCard title="이벤트" icon={MousePointerClick} description="사용자 행동 (클릭, 스크롤 등)" loading={isLoading}>
          {data?.events?.length > 0 ? (
            <div className="space-y-3">
              {data.events.map((event, index) => {
                const maxCount = Math.max(...data.events.map(e => e.count));
                return (
                  <ProgressBar
                    key={event.name}
                    value={event.count}
                    max={maxCount}
                    label={`${index + 1}. ${event.name}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>

        {/* 이탈률 높은 페이지 */}
        <DataCard title="이탈률 높은 페이지" icon={TrendingDown} description="콘텐츠 개선이 필요한 페이지" loading={isLoading}>
          {data?.highBouncePages?.length > 0 ? (
            <div className="space-y-3">
              {data.highBouncePages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      {index + 1}
                    </span>
                    <span className="text-sm truncate" title={page.path}>
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-destructive tabular-nums">
                    {(page.bounceRate * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>
      </div>

      {/* 랜딩 페이지 */}
      <DataCard title="랜딩 페이지 (첫 방문 페이지)" description="사용자가 처음 들어온 페이지 / 오른쪽 숫자는 세션 수" loading={isLoading}>
        {data?.landingPages?.length > 0 ? (
          <div className="space-y-3">
            {data.landingPages.map((page, index) => (
              <div key={page.path} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-5">{index + 1}</span>
                <span className="truncate flex-1" title={page.path}>
                  {page.path.split('?')[0]}
                </span>
                <span className="tabular-nums text-muted-foreground shrink-0">
                  이탈 {((page.bounceRate || 0) * 100).toFixed(0)}%
                </span>
                <span className="tabular-nums font-medium shrink-0">
                  {formatNumber(page.sessions)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </DataCard>
    </div>
  );
}
