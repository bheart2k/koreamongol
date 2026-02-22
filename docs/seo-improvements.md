# SEO 개선 작업 목록

> 분석일: 2026-02-22
> 상태: 완료

## 전체 평가

가이드 페이지들의 metadata, canonical, OG, JSON-LD 대부분 완비. sitemap/robots 정상.
아래 항목들이 누락 또는 개선 필요했음.

---

## P1 (높음) — 검색 노출에 직접 영향

### 1. ArticleJsonLd 이중 삽입
- **파일**: `community/[boardType]/[postId]/layout.jsx` + `page.jsx`
- **문제**: 같은 게시글의 ld+json 스크립트가 두 번 출력됨
- **해결**: layout.jsx에서 ArticleJsonLd + 중복 generateMetadata 제거 (page.jsx에서만 렌더링). DB 쿼리도 title만 조회하도록 경량화.
- **상태**: [x] 완료

### 2. /contact OG 이미지 누락
- **파일**: `contact/layout.jsx`
- **문제**: generateMetadata에 images 필드 없음 → 소셜 공유 시 이미지 없음
- **해결**: `images: ['/opengraph-image']` 추가
- **상태**: [x] 완료

### 3. /community 계열 OG 이미지 누락
- **파일**: `community/layout.jsx`, `community/[boardType]/layout.jsx`
- **문제**: 커뮤니티 목록 페이지 소셜 공유 시 이미지 없음
- **해결**: generateMetadata에 images 추가
- **상태**: [x] 완료

---

## P2 (중간) — 구조화 데이터 보강

### 4. /arrival HowToJsonLd 없음
- **파일**: `arrival/page.jsx`
- **문제**: 도착 후 절차(외국인등록, 은행 개설 등)가 단계형인데 HowTo 스키마 없음
- **해결**: HowToJsonLd 추가 (6단계: SIM카드→외국인등록→은행→폰계약→건강보험→전입신고)
- **상태**: [x] 완료

### 5. /money HowToJsonLd 없음
- **파일**: `money/page.jsx`
- **문제**: 송금 절차가 단계형인데 HowTo 스키마 없음
- **해결**: HowToJsonLd 추가 (4단계: 방법선택→앱등록→수신자입력→송금)
- **상태**: [x] 완료

### 6. /transport HowToJsonLd 없음
- **파일**: `transport/page.jsx`
- **문제**: 교통카드 발급/이용 절차에 HowTo 스키마 없음
- **해결**: HowToJsonLd 추가 (4단계: T-money구매→충전→탑승→택시)
- **상태**: [x] 완료

### 7. /faq BreadcrumbJsonLd 없음
- **파일**: `faq/page.jsx`
- **문제**: FAQPageJsonLd는 있지만 BreadcrumbJsonLd 없음
- **해결**: BreadcrumbJsonLd 추가
- **상태**: [x] 완료

### 8. /about BreadcrumbJsonLd 없음
- **파일**: `about/page.jsx`
- **문제**: metadata는 있지만 BreadcrumbJsonLd 없음
- **해결**: BreadcrumbJsonLd 추가
- **상태**: [x] 완료

---

## P3 (낮음) — 품질 개선

### 9. /privacy, /terms canonical + OG 없음
- **파일**: `privacy/page.jsx`, `terms/page.jsx`
- **문제**: metadata는 있지만 alternates.canonical, openGraph.images 없음
- **해결**: canonical + images + OG title/description 추가
- **상태**: [x] 완료

### 10. /privacy, /terms min-h-screen 사용
- **파일**: `privacy/page.jsx`, `terms/page.jsx`
- **문제**: 프로젝트 원칙상 min-h-content 사용해야 함
- **해결**: min-h-screen → min-h-content
- **상태**: [x] 완료

### 11. /jobs, /housing title 키워드 부족
- **파일**: `jobs/layout.jsx`, `housing/layout.jsx`
- **문제**: 짧은 title만 있음. 다른 가이드들은 키워드 풍부한 긴 title 사용
- **해결**: 확인 결과 description/keywords가 충분하고, title.template으로 suffix 자동 추가됨. 패스.
- **상태**: [-] 불필요
