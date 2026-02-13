'use client';

import { RefreshCw, LayoutDashboard, Users, MousePointerClick, Share2, Globe, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsProvider, useAnalytics, PERIODS, isHourPeriod } from '@/components/admin/analytics/AnalyticsContext';
import { OverviewTab } from '@/components/admin/analytics/OverviewTab';
import { UsersTab } from '@/components/admin/analytics/UsersTab';
import { BehaviorTab } from '@/components/admin/analytics/BehaviorTab';
import { AcquisitionTab } from '@/components/admin/analytics/AcquisitionTab';
import { GeoTab } from '@/components/admin/analytics/GeoTab';
import { InternalOverviewTab } from '@/components/admin/analytics/InternalOverviewTab';

// Google Analytics 탭
const GA_TABS = [
  { id: 'overview', label: '개요', icon: LayoutDashboard },
  { id: 'users', label: '사용자', icon: Users },
  { id: 'behavior', label: '행동', icon: MousePointerClick },
  { id: 'acquisition', label: '유입', icon: Share2 },
  { id: 'geo', label: '지역', icon: Globe },
];

// 자체 통계 탭
const INTERNAL_TABS = [
  { id: 'internal', label: '자체 통계', icon: Database },
];

// 자체 통계 탭 ID 목록
const INTERNAL_TAB_IDS = INTERNAL_TABS.map((t) => t.id);

function AnalyticsContent() {
  const { period, setPeriod, activeTab, setActiveTab, refreshCurrentTab, isCurrentTabLoading } = useAnalytics();

  const isInternalTab = INTERNAL_TAB_IDS.includes(activeTab);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">애널리틱스</h1>
          <p className="text-muted-foreground">
            {isInternalTab ? '자체 DB 통계' : 'Google Analytics 데이터'}
            {!isInternalTab && isHourPeriod(period) && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                (오늘 기준으로 표시)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 기간 선택 */}
          <div className="flex items-center rounded-lg border bg-card p-1 flex-wrap">
            {PERIODS.map((p) => {
              const isHour = isHourPeriod(p.value);
              const isDisabled = !isInternalTab && isHour;

              return (
                <button
                  key={p.value}
                  onClick={() => !isDisabled && setPeriod(p.value)}
                  disabled={isDisabled}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    period === p.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                    isDisabled && 'opacity-40 cursor-not-allowed hover:text-muted-foreground'
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={refreshCurrentTab}
            disabled={isCurrentTabLoading}
            className="p-2 rounded-lg border hover:bg-accent disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCw className={cn('size-4', isCurrentTabLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {/* GA 탭 */}
          {GA_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}

          {/* 구분선 */}
          <div className="w-px bg-border mx-2 my-2" />

          {/* 자체 통계 탭 (다른 색상) */}
          {INTERNAL_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-amber-600/60 dark:text-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300'
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {/* GA 탭 */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'behavior' && <BehaviorTab />}
        {activeTab === 'acquisition' && <AcquisitionTab />}
        {activeTab === 'geo' && <GeoTab />}
        {/* 자체 통계 탭 */}
        {activeTab === 'internal' && <InternalOverviewTab />}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AnalyticsProvider>
      <AnalyticsContent />
    </AnalyticsProvider>
  );
}
