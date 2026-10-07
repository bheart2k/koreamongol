/**
 * /design-lab 비밀번호 잠금 판정 (HTTP Basic Auth)
 * - 미들웨어(Edge 런타임)와 node 양쪽에서 동작하는 순수 함수만 둔다 (atob · TextDecoder)
 * - 사용자명은 무엇이든 허용하고 비밀번호만 비교한다
 * - 비밀번호는 환경변수 DESIGN_LAB_PASSWORD (코드에 두지 않음)
 */

export const DESIGN_LAB_CHALLENGE = 'Basic realm="KoreaMongol design-lab", charset="UTF-8"';

export function isDesignLabPath(pathname) {
  return pathname === '/design-lab' || pathname.startsWith('/design-lab/');
}

// 이미지 최적화기(/_next/image?url=…)가 design-lab 파일을 가리키는지.
// 퍼센트 인코딩·점 경로(/x/../design-lab)를 풀어서 본다. design-lab 안에는 최적화기를 쓰는 곳이 없으므로 무조건 차단 대상.
export function isDesignLabOptimizerUrl(rawUrl, base) {
  if (typeof rawUrl !== 'string' || !rawUrl) return false;
  try {
    let pathname = new URL(rawUrl, base).pathname;
    for (let i = 0; i < 3; i++) {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) break;
      pathname = new URL(decoded, base).pathname;
    }
    return isDesignLabPath(pathname.toLowerCase());
  } catch {
    return false;
  }
}

// Authorization 헤더에서 비밀번호만 꺼낸다. 형식이 틀리면 null
export function parseBasicPassword(header) {
  if (typeof header !== 'string') return null;
  const match = /^Basic\s+([A-Za-z0-9+/=]+)\s*$/i.exec(header);
  if (!match) return null;
  try {
    // charset="UTF-8" 요청에 맞춰 바이트를 UTF-8 로 복원 (비ASCII 비밀번호 대응)
    const binary = atob(match[1]);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const sep = decoded.indexOf(':');
    return sep === -1 ? null : decoded.slice(sep + 1);
  } catch {
    return null;
  }
}

// 입력 길이와 무관하게 정답 길이만큼 항상 같은 횟수로 비교 (조기 종료 없음)
export function safeEqual(input, expected) {
  let diff = input.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) {
    const c = i < input.length ? input.charCodeAt(i) : 0;
    diff |= c ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * @param {{ authorization?: string | null, password?: string, isProduction: boolean }} opts
 * @returns {{ ok: true } | { ok: false, status: 401 | 404 }}
 */
export function checkDesignLabAuth({ authorization, password, isProduction }) {
  if (!password) {
    // 운영에서 환경변수 누락 → 공개되지 않도록 숨김 / 로컬 개발은 잠그지 않음
    return isProduction ? { ok: false, status: 404 } : { ok: true };
  }
  const given = parseBasicPassword(authorization);
  if (given !== null && safeEqual(given, password)) return { ok: true };
  return { ok: false, status: 401 };
}
