# KoreaMongol v1 배포 요약

> 배포일: 2026-02-14
> 브랜치: main (5 commits)
> 도메인: koreamongol.com

---

## 커밋 히스토리

| 커밋 | 내용 |
|------|------|
| `cc26633` | KoreaMongol 초기 프로젝트 세팅 (HangulHub 기반 전환) |
| `8ccb4bb` | 파비콘 등 기본 설정 |
| `af11cf2` | 기본 세팅3 |
| `50b5f22` | 1 |
| `c8fec64` | 네이버 검색 인증 |

---

## 1. 초기 전환 작업 (HangulHub → KoreaMongol)

- 프로젝트명, 브랜딩, 언어를 모두 몽골어(키릴) 기준으로 전환
- 디자인 시스템 적용: Navy/Gold/Terracotta/Sky/Warm 컬러 체계
- 폰트: Inter (제목) + Noto Sans Cyrillic (본문)
- 기존 HangulHub 잔여 코드 정리 (16개 파일)
- 정리 기록: `docs/old/hangulhub-cleanup.md`

---

## 2. 페이지 구조

### MVP 가이드 페이지 (신규 생성)
| 경로 | 설명 | 렌더링 |
|------|------|--------|
| `/visa` | 비자 가이드 (E-9, D-2, D-4) | SSG |
| `/arrival` | 도착 후 필수 가이드 (외국인등록, 은행, 폰) | SSG |
| `/hospital` | 병원/응급 가이드 | SSG |
| `/money` | 송금/환율 가이드 | SSG |
| `/korean-life` | 실전 한국어 & 문화 가이드 | SSG |

### 기존 페이지 (리팩토링)
| 경로 | 변경 내용 |
|------|-----------|
| `/` (메인) | 서버/클라이언트 분리 (page.jsx + HomeContent.jsx) |
| `/about` | 서버/클라이언트 분리 (page.jsx + AboutContent.jsx) |
| `/contact` | 서버/클라이언트 분리 (page.jsx + ContactContent.jsx), inbox API로 전환 |
| `/community` | 서버/클라이언트 분리 (page.jsx + CommunityContent.jsx) |
| `/community/[boardType]` | 서버/클라이언트 분리 (page.jsx + BoardListClient.jsx) |
| `/faq` | 유지 |
| `/privacy`, `/terms` | 도메인 변경 반영 |

### 삭제된 페이지
| 경로 | 사유 |
|------|------|
| `/feedback` | inbox로 통합 |

---

## 3. 가이드 컴포넌트 시스템 (`src/components/guide/`)

| 컴포넌트 | 용도 |
|----------|------|
| `GuideHero` | 가이드 페이지 상단 히어로 |
| `GuideNav` | 가이드 간 네비게이션 |
| `GuideTOC` | 목차 (Table of Contents) |
| `StepList` | 단계별 안내 |
| `CheckList` | 체크리스트 |
| `WarningBox` | 주의사항 (terracotta) |
| `TipBox` | 꿀팁 (gold) |
| `EmergencyBanner` | 긴급 연락처 배너 |
| `InfoTable` | 비교표 |
| `LinkCard` | 외부 링크 카드 |
| `LanguageCard` | 한국어 표현 카드 |
| `CultureCard` | 문화 팁 카드 |
| `ReportBanner` | 신고 안내 배너 |
| `ReportDialog` | 신고 다이얼로그 |

---

## 4. 가이드 데이터 (`src/data/guides/`)

| 파일 | 내용 |
|------|------|
| `visa.js` | 비자 종류별 정보 (E-9, D-2, D-4 등) |
| `arrival.js` | 도착 후 절차 (외국인등록, 은행, 통신) |
| `hospital.js` | 병원/응급 정보 |
| `money.js` | 송금/환율 정보 |
| `korean-life.js` | 실전 한국어 & 문화 |
| `common.js` | 공통 데이터 (긴급 연락처 등) |

---

## 5. DB 변경

### 새 테이블
- `inbox` — contact_messages + feedback + reports 통합
- `comment_likes` — 댓글 좋아요

### 삭제된 테이블 (스키마에서 제거)
- `contact_messages` → inbox로 통합
- `feedback` → inbox로 통합

### DB 도구
- `scripts/db.mjs` 추가 (tables/describe/count/query/push CLI)
- package.json에 DB 스크립트 명령어 추가

---

## 6. API 변경

### 신규
| 경로 | 설명 |
|------|------|
| `/api/inbox` | 통합 인박스 (문의/피드백/신고) 제출 |
| `/api/admin/inbox` | 관리자 인박스 관리 |
| `/api/comments/[id]/like` | 댓글 좋아요 |

### 삭제
| 경로 | 사유 |
|------|------|
| `/api/contact` | inbox로 통합 |
| `/api/feedback` | inbox로 통합 |
| `/api/admin/contacts` | inbox로 통합 |
| `/api/admin/feedback` | inbox로 통합 |

---

## 7. 관리자 변경

- `/admin/contacts` + `/admin/feedback` → `/admin/inbox` 통합
- AdminShell 사이드바 메뉴 업데이트

---

## 8. SEO & 메타

- `src/app/manifest.js` — PWA 매니페스트 추가
- `src/app/icon.svg`, `src/app/apple-icon.svg` — SVG 파비콘
- `src/app/favicon.ico` — 삭제 (SVG로 대체)
- `src/app/sitemap.js` — 가이드 페이지 URL 추가
- `src/app/robots.js` — 도메인 업데이트
- 네이버 사이트 인증 파일 추가
- 각 가이드 페이지 layout.js에 metadata 포함

---

## 9. 기타 변경

- `src/components/layout/nav-items.js` — 가이드 메뉴 추가, 커뮤니티 숨김
- `src/components/layout/layout-shell.jsx` — 레이아웃 쉘 추가
- `src/components/seo/JsonLd.jsx` — 구조화 데이터 컴포넌트
- `src/components/community/CommentItem.jsx` — 좋아요 기능 추가
- `src/app/globals.css` — 가이드 관련 스타일 추가
- `docs/` 폴더 정리 (old/, new/ 하위 디렉토리로 이동)

---

## 10. 현재 상태

- **브랜치**: main (clean, origin과 동기화)
- **커뮤니티**: nav에서 숨김 (나중에 활성화)
- **관리자 인증**: 임시 우회 중 (Google OAuth 할당량 대기)
- **가이드 콘텐츠**: 데이터 파일 기반 구조 완성, 상세 내용은 추가 필요
