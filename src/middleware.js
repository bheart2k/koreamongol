import { NextResponse } from 'next/server';
// TODO: 관리자 인증 활성화 시 주석 해제
// import { auth } from '@/lib/auth';

/**
 * KoreaMongol 미들웨어
 * 1. 관리자 페이지 인증
 * 2. API Rate Limiting (IP 기반)
 * 3. 봇/악성 요청 차단
 */

// Rate Limit 저장소 (메모리 기반, 서버리스 환경에서는 요청 간 초기화될 수 있음)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX_API = 60; // API: 분당 60회
const RATE_LIMIT_MAX_AUTH = 10; // 인증: 분당 10회
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

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|css|js)$).*)',
  ],
};
