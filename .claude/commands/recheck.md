---
description: 가이드·팁의 실세계 팩트(수수료·전화번호·법령 수치) 월간 재검증 — 변동 의심만 admin inbox(type=recheck)에 큐잉
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch, Write, Bash(node:*)
---

# 월간 팩트 재검증 (recheck)

KoreaMongol은 한국 체류 몽골인 대상 정보 사이트다. 잘못된 정보(전화번호·수수료·법령 수치)는 이용자에게 실질 피해를 준다. 이 명령은 사이트에 기재된 실세계 팩트를 웹 검색으로 재검증하고, **변동이 의심되는 항목만** admin inbox에 큐잉한다. 운영자가 inbox에서 확인한 뒤에만 실제 반영한다.

## 절대 규칙

1. **프로젝트의 코드·데이터 파일을 절대 수정하지 않는다.** 이 명령의 산출물은 ① `scripts/recheck-items.json` (임시 결과 파일) ② inbox 큐잉 ③ 콘솔 요약, 이 셋뿐이다.
2. 공식 출처(정부·공공기관 사이트, 서비스 공식 공지)만 근거로 삼는다. 블로그·중개 사이트는 참고만 하고 단독 근거로 쓰지 않는다.
3. WebFetch 요약은 표를 오독할 수 있다. 같은 페이지에 두 번 물어 수치가 다르게 나오거나 출처 간 수치가 갈리면 "확인 불가"로 처리한다 (억지로 단정 금지).
4. 환율(exchange rate)은 실시간 데이터이므로 검증 대상이 아니다.

## 검증 체크리스트 (우선순위순)

소스 파일: `src/data/guides/*.js`, `src/data/tips.js` — 먼저 해당 파일에서 현재 표기를 Read/Grep으로 확인한 뒤 검색한다.

| # | 항목 | 현재 표기 위치 | 확인 출처 |
|---|---|---|---|
| 1 | 최저임금 (시급 ₩10,320 / 월 ₩2,156,880, 2026) | jobs.js salaryInfo, tips minimum-wage-2026 | 최저임금위원회·고용노동부 (특히 매년 8월 이후 다음 해 고시 확인) |
| 2 | 유학생 시간제취업 (D-2 학부 10→25/우수 30h, 석박사 15→30/35h, D-4 6개월+TOPIK 2급+주중 10h) | jobs.js parttimePermit, tips student-part-time, visa.js d2/d4 warnings | easylaw.go.kr 유학 중 아르바이트 페이지 (csmSeq=2853) — 페이지 하단 기준일이 갱신됐는지 확인 |
| 3 | 비자 연장 수수료 ₩60,000 / 외국인등록 ₩30,000~35,000 | visa.js visaCostInfo, arrival.js alienRegistration, tips visa-extension·alien-registration | hikorea.go.kr·출입국외국인정책본부 |
| 4 | 주요 전화번호: 1345, 1644-0644, 1577-1366, 1588-5644, 1350, 132, 129, 1372, 1330, 02-798-3464 | emergency.js, tips emergency-numbers·unpaid-wages | 각 기관 공식 사이트 |
| 5 | 지하철 기본요금 (카드 ₩1,550 / 현금 ₩1,650) | tips tmoney-card, transport.js | 서울교통공사·티머니 |
| 6 | 국민연금 요율 4.5% / 반환일시금 5년 기한 | jobs.js deductions, money.js insuranceInfo, tips pension-refund | nps.or.kr |
| 7 | 송금 앱 수수료 (GME ₩5,000~ / Hanpass 무료~₩5,000 / Toss ₩3,900) | money.js, tips send-money-to-mongolia | 각 서비스 공식 사이트·공지 |
| 8 | 확정일자 ₩600 / 등기부등본 열람 ₩700 | housing.js, tips housing-deposit | 정부24·인터넷등기소 |
| 9 | [미해결] D-4 어학연수생 주말·공휴일·방학 상한 수치 (2026-07 확정 실패 — 출처 갈림 20h vs 25h) | 현재 사이트에는 "한도 있음"으로만 표기 | 법무부 체류자격별 통합 안내 매뉴얼·easylaw |

시간·토큰이 부족하면 위 순서대로 진행하고, 못 한 항목은 마지막 요약에 "미검증"으로 명시한다.

## 판정 기준

- **일치**: 큐잉하지 않는다 (요약에만 기록)
- **변동 의심**: 큐잉. priority — 법령·수수료·전화번호는 `high`, 그 외 `medium`
- **확인 불가**: 큐잉. priority `low`, 제목 앞에 `[확인불가]` 접두

## 큐잉 방법

1. 큐잉할 항목을 JSON 배열로 `scripts/recheck-items.json`에 저장 (매회 덮어쓰기):

```json
[
  {
    "subject": "지하철 기본요금 변동 의심 (₩1,550 → ?)",
    "content": "[현재 표기] 카드 ₩1,550 (src/data/tips.js tmoney-card, src/data/guides/transport.js)\n[확인 내용] ...검색에서 확인된 내용...\n[출처] https://...\n[확인일] YYYY-MM-DD",
    "priority": "high"
  }
]
```

content에는 반드시 **[현재 표기(파일 위치 포함)] / [확인 내용] / [출처 URL] / [확인일]** 네 가지를 넣는다.

2. 실행: `node scripts/recheck-queue.mjs scripts/recheck-items.json`
   - 같은 제목의 미처리 항목이 있으면 스크립트가 알아서 건너뛴다.
3. 큐잉할 것이 0건이면 JSON에 빈 배열 `[]`을 쓰고 스크립트는 실행하지 않아도 된다.

## 마지막 출력 (로그용)

항목별 한 줄 결과(✓ 일치 / ⚠ 큐잉 / ? 미검증)와 `큐잉 N건` 요약을 반드시 텍스트로 출력한다.
