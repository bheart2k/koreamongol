/**
 * IndexNow — URL 변경을 Bing/Yandex/Naver 등 참여 검색엔진에 즉시 통보
 *
 * 키 검증: https://koreamongol.com/{INDEXNOW_KEY}.txt 파일 내용이 키와 같아야 한다.
 * (public/{INDEXNOW_KEY}.txt — 키를 바꾸면 파일명·내용도 함께 바꿀 것)
 */

const BASE_URL = 'https://koreamongol.com';
const HOST = 'koreamongol.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000; // IndexNow 1회 제출 상한

export const INDEXNOW_KEY = 'fb0274df10f58469c5c23ba2b4712c02';
export const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

/** '/community/blog/12' → 'https://koreamongol.com/community/blog/12' */
export function toAbsoluteUrl(pathOrUrl) {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/**
 * URL 목록을 IndexNow에 제출한다.
 * 색인 통보는 부가 기능이므로 실패해도 절대 throw 하지 않는다 (호출부 흐름 보호).
 *
 * @param {string[]} urls - 절대 URL 또는 '/'로 시작하는 경로
 * @returns {Promise<{ ok: boolean, status?: number, submitted: number, skipped?: string, error?: string }>}
 */
export async function submitToIndexNow(urls) {
  const list = [...new Set((urls || []).filter(Boolean).map(toAbsoluteUrl))]
    .filter((url) => url.startsWith(BASE_URL))
    .slice(0, MAX_URLS);

  if (list.length === 0) {
    return { ok: false, submitted: 0, error: '제출할 URL이 없습니다.' };
  }

  // 로컬/프리뷰에서는 실제 제출하지 않는다 (프로덕션 도메인 URL만 유효)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[IndexNow] 개발 환경 — 제출 생략:', list);
    return { ok: true, submitted: 0, skipped: 'non-production' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      cache: 'no-store',
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: list,
      }),
    });

    // 200 OK / 202 Accepted 모두 정상 (202 = 키 검증 대기)
    const ok = res.status === 200 || res.status === 202;
    if (!ok) {
      console.error(`[IndexNow] 제출 실패 (${res.status}):`, await res.text().catch(() => ''));
    }
    return { ok, status: res.status, submitted: ok ? list.length : 0 };
  } catch (error) {
    console.error('[IndexNow] 제출 오류:', error);
    return { ok: false, submitted: 0, error: error.message };
  }
}
