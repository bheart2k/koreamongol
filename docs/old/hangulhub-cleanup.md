# HangulHub 잔여 참조 정리 목록

> 검색일: 2026-02-14
> 검색 패턴: `한글허브`, `HangulHub`, `hangulhub`, `hangulhub.co.kr`

## 임시 설정 (되돌려야 할 것)

### 관리자 인증 우회
- **파일:** `src/app/admin/layout.jsx`
- **내용:** Google OAuth 인증 로직을 주석 처리하고, 더미 세션으로 대체
- **이유:** Google OAuth 설정이 아직 완료되지 않음 (프로젝트 할당량 문제)
- **원복 조건:** Google Cloud 프로젝트 할당량 승인 + OAuth 동의 화면 설정 완료 후
- **원복 방법:** 주석 해제하고 더미 세션 줄 삭제

### 미들웨어 관리자 인증
- **파일:** `src/middleware.js`
- **내용:** 관리자 페이지 인증 체크와 auth import 주석 처리
- **원복 조건:** Google OAuth 설정 완료 후 (admin/layout.jsx와 동시에 원복)
- **원복 방법:** auth import 주석 해제, 관리자 인증 블록 주석 해제

### 커뮤니티 네비게이션 숨김
- **파일:** `src/components/layout/nav-items.js`
- **내용:** `navItems` 배열을 빈 배열로 설정, 기존 커뮤니티 드롭다운 주석 처리
- **원복 조건:** 커뮤니티 기능 구현 완료 후
- **원복 방법:** 주석 해제

---

## 완료된 항목 ✓

### 단순 치환 (5개)
- ✓ `src/app/admin/layout.jsx` — 메타데이터 + 인증 우회
- ✓ `src/app/admin/images/page.jsx` — KoreaMongol로 교체
- ✓ `src/components/editor/LexicalViewer.jsx` — namespace 교체
- ✓ `src/components/editor/themes/editorTheme.js` — 주석 교체
- ✓ `src/components/admin/analytics/AnalyticsContext.jsx` — STORAGE_KEY 교체

### 메타데이터 + BASE_URL 교체 (5개)
- ✓ `src/app/about/layout.jsx` — 몽골어 메타데이터, koreamongol.com
- ✓ `src/app/contact/layout.jsx` — 몽골어 메타데이터, koreamongol.com
- ✓ `src/app/community/layout.jsx` — 몽골어 메타데이터, koreamongol.com
- ✓ `src/app/community/[boardType]/layout.jsx` — 몽골어 메타데이터, koreamongol.com
- ✓ `src/app/community/[boardType]/[postId]/layout.jsx` — 몽골어 메타데이터, koreamongol.com

### 페이지 전환 (6개)
- ✓ `src/app/about/page.jsx` — KoreaMongol 소개로 전환, isKo 제거
- ✓ `src/app/terms/page.jsx` — KoreaMongol 이용약관, 몽골어 단일
- ✓ `src/app/privacy/page.jsx` — KoreaMongol 개인정보처리방침, 몽골어 단일
- ✓ `src/app/contact/page.jsx` — KoreaMongol 문의페이지, FAQ 교체, 이메일 교체
- ✓ `src/app/feedback/page.jsx` — KoreaMongol 피드백, 몽골어 단일
- ✓ `src/app/community/[boardType]/page.jsx` — boardConfig 몽골어, isKo/locale 제거

### 네비게이션
- ✓ `src/components/layout/nav-items.js` — 커뮤니티 메뉴 숨김 (나중에 활성화)
