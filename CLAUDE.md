# KoreaMongol 프로젝트 개발 가이드

## 프로젝트 기본 정보

- **프로젝트명**: KoreaMongol (코리아몽골)
- **비전**: "Таны Солонгос амьдралын хөтөч" (당신의 한국 생활 가이드)
- **도메인**: koreamongol.com
- **기술 스택**: Next.js 15+ (App Router), TailwindCSS v4, Neon PostgreSQL (Drizzle ORM), shadcn/ui, Zustand
- **배포**: Vercel (함수 리전: icn1)
- **타겟**: 한국 체류 몽골인 (E-9 노동자, D-2/D-4 유학생, 예비 이주자)
- **언어**: 몽골어 (키릴 문자) 단일 언어. 다국어(i18n) 없음
- **개발 언어**: JavaScript (TypeScript 미사용)
- **응답 언어**: 모든 응답은 한글로 (코드 주석/변수명은 영어)

### 개발팀 호칭
| 호칭 | 에이전트 | 역할 |
|------|----------|------|
| **코디** | 총괄 (메인) | 코드 실행, 에이전트 조율, 최종 구현 |
| **기획이** | koreamongol-planner | 기능 기획, 페이지 구조, 사용자 시나리오, 우선순위 |
| **검증이** | koreamongol-verifier | 팩트체크, 코드 품질, SEO, 접근성 검증 |
| **프신** | koreamongol-design-reviewer | UI/UX 디자인 구현 및 검증 |

---

## 디자인 시스템

### 컨셉: "Нутаг (고향)" 듀얼 톤
- **가이드 영역**: 세련되고 신뢰감 — 배경 `--bg-sky (#E8F0FE)`
- **커뮤니티 영역**: 따뜻하고 편안한 — 배경 `--bg-warm (#FAF6F0)`

### 컬러
```
Navy (#1B2D4F)       — 메인 브랜드, 헤더, 제목
Gold (#D4A843)       — 포인트, 따뜻함, 로고
Terracotta (#C45B3E) — CTA, 경고, 강조 (= accent)
Sky (#E8F0FE)        — 가이드 배경
Warm (#FAF6F0)       — 커뮤니티 배경
```

### 폰트
- **제목**: Inter (Cyrillic subset) — `font-heading`
- **본문**: Noto Sans (Cyrillic subset, Ө/Ү 지원) — `font-sans`

### 로고
텍스트 로고: **Korea**`(navy)` + **Mongol**`(gold)` (Inter Bold)

### 아이콘
- Lucide Icons 사용
- 기본: navy / 호버: gold / stroke-width: 2px

### 상세 비주얼 가이드
`docs/koreamongol-design-guide.html` 참조

---

## 절대 원칙

### 서버/빌드 관련
- **빌드(pnpm build) 실행 금지** — 사용자가 직접 확인함
- **개발 서버(pnpm dev) 실행 금지** — 사용자가 dev.bat으로 직접 실행
- **서버는 항상 http://localhost:5005 에서 실행 중**이라고 가정

### 사용자 피드백 처리
1. **사용자가 문제가 있다고 하면 무조건 먼저 확인** — 내 코드가 맞다고 단정짓지 않는다
2. **이미지가 있으면 이미지를 꼼꼼히 본다** — 애매하면 먼저 질문한다
3. **추측으로 작업하지 않는다** — 모르면 모른다고 하고, 필요하면 검색한다
4. **내 판단보다 사용자 말을 우선한다**

### 거짓말 금지
- **모르는 것은 모른다고 한다**
- **구체적 숫자, 기능, UI 경로를 확인 없이 지어내지 않는다**
- **외부 서비스(Google Cloud 등) 정보는 반드시 검색 후 답변한다**

### ⚠️ 실제 정보(전화번호, 주소, URL 등) — 최우선 원칙
- **전화번호, 주소, 이메일, 공식 URL, 영업시간, 요금 등 실제 세계의 팩트 정보는 절대로 추측하거나 지어내지 않는다**
- **반드시 검색으로 확인한 후에만 코드에 작성한다**
- **확인이 안 되면 빈 값이나 플레이스홀더(`TODO: 확인 필요`)로 남기고, 사용자에게 확인을 요청한다**
- **이 사이트는 정보 제공 사이트다. 잘못된 정보는 사용자에게 실질적 피해를 준다. 대사관 번호 하나 틀리면 급한 사람이 연락을 못 한다.**
- **"대충 맞겠지"는 없다. 100% 확인된 정보만 적는다.**

---

## 개발 원칙

### 렌더링 전략 (SSG/SSR 우선 — 절대 규칙)

**page.jsx에 `'use client'`를 직접 쓰지 않는다.** 인터랙션이 필요하면 서버 page.jsx + 클라이언트 래퍼로 분리한다.

| 페이지 유형 | 렌더링 | 이유 |
|------------|--------|------|
| 가이드 (visa, arrival 등) | **SSG** | 정적 콘텐츠, SEO 핵심 |
| about, faq, contact | **SSG** | 정적 콘텐츠 |
| 메인 | **SSG** or **ISR(태그)** | 커뮤니티 미리보기 추가 시 태그 방식 ISR |
| 커뮤니티 목록/상세 | **ISR(태그)** | 글 작성/수정/삭제 시 on-demand revalidate |
| 관리자 (admin/*) | CSR 허용 | SEO 불필요, robots.txt 차단 |
| mypage, 글쓰기 | CSR 허용 | 인증 필수, SEO 불필요 |

**ISR은 태그 기반(on-demand) 우선 사용.** 시간 기반(`revalidate = N`)은 지양한다.
```js
// 서버 컴포넌트에서 fetch 시 태그 지정
fetch(url, { next: { tags: ['posts', `board-${boardType}`] } });

// 또는 unstable_cache + revalidateTag 조합
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

// 데이터 조회 (태그 지정)
const getPosts = unstable_cache(async (boardType) => { ... }, ['posts'], {
  tags: ['posts', `board-${boardType}`],
});

// 글 작성/수정/삭제 API에서 캐시 무효화
revalidateTag('posts');
revalidateTag(`board-${boardType}`);
```

**서버/클라이언트 분리 패턴:**
```
// page.jsx (서버 컴포넌트) — metadata export 가능
export const metadata = { ... };
export default function Page() {
  return <ClientWrapper />;  // 또는 서버에서 데이터 fetch 후 전달
}

// ClientWrapper.jsx ('use client') — 인터랙션 담당
```

**SEO 필수 요소 (새 페이지 생성 시 반드시 포함):**
- layout.js 또는 page.jsx에 `metadata` (title, description, openGraph, twitter)
- `alternates.canonical` URL
- `openGraph.images`
- `BreadcrumbJsonLd` (가이드/커뮤니티 페이지)
- 가이드 페이지에 절차가 있으면 `HowToJsonLd`
- 커뮤니티 게시글에 `generateMetadata` + `ArticleJsonLd`

### 높이 설정
- `min-h-screen`, `h-screen` 대신 `min-h-content`, `h-content` 사용 (네비바 높이 제외)

### max-width 규칙
- **6xl (1152px)**: 넓은 레이아웃 — navbar, footer, hero, 카드 그리드
- **4xl (896px)**: 중간 레이아웃 — 가이드 본문, 커뮤니티 본문
- **2xl (672px)**: 좁은 레이아웃 — mypage, 폼, 모달

### 사용자 표시명
- `user.nickname` 사용 — `user.name` 직접 노출 금지 (실명/이메일 위험)

### 다이얼로그
- `ConfirmDialog`, `SimpleAlertDialog` 사용 (`@/components/ui/confirm-dialog`)
- AlertDialog 직접 조합 금지

### 토스트
- `import { toast } from 'sonner';`
- 모든 작업 완료/실패 시 토스트 필수
- `toast.success()`: 생성/수정/저장 성공
- `toast.error()`: 삭제 성공, 실패/오류 (파괴적 행동 = 빨간색)
- `toast.warning()`: 주의/경고
- `toast.info()`: 정보 안내

### 색상
- 하드코딩 금지 — CSS 변수/테마 사용

### 파일
- 300줄 초과 시 분리 고려
- 추가 기능은 사용자 승인 후 구현

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.js            # 루트 레이아웃 (Inter + Noto Sans, lang="mn")
│   ├── page.js              # 메인 페이지
│   ├── visa/                # [MVP] 비자 가이드
│   ├── arrival/             # [MVP] 도착 후 가이드
│   ├── hospital/            # [MVP] 병원/응급 가이드
│   ├── money/               # [MVP] 송금/환율 가이드
│   ├── korean-life/         # [MVP] 실전 한국어 & 문화 가이드
│   ├── community/           # 커뮤니티 게시판
│   ├── admin/               # 관리자
│   ├── about/               # 소개
│   ├── faq/                 # FAQ
│   ├── contact/             # 문의
│   ├── feedback/            # 피드백
│   ├── mypage/              # 마이페이지
│   ├── privacy/             # 개인정보처리방침
│   ├── terms/               # 이용약관
│   └── api/                 # API 라우트
├── components/
│   ├── ui/                  # shadcn/ui 컴포넌트
│   ├── layout/              # navbar, footer, mobile-menu
│   ├── editor/              # Lexical 리치 텍스트 에디터
│   ├── community/           # 커뮤니티 컴포넌트
│   ├── admin/               # 관리자 컴포넌트
│   ├── guide/               # [MVP] 가이드 전용 컴포넌트
│   │   ├── GuideCard        # 메인 가이드 카드
│   │   ├── StepList         # 단계별 안내
│   │   ├── CheckList        # 체크리스트
│   │   ├── WarningBox       # 주의사항 (terracotta)
│   │   ├── TipBox           # 꿀팁 (gold)
│   │   ├── EmergencyBanner  # 긴급연락처
│   │   ├── InfoTable        # 비교표
│   │   └── LinkCard         # 외부 링크 카드
│   ├── seo/                 # JsonLd 등
│   └── faq/                 # FAQ 컴포넌트
├── lib/
│   ├── db/                  # Neon PostgreSQL + Drizzle ORM
│   ├── auth.js              # NextAuth (Google OAuth)
│   └── utils.js             # 유틸리티
├── hooks/                   # 커스텀 훅
├── store/                   # Zustand 스토어
└── data/                    # 정적 데이터
```

---

## MVP 가이드 페이지 (Phase 1 우선순위)

1. `/visa` — 비자 가이드 (E-9, D-2, D-4 등)
2. `/arrival` — 도착 후 필수 가이드 (외국인등록, 은행, 폰)
3. `/hospital` — 병원/응급 가이드
4. `/money` — 송금/환율 가이드
5. `/korean-life` — 실전 한국어 & 문화 (킬러 콘텐츠)

상세 기획: `docs/koreamongol-mvp-plan.md` 참조

---

## DB 작업

### CLI 도구
`scripts/db.mjs` — .env.local 자동 로딩. `node scripts/db.mjs tables|describe|count|query|push`

### Claude용 DB 스크립트 작성 샘플

DB 조회/수정/테이블 생성 등 일회성 스크립트가 필요할 때 아래 패턴을 복사해서 쓸 것. **매번 env 로딩이나 neon API 사용법으로 삽질하지 말 것.**

```js
// ===== 일회성 DB 스크립트 템플릿 =====
// 실행: cd /c/workspace/koreamongol && node scripts/tmp.mjs

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// .env.local 로딩
const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  const k = t.slice(0, i).trim();
  let v = t.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
    v = v.slice(1, -1);
  process.env[k] ??= v;
}

const sql = neon(process.env.DATABASE_URL);

// --- neon 사용법 ---
// Tagged template (값 바인딩 자동):
//   const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
//
// 동적 쿼리 (테이블명 등 변수 포함):
//   const rows = await sql.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
//
// DDL (CREATE TABLE 등):
//   await sql`CREATE TABLE IF NOT EXISTS foo (id SERIAL PRIMARY KEY, name TEXT)`;
//
// INSERT:
//   await sql`INSERT INTO inbox (type, subject, content) VALUES (${type}, ${subj}, ${body})`;

// --- 여기에 실제 작업 작성 ---
async function main() {
  const rows = await sql`SELECT COUNT(*) as cnt FROM users`;
  console.log('users:', rows[0].cnt);
}

main().catch(e => { console.error(e); process.exit(1); });
```

**핵심 규칙:**
- `sql\`...\`` = tagged template. 값 바인딩은 `${변수}`로 자동 처리
- `sql.query("...", [args])` = 동적 테이블명 등 conventional 호출
- `sql("...")` ← **이거 안 됨!** 반드시 위 두 가지 중 하나 사용
- drizzle-kit push는 인터랙티브 프롬프트가 있어서 자동화 불가 → DDL은 위 방식으로 직접 실행

---

## 참고 문서

- **MVP 기획서**: `docs/koreamongol-mvp-plan.md`
- **디자인 가이드**: `docs/koreamongol-design-guide.html`
