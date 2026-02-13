/**
 * SWR 전역 설정
 */

// 기본 fetcher
export const fetcher = (url) => fetch(url).then((res) => res.json());

// SWR 전역 옵션
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,       // 탭 전환 시 자동 갱신 끔
  revalidateOnReconnect: true,    // 네트워크 복구 시 갱신
  dedupingInterval: 60000,        // 1분 내 중복 요청 제거
  errorRetryCount: 3,             // 에러 시 재시도 횟수
  errorRetryInterval: 5000,       // 재시도 간격
  shouldRetryOnError: true,       // 에러 시 재시도
};

// 페이지별 캐시 시간 설정
export const CACHE_TIME = {
  POST_LIST: 60 * 1000,      // 1분
  POST_DETAIL: 30 * 1000,    // 30초
  COMMENTS: 30 * 1000,       // 30초
};
