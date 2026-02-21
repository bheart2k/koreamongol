'use client';

import { useAnalytics } from './AnalyticsContext';
import { AnalyticsLoading, AnalyticsError, AnalyticsEmpty } from './AnalyticsState';
import { StatCard } from './StatCard';
import {
  BookOpen,
  Share2,
  Calculator,
  Heart,
  TrendingUp,
  MessageSquare,
  Phone,
  ExternalLink,
} from 'lucide-react';

export function InternalOverviewTab() {
  const { internalData, internalError, internalLoading, refreshCurrentTab } = useAnalytics();

  if (internalLoading) {
    return <AnalyticsLoading message="자체 통계를 불러오는 중..." />;
  }

  if (internalError) {
    return <AnalyticsError error={internalError} onRetry={refreshCurrentTab} />;
  }

  if (!internalData) {
    return <AnalyticsEmpty message="통계 데이터가 없습니다" />;
  }

  const { summary, eventSummary, hourlyDistribution, dailyTrend, recentEvents, dateRange } = internalData;

  const maxHourly = Math.max(...(hourlyDistribution || [1]));

  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        {dateRange?.start} ~ {dateRange?.end}
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="총 이벤트"
          value={summary?.totalEvents?.toLocaleString() || 0}
          icon={TrendingUp}
        />
        <StatCard
          title="가이드 조회"
          value={summary?.learning?.guideViews?.toLocaleString() || 0}
          icon={BookOpen}
        />
        <StatCard
          title="공유"
          value={summary?.learning?.shares?.toLocaleString() || 0}
          icon={Share2}
        />
        <StatCard
          title="후원 클릭"
          value={summary?.learning?.donateClicks?.toLocaleString() || 0}
          icon={Heart}
        />
      </div>

      {/* 카테고리별 사용량 */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">카테고리별 이벤트</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ToolStat
            icon={BookOpen}
            label="가이드"
            value={summary?.toolUsage?.guide || 0}
          />
          <ToolStat
            icon={Share2}
            label="공유"
            value={summary?.toolUsage?.social || 0}
          />
          <ToolStat
            icon={Calculator}
            label="도구 (환율)"
            value={summary?.toolUsage?.tools || 0}
          />
          <ToolStat
            icon={MessageSquare}
            label="커뮤니티"
            value={summary?.toolUsage?.community || 0}
          />
          <ToolStat
            icon={Heart}
            label="후원"
            value={summary?.learning?.donateClicks || 0}
          />
          <ToolStat
            icon={Calculator}
            label="환율 계산"
            value={summary?.learning?.exchangeCalc || 0}
          />
        </div>
      </div>

      {/* 시간대별 분포 */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">시간대별 분포 (KST)</h3>
        <div className="flex items-end gap-1 h-32">
          {(hourlyDistribution || new Array(24).fill(0)).map((count, hour) => (
            <div
              key={hour}
              className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t relative group"
              style={{ height: `${maxHourly > 0 ? (count / maxHourly) * 100 : 0}%`, minHeight: '2px' }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {hour}시: {count}건
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0시</span>
          <span>6시</span>
          <span>12시</span>
          <span>18시</span>
          <span>24시</span>
        </div>
      </div>

      {/* 이벤트별 집계 */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">이벤트별 집계</h3>
        <div className="space-y-3">
          {(eventSummary || []).map((event) => (
            <div key={event.event} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm font-medium">{formatEventName(event.event)}</span>
              <span className="text-sm text-muted-foreground">{event.count?.toLocaleString()}건</span>
            </div>
          ))}
          {(!eventSummary || eventSummary.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">이벤트 데이터가 없습니다</p>
          )}
        </div>
      </div>

      {/* 일별 추이 */}
      {dailyTrend && dailyTrend.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">일별 추이</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">날짜</th>
                  <th className="text-right py-2 px-2">총 이벤트</th>
                  <th className="text-right py-2 px-2">가이드</th>
                  <th className="text-right py-2 px-2">공유</th>
                </tr>
              </thead>
              <tbody>
                {[...dailyTrend].reverse().map((day) => (
                  <tr key={day.date} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 px-2">{day.date}</td>
                    <td className="text-right py-2 px-2">{day.totalEvents?.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{day.tools?.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{day.learning?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 최근 이벤트 */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">최근 이벤트</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {(recentEvents || []).map((event, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                  {formatEventName(event.event)}
                </span>
                {event.label && (
                  <span className="text-muted-foreground truncate max-w-[200px]">{event.label}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(event.createdAt).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
          {(!recentEvents || recentEvents.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">최근 이벤트가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}

function formatEventName(event) {
  const names = {
    guide_view: '가이드 조회',
    emergency_call: '긴급전화 클릭',
    external_link: '외부 링크',
    share_facebook: 'Facebook 공유',
    share_copy_link: '링크 복사',
    exchange_calculate: '환율 계산',
    community_post: '글 작성',
    community_comment: '댓글 작성',
    donate_click: '후원 클릭',
    page_view: '페이지 조회',
  };
  return names[event] || event;
}

export default InternalOverviewTab;
