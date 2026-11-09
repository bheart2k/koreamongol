---
name: verified-topik-mongolia
description: /topik 몽골 현지 시험 섹션(topik.mn PBT/IBT, EPS-TOPIK 몽골) 팩트체크 결과 — 일치한 수치, 출처 간 충돌, 접근 가능한 소스 조회법 (2026-11-09)
metadata:
  type: project
---

## 조회법 (2026-11-09 확인)
- topik.mn은 쿠키 필요: 먼저 `GET /home/index2`(쿠키 jar) 후 `/Home/Content/{2,3,4,5,1007,1010,1019}`, `/Home/faqlist`, `/Home/news/75`, IBT는 `/ibt/Home/Content/{2,3,4}`, `/ibt/Home/news/{73..78}`. 이메일은 Cloudflare 난독화(data-cfemail) → XOR 디코드하면 pbttopik11@gmail.com. 공고는 이미지(png/jpg)라 직접 열어봐야 함.
- topik.go.kr 해외 일정 `TWGUID0020.do?searchNationSe=02&searchOpertnTy=` (쿠키 `timezone=Asia/Seoul`) — 아시아 열의 시험일·성적발표일로 교차확인 가능. TWGUID0050(시험장)은 ajax 302라 못 씀.
- epstopik.hrdkorea.or.kr는 자동 요청(WebFetch·curl)에 HTTP 400. 메인 세션이 Aside 브라우저로 열면 읽힌다(2026-11-09): 시험 소개 `abot/exam/selectTopikDesc.do?lang=ko`, 응시원서 안내 `abot/exam/selectGuideDesc.do`, 방문접수 `recp/guide/selectVisitGuideDesc.do`, 시험일 공고 목록 `abot/exam/sechduleGuideList.do?pageIndex=N`(상세는 POST — 목록 페이지에서 `testingPlanDetail(idx)`), 시험일정 `abot/exam/selectSechduleDescList.do?pageIndex=N`.

## 일치 확인된 값 (topik.mn 및 topik.go.kr 아시아 열)
- PBT 105(04.12/성적 05.29), 106(05.17/06.25), 108(10.18/12.10), 109(11.15/12.22), IBT 13(06.13/07.03), IBT 16(11.28/12.18) 시험일·성적일 전부 topik.go.kr과 일치. 접수기간도 topik.mn 일정표와 일치(IBT16만 아래 충돌).
- 응시료 PBT 60,000/80,000₮ (109회 공고), IBT 70,000/100,000₮ (13·16회 공고). 사진 3×4, 3개월 내. 입금 2시간 내(PBT 공고), 거래내용 = 등록코드+전화번호.
- 연락처 +976 7755-0855, pbttopik11@gmail.com, 월~금 접수기간 09~17시/그 외 11~17시, FB `topik.burtgel`(PBT 전용). IBT는 전화·메일 없고 FB `profile.php?id=61576298810918`뿐.
- PBT 입실마감 08:20 / 11:30 (Content/2, Content/4 일치). 장소 PBT = 몽골국립대 2·4·5동.
- 공단 원문 확인(2026-11-09, Aside): EPS-TOPIK 40문항(20+20)·각 50점·각 25분·총 100점, 상대평가, 하한 제조업 60 / 그 외 업종 45 / 어업특례 30(Pass/Fail), 연령 18~39, 5년(E-9·E-10 각각·합산), 접수비 28 USD 또는 상응 현지화(필리핀 24), 원서 1매(사진 2매·신분증 사본), 대리·단체 접수 불가, 접수 기간 내 취소 전액 환불. 시험 당일 응시표·여권(신분증) 지참, 휴대전화·무선이어폰 반입 금지, 부정행위 4년 응시 제한. 몽골 2026 일반 공고 상세: 시험 시작 30분 전 입실 완료.
- 2027 몽골 EPS-TOPIK: 2026-11-09 시험일 공고 113건·시험일정 43건 중 몽골은 2026 일반(제조업, 공고 4/30)·특별(공고 5/22) 2건뿐 → 미공고.

## 출처 간 충돌 (판정)
- IBT16 접수: 일정 페이지 09.14~09.18 vs 공고 이미지 09.15~09.18 → 공고(9/8 게시, 시각 명시)를 채택. 이미 마감.
- IBT 입실마감: 일반 페이지(Content/2, Content/4)·2025-11 공고 = 08:30/12:00, 2026 두 공고(13·16회) = 08:40/12:10 → 최신 공고 채택하되 "08:30/12:00 전 도착 권장" 병기가 안전.
- PBT: Content/1019는 "6시간 내 보완", 109 공고는 확정 안내 기간 08.24~08.28 별도, IBT는 "12시간 내". 109 공고는 "확정·번호 발급 후 응시료 환불 불가", "시험일 접수증 없어도 응시 가능하나 신분증 원본 필수"(Content/4는 접수증 지참 필수).

## 확인 불가 (TODO)
- 몽골 EPS 접수 일정(3/25~3/27 등)·주소(Хан-Уул 2-р хороо)·전화 11343131: tips.js 의존, 독립 확인 못 함.
- EPS 시험 당일 신분증: 공단 원문은 "여권(신분증)" — 몽골 현장에서 받는 신분증 종류는 노동복지서비스청 공고 미확인. 페이지는 "паспорт (эсвэл иргэний үнэмлэх)"로 적음.
