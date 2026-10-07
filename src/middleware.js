import { NextResponse } from 'next/server';
import {
  checkDesignLabAuth, DESIGN_LAB_CHALLENGE, isDesignLabOptimizerUrl, isDesignLabPath,
} from '@/lib/design-lab-auth';
// TODO: 관리자 인증 활성화 시 주석 해제
// import { auth } from '@/lib/auth';

/**
 * KoreaMongol 미들웨어
 * 1. 관리자 페이지 인증
 * 2. API Rate Limiting (IP 기반)
 * 3. 봇/악성 요청 차단
 * 4. /design-lab 비밀번호 잠금 (페이지 + 정적 파일)
 */

// Rate Limit 저장소 (메모리 기반, 서버리스 환경에서는 요청 간 초기화될 수 있음)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX_API = 60; // API: 분당 60회
const RATE_LIMIT_MAX_AUTH = 60; // 인증: 분당 60회 (ClientFetchError 방지를 위해 완화)
const RATE_LIMIT_MAX_WRITE = 10; // 쓰기(POST/PUT/DELETE): 분당 10회

// 주기적으로 만료된 항목 정리
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, data] of rateLimitMap) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(key);
    }
  }
}

function checkRateLimit(key, maxRequests) {
  const now = Date.now();
  const data = rateLimitMap.get(key);

  if (!data || now - data.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  data.count++;
  if (data.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - data.count };
}

const DESIGN_LAB_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' };

// 차단할 User-Agent 패턴
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /nuclei/i,
  /zgrab/i,
];

// 차단할 경로 패턴 (공격 탐지)
const BLOCKED_PATH_PATTERNS = [
  /\.\.\//, // Path traversal
  /\.(php|asp|aspx|jsp|cgi|env|git|sql|bak|old)$/i, // 위험한 확장자
  /wp-admin|wp-login|wp-content/i, // WordPress 스캔
  /phpmyadmin|phpinfo/i, // PHP 스캔
  /\.well-known\/(?!acme)/i, // .well-known 악용 (ACME 제외)
  /eval\(|union\s+select|<script/i, // 인젝션 시도
];

function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || '';

  // ──────────────────────────────
  // 0. 이미지 최적화기: design-lab 파일을 가리키면 404 (Basic Auth 우회 차단), 그 외는 기존처럼 그대로 통과
  // ──────────────────────────────
  if (pathname === '/_next/image') {
    if (isDesignLabOptimizerUrl(request.nextUrl.searchParams.get('url'), request.url)) {
      return new NextResponse(null, { status: 404, headers: DESIGN_LAB_HEADERS });
    }
    return NextResponse.next();
  }

  // ──────────────────────────────
  // 1. 악성 User-Agent 차단
  // ──────────────────────────────
  if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse(null, { status: 403 });
  }

  // ──────────────────────────────
  // 2. 악성 경로 차단
  // ──────────────────────────────
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // ──────────────────────────────
  // 2-1. /design-lab 비밀번호 잠금 (HTTP Basic, 비밀번호는 DESIGN_LAB_PASSWORD)
  // ──────────────────────────────
  const isDesignLab = isDesignLabPath(pathname);
  if (isDesignLab) {
    // 연속 실패 차단은 두지 않는다: 브라우저·비밀번호 관리자가 자동으로 연달아 시도하면
    // 사용자가 입력하기도 전에 잠겨 버린다(2026-10-08 운영에서 0.4초 만에 10회 → 429).
    // 비밀번호가 무작위 8자리라 무차별 대입 위험은 낮고, 인스턴스 메모리 카운터는 Vercel 에서 신뢰할 수 없다.
    const authorization = request.headers.get('authorization');
    const password = process.env.DESIGN_LAB_PASSWORD;

    const result = checkDesignLabAuth({
      authorization,
      password,
      isProduction: process.env.NODE_ENV === 'production',
    });

    if (!result.ok) {
      if (result.status === 404) {
        return new NextResponse(null, { status: 404, headers: DESIGN_LAB_HEADERS });
      }
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { ...DESIGN_LAB_HEADERS, 'WWW-Authenticate': DESIGN_LAB_CHALLENGE },
      });
    }
  }

  // ──────────────────────────────
  // 3. API Rate Limiting
  // ──────────────────────────────
  if (pathname.startsWith('/api/')) {
    // 주기적 정리 (100회마다)
    if (rateLimitMap.size > 1000) cleanupRateLimit();

    // 인증 API는 더 엄격하게
    if (pathname.startsWith('/api/auth/')) {
      const { allowed } = checkRateLimit(`auth:${ip}`, RATE_LIMIT_MAX_AUTH);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    }
    // 쓰기 요청은 별도 제한
    else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const { allowed } = checkRateLimit(`write:${ip}`, RATE_LIMIT_MAX_WRITE);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    }
    // 일반 API
    else {
      const { allowed } = checkRateLimit(`api:${ip}`, RATE_LIMIT_MAX_API);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    }
  }

  // ──────────────────────────────
  // 4. 관리자 페이지 인증
  // ──────────────────────────────
  // TODO: Google OAuth 설정 완료 후 주석 해제 (admin/layout.jsx 우회도 같이 원복)
  // if (pathname.startsWith('/admin')) {
  //   const session = await auth();
  //
  //   if (!session?.user) {
  //     const signInUrl = new URL('/api/auth/signin', request.url);
  //     signInUrl.searchParams.set('callbackUrl', pathname);
  //     return NextResponse.redirect(signInUrl);
  //   }
  //
  //   if (session.user.grade > 20) {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  // ──────────────────────────────
  // 5. 보안 헤더 추가
  // ──────────────────────────────
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  if (isDesignLab) response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    // design-lab 은 이미지·영상·JSON 등 정적 파일까지 잠그기 위해 확장자 제외 패턴과 별도로 매칭
    '/design-lab',
    '/design-lab/:path*',
    '/_next/image', // url 이 design-lab 을 가리키는 최적화 요청만 차단 (위 0단계)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|css|js)$).*)',
  ],
};
