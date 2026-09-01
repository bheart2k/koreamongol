# env·시크릿 관리 (koreamongol)

> 원본은 자체 호스팅 Infisical. 공통 사용법·계정·CLI 요령: `C:\workspace\bloomingheart_next\docs\infisical-사용법.md`
> 마지막 갱신: 2026-08-31

## 연동 정보

| 항목 | 값 |
|---|---|
| Infisical 조직 | **GBs Projects** (`f9ac9bef-7a7d-410c-85d8-1dd95eebbe20`) — 개인 Vercel 팀 배포분은 이 조직 (피디아 시리즈와 동일 패턴) |
| Infisical 프로젝트 | `koreamongol` (`3b4ba32b-bc8d-46fd-a493-f3d011a1c8a1`) |
| 환경 | `dev`(로컬) / `staging`(미사용) / `prod`(Vercel 운영) |
| Vercel | 팀 **GB's projects** (`team_i5aQfXVOLdCscAGMXSAvXYZH`), 프로젝트 `koreamongol` (`prj_aS8s4CQcK5AML2rNiWBT2i3MbmTm`) |
| Secret Sync | `koreamongol-vercel-prod` (`42e8f1a2-d2da-4970-b0b2-b60fdf4a62f7`) — prod `/` → Vercel production, 자동싱크 ON, App Connection `bheart2k-gb` |
| 연결 파일 | 루트 `.infisical.json` (커밋 대상) |
| 로컬 파일 | `.env` (복사본) |

## 키 현황 (2026-08-31)

- **dev 12키**: DATABASE_URL, GOOGLE_CLIENT_ID/SECRET, NEXTAUTH_SECRET/URL, NEXT_PUBLIC_SITE_URL, R2 5종, FEEDBACK_HUB_TOKEN(피드백 허브 어댑터 인증)
- **prod 29키**: 위 12키(NEXTAUTH_URL은 운영값 `https://koreamongol.com`) + Vercel import로 들어온 **Neon 통합 키 17종**(DATABASE_URL_UNPOOLED, NEON_*, PG*, POSTGRES_*, VITE_NEON_AUTH_URL)
- ⚠ **Neon 통합 키 주의**: Vercel-Neon 통합이 주입하던 키들이 이제 Infisical 관리로 넘어옴. **Neon에서 자격증명을 회전하면 Infisical prod도 같이 갱신해야 한다** — 안 하면 싱크가 옛 값으로 되돌린다.
- `NEXT_PUBLIC_SITE_URL` = `https://koreamongol.com` (apex가 정본 — Vercel에서 www는 apex로 308 리다이렉트. 2026-09-01 확정)

## 이력

- **2026-08-31** Infisical 연동(1차, BLOOMINGHEART 조직): 프로젝트 생성, 로컬 `.env`의 DOPPLER_* 잔재 3줄 제거(우리 Doppler에 koreamongol 없음 — 외부 다운로드본 흔적) + FEEDBACK_HUB_TOKEN 추가, dev/prod 12키 업로드, prod NEXTAUTH_URL을 운영값으로 교체.
- **2026-08-31** **GBs Projects 조직으로 이동(사용자 승인)**: 개인 Vercel(gbs-projects) 배포분은 GBs 조직에서 관리(피디아 시리즈 패턴)하기로. 새 프로젝트 생성 + dev/prod 12키 복사, `.infisical.json` 교체, Vercel 싱크 생성(`import-prioritize-source` — Vercel 전용 키 20종 유입, **빈 값 키 0개 확인**), Vercel에 있던 DOPPLER_* 잔재 3키 삭제(prod 29키 확정), 싱크 `succeeded`. **BLOOMINGHEART 조직의 구 koreamongol 프로젝트 삭제**(내용 전부 이관 후).
- **2026-09-01** `NEXT_PUBLIC_SITE_URL`을 apex(`https://koreamongol.com`)로 확정·교체(사용자 확인 — Vercel에서 www→apex 308 리다이렉트). 로컬 `.env` + Infisical dev/prod 반영, 싱크 succeeded. CLI는 GBs 조직 프로젝트에 403 → `select-organization` API로 조직 전환 토큰 받아 PATCH로 처리. NEXT_PUBLIC_*은 빌드 타임 주입이라 재배포 필요.
- **2026-08-31** 피드백 허브 어댑터 구현(`src/app/api/feedback-hub/**`, `src/lib/feedbackHub.js`) — feedback+inbox 두 테이블 병합, 스펙: `bloomingheart_next/docs/feedback-hub-스펙.md`. 제약: feedback 테이블에 priority/previousStatus 컬럼이 없어 fb-* 항목은 우선순위 변경·휴지통 복원 백업 미지원(컬럼 추가는 운영 DB라 보류 — 필요해지면 재논의).
