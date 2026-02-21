# Phase 2 작업 요약 (2026-02-14)

## 신규 페이지

### 가이드
| 경로 | 제목 | 데이터 | 주요 콘텐츠 |
|------|------|--------|------------|
| `/jobs` | Ажил ба хөдөлмөр | `data/guides/jobs.js` | 비자별 근무조건, 2026 최저임금(₩10,320), 계약 체크리스트, 노동권익(임금체불/부당해고/산재), 연락처/링크 |
| `/housing` | Байр ба орон сууц | `data/guides/housing.js` | 주거 유형 비교(고시원/원룸/기숙사/쉐어하우스), 전세/월세/관리비, 계약 절차, 분리수거, 사기 주의, 연락처/링크 |
| `/topik` | TOPIK / EPS-TOPIK | `data/guides/topik.js` | 비자별 필요 시험 매칭, EPS-TOPIK 구조/자격, TOPIK 등급/응시료, 접수 방법, 합격 후 절차, 학습 자료 |

### 도구
| 경로 | 제목 | 구현 |
|------|------|------|
| `/exchange` | Ханш тооцоолуур | 클라이언트 계산기 + `/api/exchange-rate` API Route |
| `/donate` | Дэмжлэг | Buy Me a Coffee (buymeacoffee.com/koreamongol) + QR |

## 환율 API 구조
- API Route: `src/app/api/exchange-rate/route.js`
- 1차 소스: `cdn.jsdelivr.net` (fawazahmed0/currency-api) — 무료, 키 불필요
- 폴백: `open.er-api.com` — 무료, 키 불필요
- 캐싱: 메모리 1시간, 소스 데이터는 하루 1회 갱신
- 클라이언트: `src/app/exchange/ExchangeCalculator.jsx`

## 네비게이션 재구조화
기존: 1개 드롭다운에 8개 항목 전부 → 변경:
- **Виз & Бүртгэл** (드롭다운): visa, arrival, topik
- **Амьдрал** (드롭다운): hospital, money, exchange, jobs, housing
- **Солонгос хэл** (직접 링크): korean-life
- **Хэллэг** (직접 링크): community/expression

파일: `src/components/layout/nav-items.js`

## 후원 시스템
- Buy Me a Coffee: buymeacoffee.com/koreamongol
- `/donate` 페이지: BMC 버튼 + QR 코드
- `DonateBanner` 컴포넌트: 모든 가이드 페이지 하단에 배치
- 메인 페이지: 슬림 후원 배너 (HomeContent.jsx)
- footer에 후원 링크 추가
- about 페이지 CTA에 후원 버튼 추가

## SEO 보강
- **동적 OG 이미지**: 전 페이지에 `opengraph-image.jsx` 생성 (10개 페이지)
  - 공통 생성 함수: `src/lib/og-image.js`
  - 페이지별 제목 + KoreaMongol 로고 자동 생성
- **HowToJsonLd 추가**: jobs(임금체불 대응), housing(계약 절차), topik(EPS-TOPIK 접수)
- **openGraph.images**: 전 layout에 추가
- 기존 visa, hospital에는 이미 HowToJsonLd 있었음

## 검증된 전화번호
| 번호 | 기관 | 사용 페이지 |
|------|------|------------|
| 1345 | 외국인종합안내센터 | 전체 |
| 1644-0644 | 외국인력상담센터 | jobs |
| 1350 | 고용노동부 | jobs |
| 132 | 법률구조공단 | jobs, housing |
| 1372 | 소비자상담센터 | housing |
| 02-798-3464 | 주한 몽골 대사관 | jobs, housing |

## 검증된 링크
| URL | 사이트 | 사용 페이지 |
|-----|--------|------------|
| epstopik.hrdkorea.or.kr | EPS-TOPIK | jobs, topik |
| www.work24.go.kr | 고용24 | jobs |
| labor.moel.go.kr | 노동포털 | jobs |
| www.comwel.or.kr | 근로복지공단 | jobs |
| www.klac.or.kr | 법률구조공단 | jobs, housing |
| www.zigbang.com | 직방 | housing |
| www.dabangapp.com | 다방 | housing |
| www.iros.go.kr | 인터넷등기소 | housing |
| www.topik.go.kr | TOPIK 공식 | topik |
| www.topikguide.com | TOPIK Guide | topik |
| topikexam.com | TOPIK Exam | topik |
| eps.hrdkorea.or.kr | EPS 고용허가제 | topik |

## 수정된 기존 파일
- `src/app/HomeContent.jsx` — jobs, housing, topik, exchange 카드 + 후원 배너
- `src/data/guides/common.js` — GUIDE_ORDER에 jobs, housing, topik 추가
- `src/components/layout/nav-items.js` — 네비 재구조화
- `src/components/layout/footer.jsx` — 후원 링크 추가
- `src/app/about/AboutContent.jsx` — 후원 버튼 추가
- `src/components/guide/index.js` — DonateBanner export 추가
- 기존 5개 가이드 페이지 — DonateBanner 추가
- `src/data/guides/housing.js` — iros.go.kr http→https 수정

---

## Phase 3 작업 (2026-02-14)

### About 페이지 보강
- Hero 부제 구체화 ("몽골어 생활 가이드" 포지셔닝)
- **"Яагаад KoreaMongol?"** 섹션 신규 — 문제/해결/신뢰 3카드
- **"Бидний гарын авлага"** 섹션 신규 — 8개 가이드 + 환율 도구 링크 그리드
- **"Хэнд зориулсан?"** 섹션 신규 — E-9 노동자, 유학생, 예비 이주자 3카드
- Mission 텍스트 보강 (추상적 → 구체적)
- Creator에 동기 설명 추가
- 기존 추상적 Values(4카드) 섹션 제거

### FAQ 확충
- 14개 → 29개 (+15개)
- 카테고리 4개 → 6개 (`work`, `money` 신규 추가)
- 신규 주제: 일자리/노동(4), 송금/환율(3), 비자 추가(2), 생활 추가(3), 서비스(1), 일반(2)
- 모든 답변에서 관련 가이드 페이지로 내부 링크 유도
- 구체적 금액은 가이드 페이지로 유도하여 팩트 리스크 최소화

### SEO 추가
- About, FAQ에 `opengraph-image.jsx` 추가 (총 12개 페이지 OG 이미지 보유)
- About, FAQ metadata description 업데이트
- About, FAQ에 `openGraph.images` 추가

### 검색 등록 완료
- Google Search Console 등록 완료
- 네이버 서치어드바이저 등록 완료

---

## Phase 3 작업 (2026-02-15)

### 교통 가이드 (/transport)
| 경로 | 제목 | 데이터 | 주요 콘텐츠 |
|------|------|--------|------------|
| `/transport` | Тээврийн гарын авлага | `data/guides/transport.js` | T-money 카드, 지하철(₩1,550), 버스(6종 요금표), 택시(₩4,800+심야할증), KTX(서울-부산 ₩59,800), 앱 가이드(Naver Map/Kakao T 등), 팁 |

- 요금 기준일: 2025.02.15 확인 (지하철 2025.6.28 인상 반영)
- StepList로 버스 이용법, KTX 예매 절차 안내
- 6개 외부 링크 (T-money, Seoul Metro, Korail, Seoul Bus, Kakao T, Naver Map)

### 긴급 연락처 모음 (/emergency)
| 경로 | 제목 | 데이터 | 주요 콘텐츠 |
|------|------|--------|------------|
| `/emergency` | Яаралтай утасны дугаарууд | `data/guides/emergency.js` | 15개 전화번호, 6개 카테고리, 몽골어 지원 여부, 운영시간 |

- 카테고리: 긴급(119/112/110), 외국인(1345/1577-1366/120), 노동·법률(1644-0644/1350/132), 통역(1588-5644), 생활(1372/129/1330), 대사관(02-798-3464)
- 전화 버튼으로 바로 통화 가능 (tel: 링크)
- 5개 외부 링크

### 검증된 전화번호 (신규)
| 번호 | 기관 | 몽골어 | 운영시간 |
|------|------|--------|---------|
| 1577-1366 | 다누리콜센터 | O (24시간) | 24시간 365일 |
| 1588-5644 | BBB Korea | O (24시간) | 24시간 365일 |
| 02-120→9→5 | 다산콜센터 | O | 평일 09:00-18:00 |
| 1644-0644 | 외국인력상담센터 | O | 09:00-18:00, 365일 |
| 129 | 보건복지콜센터 | X | 평일 09:00-18:00 |
| 1330 | 관광안내전화 | X | 24시간 365일 |
| 110 | 정부민원안내 | X | 24시간 365일 |

### 네비게이션 업데이트
- Амьдрал 드롭다운에 `/transport` 추가
- 직접 링크로 `/emergency` 추가
- 메인 페이지 카드 2개 추가
- About 가이드 그리드 2개 추가
- GUIDE_ORDER에 transport, emergency 추가

### SEO 추가
- transport, emergency에 `opengraph-image.jsx` 추가 (총 14개 페이지 OG 이미지)
- BreadcrumbJsonLd 추가
- metadata (title, description, openGraph, twitter, canonical) 추가
