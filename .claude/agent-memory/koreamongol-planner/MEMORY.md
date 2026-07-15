# KoreaMongol Planner Memory

## 핵심 통계 (2025년 기준)
- 한국 체류 몽골인: 약 57,534명 (2025.3 기준) ~ 60,008명 (2025.12 기준, 나무위키)
- 몽골인 유학생: 약 15,270명 (상위 4위 국적)
- 몽골인 한국 체류 국적 순위: 12위
- 불법체류 비율: 약 1/3 (약 15,000명 추정, 확인 필요)
- 주요 거주지: 서울 광희동 몽골타운, 경기도 산업단지 지역

## 경쟁/유사 서비스 조사 (2026-02-14)
- 몽골인 전용 한국 생활 가이드 웹사이트: 발견 못함 (블루오션 확인)
- Kstart(케이스타트): 범용 외국인 생활지원 앱 (19개 언어, 2024.12 런칭)
- 다누리(liveinkorea.kr): 다문화가족 지원 포털 (몽골어 지원)
- 1345 외국인종합안내센터: 20개 언어 포함 몽골어 전화상담
- 1577-1366 다누리콜센터: 13개 언어 포함 몽골어 24시간 상담
- 기존 정보 채널: Facebook 그룹, 광희동 오프라인 커뮤니티가 주력

## MVP 갭 분석 결과 (2026-02-14)
- 현재 5개 가이드는 핵심 니즈를 잘 커버함
- 추가 발견 니즈: 노동권리/임금체불 대응, 주거, 일자리, EPS-TOPIK
- `/korean-life` 킬러 콘텐츠 전략은 차별화 포인트로 유효
- 상세 내용: `research-2026-02-14.md` 참조

## 수익화 - 애드센스 이슈 (2026-02-14 조사)
- **몽골어는 구글 애드센스 미지원 언어** (44개 지원 언어에 포함 안 됨)
- 한국어는 지원됨 → 한국어 콘텐츠 병행 or 사이트 언어 전략 재검토 필요
- 2020.9.15부터 미지원 언어 신규 사이트 수익화 불가 (구글 정책)
- 대안: 제휴 마케팅(송금업체 등), 직접 광고, 다른 광고 네트워크(Adsterra 등)
- 상세 분석: `monetization-research-2026-02-14.md` 참조

## 3차 개발 분석 (2026-02-15)
- 현재 가이드 8개 + 환율계산기 + 커뮤니티(expression) 완료
- 주요 갭: 교통, 생활앱, 귀국가이드, 긴급상황/법률, 음식/쇼핑
- P1 도구: 퇴직금 계산기, 급여 계산기, 긴급연락처 페이지, 공유 버튼
- 상세: `phase3-analysis-2026-02-15.md` 참조

## /apps 페이지 기획 (2026-02-21)
- URL: `/apps`, 제목: "Хэрэгтэй апп & хэрэгсэл"
- 7개 섹션: 필수앱, 생활/쇼핑, 교통/지도, 금융/송금, 계산기/도구, 정부서비스, 설치팁
- money.js 패턴 참고 (카드형 리스트), LinkCard props: href/title/description
- 내부 도구(/exchange, /severance)는 LinkCard 대신 Next.js Link 사용
- Phase 1: 필수앱~설치팁, Phase 2: 정부서비스, 상세 사용법
- 상세: `apps-page-plan.md` 참조

## 시리즈 전략 & 일자리앱 분석 (2026-07-13)
- 운영자 비전: 한몽 서비스 시리즈, koreamongol.com이 1호
- 대사관發 니즈: 일자리 앱 (현재 몽골인 구직은 Facebook 페이지 의존)
- 핵심 인사이트: 몽골인은 "몽골인 많은 곳"보다 "한국인만 있는 사업장" 선호
- 법적 결론(검색 검증): 직업소개=구인구직 직접 알선(유료는 등록/자본금 5천만+, 무료도 신고), 직업정보제공사업=불특정 다수 정보제공(신고 대상). 1인 운영은 "정보제공/커뮤니티형"이 안전, 매칭형은 규제·책임 큼
- E-9 사업장변경: 3년내 3회+재고용 1년10개월 2회, 부당처우 시 무제한, 2025~ 권역+업종 제한 도입 → E-9은 "이직 자유" 전제 매칭 부적합
- 경쟁: KOWORK/JOBPLOY/워크온/KoMate 등 외국인 채용플랫폼 이미 존재. 단 몽골 특화·"한국인 사업장" 필터 없음 → 틈새
- 추천: koreamongol.com에 "구직 정보 허브 + 사업장 후기 커뮤니티"로 흡수, 별도 앱 신중

## 재방문 전략 인프라 현황 (2026-07-15 코드 직접 확인)
- **이미 존재하는 인프라 (신규 개발 아님, 활용만 하면 됨):**
  - inbox DB (schema/inbox.js): type=inquiry|report, 자동 컨텍스트(pageUrl/sectionId/referrer/userAgent 등) 수집. admin/inbox 관리 페이지 + 우선순위/상태/adminNote 있음. → 요건4 "질문 접수" 파이프라인의 접수단은 이미 완성
  - ReportBanner+ReportDialog: 가이드마다 "정보 오류 제보" (몽골어 "Мэдээлэл засах") → inbox 저장
  - analytics/track API: guide_view/emergency_call/external_link/share_facebook/share_copy_link/exchange_calculate/donate_click 등 이벤트 + dailyStats 집계. admin/analytics 대시보드 다수. → "관심 신호" 백엔드 존재, 프론트 노출(조회수/도움됐어요)만 없음
  - 커뮤니티: posts(boardType: blog/free/notice) + 댓글/조회수(viewCount)/좋아요/포인트/출석체크(checkin)/레벨 전부 구현됨
- **⚠️ 커뮤니티 CommunityContent.jsx는 "한글허브" 껍데기 그대로** (Hangul Blog, 폰트 갤러리, 한국어 UI, isKo). KoreaMongol 몽골어 맥락으로 미전환 상태 — 커뮤니티 활성화 전 반드시 재설계 필요
- tips 파이프라인: src/data/tips.js (팩트는 검증된 guides/*에서만, 새 팩트 금지) → /tips/[slug] SSG + FAQPage JSON-LD. 요건4 "질문→답변 영구화"의 출력단으로 최적합
- 재검증 프로세스: 가이드별 lastUpdated만 있고 "주기적 재검증"은 없음 (요건3 갭)

## 가이드 데이터 패턴 메모
- meta(title,subtitle) + sections(id,title) + 콘텐츠 배열
- money.js가 가장 구조적 — 새 가이드 작성 시 참고

## 파일 참조
- `docs/koreamongol-mvp-plan.md` - MVP 기획서
- `docs/koreamongol-design-guide.html` - 디자인 가이드
- `phase3-analysis-2026-02-15.md` - 3차 개발 방향 분석
- `apps-page-plan.md` - /apps 가이드 기획 상세
