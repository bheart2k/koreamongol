'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('API 요청 실패');
    return res.json();
  });

const AnalyticsContext = createContext(null);

const STORAGE_KEY = 'koreamongol-analytics-state';

// 시간 단위 (자체 통계 전용)
export const HOUR_PERIODS = [
  { value: '3hours', label: '3시간' },
  { value: '6hours', label: '6시간' },
  { value: '12hours', label: '12시간' },
  { value: '24hours', label: '24시간' },
];

// 일 단위 (공통)
export const DAY_PERIODS = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: '3days', label: '3일' },
  { value: '7days', label: '7일' },
  { value: '14days', label: '14일' },
  { value: '30days', label: '30일' },
  { value: '90days', label: '90일' },
];

// 전체 기간 옵션
export const PERIODS = [...HOUR_PERIODS, ...DAY_PERIODS];

// 시간 단위인지 확인하는 헬퍼
export const isHourPeriod = (period) => HOUR_PERIODS.some((p) => p.value === period);

// localStorage에서 초기값 가져오기
function getInitialState() {
  if (typeof window === 'undefined') {
    return { period: '7days', activeTab: 'overview' };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        period: parsed.period || '7days',
        activeTab: parsed.activeTab || 'overview',
      };
    }
  } catch (e) {
    // localStorage 접근 실패 시 기본값 사용
  }
  return { period: '7days', activeTab: 'overview' };
}

/**
 * AnalyticsProvider
 *
 * @description Lazy Loading 적용 - 활성 탭의 데이터만 fetch
 */
export function AnalyticsProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [period, setPeriodState] = useState('7days');
  const [activeTab, setActiveTabState] = useState('overview');

  // 클라이언트 사이드에서 localStorage 값으로 초기화
  useEffect(() => {
    const initial = getInitialState();
    setPeriodState(initial.period);
    setActiveTabState(initial.activeTab);
    setIsHydrated(true);
  }, []);

  // 상태 변경 시 localStorage에 저장
  const setPeriod = useCallback((value) => {
    setPeriodState(value);
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, period: value }));
    } catch (e) {}
  }, []);

  const setActiveTab = useCallback((value) => {
    setActiveTabState(value);
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, activeTab: value }));
    } catch (e) {}
  }, []);

  // SWR 공통 설정
  const swrConfig = {
    refreshInterval: 60000, // 1분마다 자동 갱신
    revalidateOnFocus: false, // 포커스 시 재검증 비활성화
    dedupingInterval: 30000, // 30초 내 중복 요청 방지
  };

  // 구글 탭용 기간 (시간 단위면 today로 대체)
  const gaPeriod = isHourPeriod(period) ? 'today' : period;

  // 실시간 데이터 (항상 fetch)
  const {
    data: realtimeData,
    error: realtimeError,
    isLoading: realtimeLoading,
  } = useSWR(isHydrated ? '/api/admin/analytics/realtime' : null, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  // 개요 탭 (항상 fetch - 기본 탭이므로)
  const {
    data: overviewData,
    error: overviewError,
    isLoading: overviewLoading,
    mutate: mutateOverview,
  } = useSWR(isHydrated ? `/api/admin/analytics?period=${gaPeriod}` : null, fetcher, swrConfig);

  // 사용자 탭 (lazy loading)
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    mutate: mutateUsers,
  } = useSWR(
    isHydrated && activeTab === 'users' ? `/api/admin/analytics/users?period=${gaPeriod}` : null,
    fetcher,
    swrConfig
  );

  // 행동 탭 (lazy loading)
  const {
    data: behaviorData,
    error: behaviorError,
    isLoading: behaviorLoading,
    mutate: mutateBehavior,
  } = useSWR(
    isHydrated && activeTab === 'behavior' ? `/api/admin/analytics/behavior?period=${gaPeriod}` : null,
    fetcher,
    swrConfig
  );

  // 유입 탭 (lazy loading)
  const {
    data: acquisitionData,
    error: acquisitionError,
    isLoading: acquisitionLoading,
    mutate: mutateAcquisition,
  } = useSWR(
    isHydrated && activeTab === 'acquisition' ? `/api/admin/analytics/acquisition?period=${gaPeriod}` : null,
    fetcher,
    swrConfig
  );

  // 지역 탭 (lazy loading)
  const {
    data: geoData,
    error: geoError,
    isLoading: geoLoading,
    mutate: mutateGeo,
  } = useSWR(
    isHydrated && activeTab === 'geo' ? `/api/admin/analytics/geo?period=${gaPeriod}` : null,
    fetcher,
    swrConfig
  );

  // 자체 통계 탭 (lazy loading)
  const {
    data: internalData,
    error: internalError,
    isLoading: internalLoading,
    mutate: mutateInternal,
  } = useSWR(
    isHydrated && activeTab === 'internal' ? `/api/admin/analytics/internal?period=${period}` : null,
    fetcher,
    swrConfig
  );

  // 현재 탭 새로고침
  const refreshCurrentTab = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        mutateOverview();
        break;
      case 'users':
        mutateUsers();
        break;
      case 'behavior':
        mutateBehavior();
        break;
      case 'acquisition':
        mutateAcquisition();
        break;
      case 'geo':
        mutateGeo();
        break;
      case 'internal':
        mutateInternal();
        break;
    }
  }, [activeTab, mutateOverview, mutateUsers, mutateBehavior, mutateAcquisition, mutateGeo, mutateInternal]);

  // 현재 탭의 로딩 상태
  const isCurrentTabLoading = () => {
    switch (activeTab) {
      case 'overview':
        return overviewLoading;
      case 'users':
        return usersLoading;
      case 'behavior':
        return behaviorLoading;
      case 'acquisition':
        return acquisitionLoading;
      case 'geo':
        return geoLoading;
      case 'internal':
        return internalLoading;
      default:
        return false;
    }
  };

  // hydration 전에는 로딩 표시
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnalyticsContext.Provider
      value={{
        // 기간 & 탭
        period,
        setPeriod,
        activeTab,
        setActiveTab,

        // 실시간
        realtimeData,
        realtimeError,
        realtimeLoading,

        // 개요
        overviewData,
        overviewError,
        overviewLoading,

        // 사용자
        usersData,
        usersError,
        usersLoading,

        // 행동
        behaviorData,
        behaviorError,
        behaviorLoading,

        // 유입
        acquisitionData,
        acquisitionError,
        acquisitionLoading,

        // 지역
        geoData,
        geoError,
        geoLoading,

        // 자체 통계
        internalData,
        internalError,
        internalLoading,

        // 액션
        refreshCurrentTab,
        isCurrentTabLoading: isCurrentTabLoading(),
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}
