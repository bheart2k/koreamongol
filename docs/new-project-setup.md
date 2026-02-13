# 신규 프로젝트 세팅 가이드

> 이 템플릿을 복제해서 새 프로젝트를 시작할 때 반드시 변경해야 할 항목들.

---

## 1. 환경변수 (.env.local)

```bash
cp .env.example .env.local
```

모든 값을 새 프로젝트용으로 발급받아 채워야 함.

### ⚠️ NEXTAUTH_SECRET — 세션 충돌 주의
- **프로젝트마다 반드시 다른 값 사용**
- 같은 시크릿을 쓰는 프로젝트가 동시에 localhost에서 돌아가면 로그인 세션이 서로 충돌해서 풀림
- 생성 방법: `openssl rand -base64 32`

### NEXTAUTH_URL
- 개발 포트가 겹치지 않게 설정 (예: 5005, 5006, 5007...)
- `package.json`의 dev 스크립트 포트와 일치시킬 것

---

## 2. 즉시 변경 항목

### package.json
- `name`: 프로젝트명으로 변경
- `dev` 스크립트: 포트 번호 변경

### next.config.js
- `images.remotePatterns`: 새 R2 public URL로 변경

### src/app/layout.jsx
- `metadata`: 사이트명, 설명, URL 변경
- `lang`: 필요시 변경 (현재 `mn`)
- 폰트: 필요시 변경

### src/components/ui/logo.jsx
- 로고 텍스트/디자인 변경

### src/components/layout/nav-items.js
- 메뉴 항목 변경

### src/components/layout/footer.jsx
- 사이트 설명, 연락처 변경
- **전화번호/주소 등 실제 정보는 반드시 검색해서 확인 후 입력**

### src/app/globals.css
- 컬러 팔레트 변경

### CLAUDE.md
- 프로젝트 정보 전면 수정

---

## 3. 미들웨어 (src/middleware.js)

인증과 보안을 미들웨어에서 일괄 처리하는 구조.

### 포함된 기능
- **악성 요청 차단**: 스캔 도구 UA, path traversal, PHP/WordPress 스캔 등
- **Rate Limiting**: API 분당 60회, 인증 분당 10회, 쓰기 분당 10회
- **관리자 인증**: `/admin` 접근 시 세션 + grade 체크
- **보안 헤더**: X-Content-Type-Options, X-Frame-Options, XSS-Protection 등

### 새 프로젝트에서 확인할 것
- OAuth 미설정 시 관리자 인증 블록 주석 처리 필요 (현재 주석 상태)
- OAuth 설정 완료 후 주석 해제 + `auth` import 주석 해제
- `admin/layout.jsx`의 인증 체크는 제거 (미들웨어에서 처리하므로 중복 불필요)
- layout에서는 `auth()`로 session만 가져와서 컴포넌트에 prop 전달

---

## 4. Google OAuth 설정

1. Google Cloud Console에서 새 OAuth 클라이언트 생성
2. 승인된 리디렉션 URI: `http://localhost:{포트}/api/auth/callback/google`
3. OAuth 동의 화면 → 앱 이름, 로고 설정 (안 바꾸면 이전 프로젝트 이름이 로그인 화면에 뜸)
4. `.env.local`에 CLIENT_ID, CLIENT_SECRET 입력

---

## 5. Neon DB 설정

1. Neon 콘솔에서 새 프로젝트/DB 생성
2. `.env.local`에 DATABASE_URL 입력
3. `pnpm db:push`로 스키마 반영

---

## 6. Cloudflare R2 설정

1. Cloudflare 대시보드에서 새 버킷 생성
2. API 토큰 발급 (R2 읽기/쓰기)
3. `.env.local`에 R2 관련 값 입력
4. `next.config.js`에 R2 public URL 추가

---

## 7. 관리자 인증 활성화

OAuth 설정이 완료되면:

1. `src/middleware.js` — auth import 주석 해제, 관리자 인증 블록 주석 해제
2. `src/app/admin/layout.jsx` — 더미 세션 제거, `auth()` 호출만 남기기 (redirect 로직은 미들웨어가 처리)

---

## 8. 체크리스트

- [ ] `.env.local` 생성 및 모든 값 입력
- [ ] NEXTAUTH_SECRET 고유값 생성
- [ ] package.json name, 포트 변경
- [ ] 로고, 메뉴, 푸터 변경
- [ ] 컬러/폰트 변경
- [ ] metadata (사이트명, 설명) 변경
- [ ] 미들웨어 관리자 인증 활성화 (OAuth 준비 후)
- [ ] admin/layout.jsx 더미 세션 제거 (OAuth 준비 후)
- [ ] Google OAuth 클라이언트 생성 + 동의 화면 설정
- [ ] Neon DB 생성 + 스키마 push
- [ ] R2 버킷 생성 + next.config.js 업데이트
- [ ] `pnpm install` → `pnpm dev`로 확인
