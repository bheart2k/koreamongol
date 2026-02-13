'use client';

import { UserPlus, UserCheck, Languages, Users, Cake, UserCircle } from 'lucide-react';
import { useAnalytics } from './AnalyticsContext';
import { StatCard, DataCard, EmptyState, ProgressBar } from './StatCard';
import { AnalyticsError, AnalyticsLoading } from './AnalyticsState';
import { formatNumber } from './utils';

export function UsersTab() {
  const { usersData: data, usersLoading: isLoading, usersError, refreshCurrentTab } = useAnalytics();

  // 에러 상태 처리
  if (usersError && !data) {
    return <AnalyticsError error={usersError} onRetry={refreshCurrentTab} />;
  }

  // 첫 로딩 상태
  if (isLoading && !data) {
    return <AnalyticsLoading message="사용자 데이터를 불러오는 중..." />;
  }

  return (
    <div className="space-y-6">
      {/* 신규 vs 재방문 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 사용자"
          value={formatNumber(data?.totalUsers)}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="신규 사용자"
          value={formatNumber(data?.newUsers)}
          icon={UserPlus}
          loading={isLoading}
          description={data?.newUsersPercent ? `전체의 ${data.newUsersPercent.toFixed(1)}%` : ''}
        />
        <StatCard
          title="재방문 사용자"
          value={formatNumber(data?.returningUsers)}
          icon={UserCheck}
          loading={isLoading}
          description={data?.returningUsersPercent ? `전체의 ${data.returningUsersPercent.toFixed(1)}%` : ''}
        />
        <StatCard
          title="세션당 페이지뷰"
          value={data?.pagesPerSession?.toFixed(2) || '0'}
          icon={Languages}
          loading={isLoading}
        />
      </div>

      {/* 신규 vs 재방문 비율 차트 */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">신규 vs 재방문 사용자</h2>
        {isLoading ? (
          <div className="h-12 rounded bg-muted animate-pulse" />
        ) : (
          <div className="space-y-4">
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                style={{ width: `${data?.newUsersPercent || 50}%` }}
              >
                {data?.newUsersPercent?.toFixed(0) || 0}%
              </div>
              <div
                className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                style={{ width: `${data?.returningUsersPercent || 50}%` }}
              >
                {data?.returningUsersPercent?.toFixed(0) || 0}%
              </div>
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500" />
                <span>신규 사용자</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-emerald-500" />
                <span>재방문 사용자</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 언어별 사용자 */}
        <DataCard title="언어별 사용자" icon={Languages} loading={isLoading}>
          {data?.languages?.length > 0 ? (
            <div className="space-y-3">
              {data.languages.map((item, index) => {
                const maxUsers = Math.max(...data.languages.map(l => l.users));
                return (
                  <ProgressBar
                    key={item.language}
                    value={item.users}
                    max={maxUsers}
                    label={`${index + 1}. ${item.languageName || item.language}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>

        {/* 연령대별 사용자 */}
        <DataCard title="연령대별 사용자" icon={Cake} loading={isLoading}>
          {data?.ageGroups?.length > 0 ? (
            <div className="space-y-3">
              {data.ageGroups.map((item) => {
                const maxUsers = Math.max(...data.ageGroups.map(a => a.users));
                return (
                  <ProgressBar
                    key={item.age}
                    value={item.users}
                    max={maxUsers}
                    label={item.age === 'unknown' ? '알 수 없음' : `${item.age}세`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState message="연령 데이터가 없습니다. GA4에서 Google 신호 데이터를 활성화해주세요." />
          )}
        </DataCard>

        {/* 성별 사용자 */}
        <DataCard title="성별 사용자" icon={UserCircle} loading={isLoading}>
          {data?.genders?.length > 0 ? (
            <div className="space-y-4">
              {data.genders.map((item) => {
                const total = data.genders.reduce((sum, g) => sum + g.users, 0);
                const percentage = total > 0 ? (item.users / total) * 100 : 0;
                const genderLabel = item.gender === 'male' ? '남성' :
                                   item.gender === 'female' ? '여성' : '알 수 없음';
                const bgColor = item.gender === 'male' ? 'bg-blue-500' :
                               item.gender === 'female' ? 'bg-pink-500' : 'bg-gray-400';
                return (
                  <div key={item.gender} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{genderLabel}</span>
                      <span className="text-sm font-medium">
                        {formatNumber(item.users)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bgColor} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="성별 데이터가 없습니다. GA4에서 Google 신호 데이터를 활성화해주세요." />
          )}
        </DataCard>

        {/* 브라우저별 사용자 */}
        <DataCard title="브라우저별 사용자" loading={isLoading}>
          {data?.browsers?.length > 0 ? (
            <div className="space-y-3">
              {data.browsers.map((item, index) => {
                const maxUsers = Math.max(...data.browsers.map(b => b.users));
                return (
                  <ProgressBar
                    key={item.browser}
                    value={item.users}
                    max={maxUsers}
                    label={`${index + 1}. ${item.browser}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </DataCard>
      </div>
    </div>
  );
}
