/**
 * SWR 커스텀 훅 모음
 */
import useSWR from 'swr';
import { fetcher, CACHE_TIME } from './config';

/**
 * 게시글 목록 조회
 * @param {Object} params
 * @param {string} params.boardType - 게시판 타입
 * @param {number} params.page - 페이지 번호
 * @param {string} [params.search] - 검색어
 * @param {number} [params.limit] - 페이지당 개수
 */
export function usePosts({ boardType, page = 1, search = '', limit = 15 }) {
  const queryParams = new URLSearchParams({
    boardType,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    queryParams.set('search', search);
  }

  const key = `/api/posts?${queryParams}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    dedupingInterval: CACHE_TIME.POST_LIST,
    revalidateOnFocus: false,
  });

  return {
    posts: data?.data || [],
    pagination: data?.pagination || { page: 1, totalPages: 1, total: 0 },
    isLoading,
    isValidating,  // 백그라운드 갱신 중
    error: error || (data?.success === false ? data.error : null),
    mutate,
  };
}

/**
 * 게시글 상세 조회
 * @param {string} postId - 게시글 ID
 * @param {Object} options
 * @param {boolean} [options.countView] - 조회수 카운트 여부
 */
export function usePost(postId, { countView = true } = {}) {
  const key = postId ? `/api/posts/${postId}${countView ? '' : '?noCount=1'}` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    dedupingInterval: CACHE_TIME.POST_DETAIL,
    revalidateOnFocus: false,
  });

  return {
    post: data?.data || null,
    isLoading,
    error: error || (data?.success === false ? data.error : null),
    mutate,
  };
}

/**
 * 댓글 목록 조회
 * @param {string} postId - 게시글 ID
 */
export function useComments(postId, boardType) {
  const params = new URLSearchParams();
  if (postId) params.set('postId', postId);
  if (boardType) params.set('boardType', boardType);
  const key = postId ? `/api/comments?${params}` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    dedupingInterval: CACHE_TIME.COMMENTS,
    revalidateOnFocus: false,
  });

  return {
    comments: data?.data || [],
    isLoading,
    error: error || (data?.success === false ? data.error : null),
    mutate,
  };
}
