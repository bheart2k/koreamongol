'use client';

import { Search, Share2, Link2, Mail, DollarSign, Globe } from 'lucide-react';
import { useAnalytics } from './AnalyticsContext';
import { StatCard, DataCard, EmptyState, ProgressBar } from './StatCard';
import { AnalyticsError, AnalyticsLoading } from './AnalyticsState';
import { formatNumber, translateChannel } from './utils';

const CHANNEL_ICONS = {
  'Organic Search': Search,
  'Direct': Link2,
  'Referral': Share2,
  'Organic Social': Globe,
  'Email': Mail,
  'Paid Search': DollarSign,
};

export function AcquisitionTab() {
  const { acquisitionData: data, acquisitionLoading: isLoading, acquisitionError, refreshCurrentTab } = useAnalytics();

  // 에러 상태 처리
  if (acquisitionError && !data) {
    return <AnalyticsError error={acquisitionError} onRetry={refreshCurrentTab} />;
  }

  // 첫 로딩 상태
  if (isLoading && !data) {
    return <AnalyticsLoading message="유입 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-6">
      {/* 채널별 개요 */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">채널별 유입</h2>
        {isLoading ? (
          <div className="h-32 rounded bg-muted animate-pulse" />
        ) : data?.channels?.length > 0 ? (
          <div className="space-y-4">
            {/* 비율 바 */}
            <div className="flex h-10 rounded-lg overflow-hidden">
              {data.channels.map((channel, index) => {
                const total = data.channels.reduce((sum, c) => sum + c.sessions, 0);
                const percentage = total > 0 ? (channel.sessions / total) * 100 : 0;
                const colors = [
                  'bg-blue-500',
                  'bg-emerald-500',
                  'bg-orange-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-yellow-500',
                  'bg-cyan-500',
                  'bg-red-500',
                ];
                if (percentage < 3) return null;
                return (
                  <div
                    key={channel.channel}
                    className={`${colors[index % colors.length]} flex items-center justify-center text-white text-xs font-medium transition-all`}
                    style={{ width: `${percentage}%` }}
                    title={`${translateChannel(channel.channel)}: ${percentage.toFixed(1)}%`}
                  >
                    {percentage >= 8 && `${percentage.toFixed(0)}%`}
                  </div>
                );
              })}
            </div>
            {/* 범례 */}
            <div className="flex flex-wrap gap-4 text-sm">
              {data.channels.map((channel, index) => {
                const colors = [
                  'bg-blue-500',
                  'bg-emerald-500',
                  'bg-orange-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-yellow-500',
                  'bg-cyan-500',
                  'bg-red-500',
                ];
                return (
                  <div key={channel.channel} className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${colors[index % colors.length]}`} />
                    <span>{translateChannel(channel.channel)}</span>
                    <span className="text-muted-foreground">({formatNumber(channel.sessions)})</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 채널별 상세 */}
        <DataCard title="채널별 상세" loading={isLoading}>
          {data?.channels?.length > 0 ? (
            <div className="space-y-3">
              {data.channels.map((channel, index) => {
                const maxSessions = Math.max(...data.channels.map(c => c.sessions));
                const Icon = CHANNEL_ICONS[channel.channel] || Globe;
                return (
                  <div key={channel.channel} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <span>{translateChannel(channel.channel)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{formatNumber(channel.sessions)}</span>
                        <span className="text-muted-foreground ml-2">
                          ({formatNumber(channel.users)}명)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(channel.sessions / maxSessions) * 100}%` }}
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

        {/* 소스/매체 */}
        <DataCard title="소스/매체" loading={isLoading}>
          {data?.sourceMedium?.length > 0 ? (
            <div className="space-y-3">
              {data.sourceMedium.map((item, index) => {
                const maxSessions = Math.max(...data.sourceMedium.map(s => s.sessions));
                return (
                  <ProgressBar
                    key={`${item.source}-${item.medium}`}
                    value={item.sessions}
                    max={maxSessions}
                    label={item.source === '(direct)' ? '직접 방문' : item.source}
                    sublabel={item.medium === '(none)' ? '-' : item.medium}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>

        {/* 랜딩 페이지 */}
        <DataCard title="랜딩 페이지 (진입 페이지)" loading={isLoading}>
          {data?.landingPages?.length > 0 ? (
            <div className="space-y-3">
              {data.landingPages.map((page, index) => {
                const maxSessions = Math.max(...data.landingPages.map(p => p.sessions));
                return (
                  <ProgressBar
                    key={page.path}
                    value={page.sessions}
                    max={maxSessions}
                    label={`${index + 1}. ${page.path}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>

        {/* 참조 사이트 */}
        <DataCard title="참조 사이트" icon={Share2} loading={isLoading}>
          {data?.referrers?.length > 0 ? (
            <div className="space-y-3">
              {data.referrers.map((ref, index) => {
                const maxSessions = Math.max(...data.referrers.map(r => r.sessions));
                return (
                  <ProgressBar
                    key={ref.referrer}
                    value={ref.sessions}
                    max={maxSessions}
                    label={`${index + 1}. ${ref.referrer}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState message="참조 사이트 데이터가 없습니다" />
          )}
        </DataCard>
      </div>
    </div>
  );
}
