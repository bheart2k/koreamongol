# 영상 모델 조사 — Grok 대체 후보

> 작성: 공방 / 기준일 **2026-10-07** / 대상: 남은 영상 클립 5개
> 검증 표기: **✔** = 공방이 원문을 직접 다시 열어 확인, **◇** = 하위 조사원 보고(출처 URL만 기록, 원문 미재확인). 출처는 `[S번호]`로 달았고 9절에 URL과 날짜가 있다.
> 가격은 원문 단위 그대로다(환산 없음). "열람일"은 페이지에 날짜가 없어 2026-10-07에 읽었다는 뜻이다.

## 0. 결론 (먼저)

| 순위 | 모델 | 대상 클립 | 한 줄 근거 |
|---|---|---|---|
| **1순위** | **MiniMax H3** (Hailuo 3) | C 4개(낮·밤 × 16:9·9:16), B 1개 | 시작/끝 프레임 지원 ✔[S14], Arena 이미지→영상 1위·AA 2위 ◇[S3][S1 ✔], fal $0.06/s(768p) ✔[S14] |
| **2순위** | **Gemini Omni 1.1 Flash** (Gemini API) | C 4개, B 1개 | 공식 문서에 첫→끝 프레임 보간 지원, 16:9·9:16 ✔[S8], 약 $0.10/s(720p) ✔[S10], Arena 2위 ◇[S3] |
| 보험 | Seedance 2.5 / Veo 3.1 | 형태가 무너질 때 | Seedance 2.5는 시작/끝 프레임 ✔[S19][S20], Veo 3.1은 `lastFrame` ✔[S9]. 둘 다 더 비싸다 |

- **예상 총비용(API 경로)**: 5클립(C 8초×4 + B 6초×1 = 38초)을 클립당 3회 시도한다고 가정하면 **H3 약 $7~9, 2순위 보험까지 합쳐 약 $11~13**. 계산은 7절.
- **젠스파크 경로는 단가를 확인할 수 없다.** 앱 어디에도 1회 크레딧이 표시되지 않고 공식 가이드에도 숫자가 없다. 잔여는 10,000 크레딧이다(5절). 실제 생성 1회를 해야만 알 수 있어서 사용자 승인이 필요하다.
- **B(연기 시네마그래프 루프)는 "첫=끝 프레임"을 그대로 쓰지 않는 편이 낫다.** 같은 이미지를 양끝에 주면 움직임이 약 10분의 1로 줄어든다는 실측이 있다 ✔[S4]. 일반 생성 후 ffmpeg로 크로스페이드해서 루프를 닫는 방식을 권한다(4절, 6절).

**사용자·PM 결정이 필요한 것**
1. 경로: API(fal.ai·Gemini API 등 키 필요, 비용 확정) vs 젠스파크(키 불필요, 단가 미확인). 키 보유 여부는 확인 불가.
2. 젠스파크로 갈 경우, 단가 실측용 1회 생성(크레딧 차감) 승인.
3. 클립 길이 확정. 이 문서는 C 8초, B 6초로 가정했다.

---

## 1. 이름·버전 정정

| 사용자 표현 | 실제 | 근거 |
|---|---|---|
| Seedance "2.5" | **맞다.** Seedance 2.5, 2026-07-31 출시. 2.6·3.0은 확인되지 않음 | ◇[S21], 젠스파크 목록 "Seedance 2.5 New" ✔[S43], fal·Replicate 페이지 ✔[S19][S20] |
| MiniMax Hailuo | 최신은 Hailuo 2.3이 아니라 **MiniMax H3**(별칭 Hailuo 3/03), 2026-07-31. 변형 H3 Max. 구형은 Hailuo 2.3·02 | ◇[S17], 젠스파크 목록 H3·H3 Max ✔[S43], 가격 페이지에 H3·H3-Max·Hailuo-2.3 행 ✔[S15] |
| "Gemini Omni" | **실제 존재하는 Google의 영상 생성·편집 모델.** Veo 기능이 아님. Omni Flash 2026-05-19, **Omni 1.1 Flash 2026-08-27**(모델 ID `gemini-omni-1.1-flash`). Omni Pro는 미출시 | ◇[S13][S11], API 문서 ✔[S8], 젠스파크 목록 ✔[S43] |
| Veo | 최신은 **Veo 3.1**(Standard/Fast/Lite). Veo 4는 공식 자료에서 확인 불가 | ✔[S9][S10] |
| Sora | **Sora 2 API는 2026-09-24 종료**, 대체 API 없음 | ✔[S31] |
| Wan | **Wan 3.0**(2026-08, Alibaba Model Studio에서 "Currently in preview"). 직전 Wan 2.7 | ✔[S24] |
| Runway | 자체 최신 영상 모델은 Gen-4.5. Gen-5는 변경 이력에서 못 찾음 | ◇[S29] |

기타 확인: Kling 3.0(Std/Pro/Turbo) ◇[S32], PixVerse V6·C1 ◇[S34], Luma Ray 3.2 ◇[S40], Vidu Q3 ◇[S37]. Vidu Q4는 웹 페이지만 있고 API·프레임 지원은 확인 불가 ◇.

---

## 2. 비교표

AA = Artificial Analysis 이미지→영상 리더보드(v1.0, With Audio) 순위와 Elo, Arena = arena.ai 이미지→영상 Elo. "—"는 해당 리더보드에서 확인되지 않음. **두 리더보드 모두 "첫 프레임 하나만 주는 이미지→영상" 선호도이며 시작·끝 프레임 보간을 따로 평가하지 않는다**(페이지에 명시 없음, 독립 보간 벤치마크는 못 찾음).

| 모델 | 시작+끝 프레임 | 최대 해상도 · 길이 · 비율 | AA / Arena | API 가격 (원문 단위) | 젠스파크 목록 | 상업 이용 |
|---|---|---|---|---|---|---|
| **MiniMax H3** | **지원** ✔ fal `end_image_url`[S14]. 공식 API는 `first_frame`/`last_frame` role ◇[S16]. Runway SDK도 `h3_max` first+last ✔[S28] | 해상도 fal 480p/768p/2K/4K[S14] ✔. 공식 768P/2K ◇[S16]. 길이 4~15초 ◇. 비율 fal "입력 이미지를 따름" ✔, 공식 adaptive·21:9·16:9·4:3·1:1·3:4·9:16 ◇ | AA **2위 1181** ✔[S1] / Arena **1위 1495** ◇[S3] | fal 480p $0.05/s, 768p $0.06/s, 2K $0.13/s, 4K $0.16/s ✔[S14]. 공식 768P $0.08/s, 2K $0.13/s ✔[S15] | H3: 768p/2K ✔[S43] | fal에 "Commercial use" 표기 ✔[S14]. 공식 약관 원문은 확인 불가 |
| **MiniMax H3 Max** | **지원** ✔ Runway SDK[S28], fal `end_image_url` ◇[S18] | 공식 480P/768P ✔[S15]. fal 480p/768p/1080p ◇[S18] | AA **1위 1195** (신뢰구간 ±99로 넓음) ✔[S1] | 공식 480P $0.05/s, 768P $0.08/s ✔[S15]. fal은 프로모션가가 따로 있음 ◇[S18] | H3 Max: 480p/768p, 티어 Standard/Turbo ✔[S43] | H3와 동일 |
| **Gemini Omni 1.1 Flash** | **지원** ✔ "generate a video that transitions smoothly between a starting image (first frame) and an ending image (last frame)"[S8]. v1(`gemini_omni_flash`)은 **첫 프레임만** ✔[S28] | 360p/720p(기본)/1080p·4K는 **업스케일** ✔[S8]. 비율 16:9(기본)·9:16 ✔[S8]. 길이 3~10초 ✔(젠스파크 목록[S43]). Gemini API 문서 페이지엔 생성 길이 명시 없음 ✔[S8] | AA는 v1 **3위 1178**(1.1은 I2V 표 미등재) ✔[S1] / Arena 1.1 **2위 1488**(표본 3,734표) ◇[S3] | 영상 출력 $17.50/1M tokens, 720p 1초=5,792 tokens → 약 **$0.101/s** (계산) ✔[S10] | "Gemini Omni Flash" 720p, 3~10초, 16:9/9:16 ✔[S43] (버전 표기 없음) | Google이 소유권 주장 안 함 ◇[S12]. SynthID 비가시 워터마크 ✔[S8] |
| **Seedance 2.5** | **지원** ✔ fal `end_image_url`[S19], Replicate "last frame image"[S20]. Runway SDK `seedance2_5` first+last ✔[S28] | fal 480p/720p, 4~30초, 비율 auto·21:9·16:9·4:3·1:1·3:4·9:16 ✔[S19]. 1080p는 출처마다 다름 ◇ | AA I2V **상위 15위에 없음** ✔, 전체 표 미등재는 ◇[S1] / Arena **4위 1477** ◇[S3] | fal 720p 약 $0.4730/s, 480p 약 $0.2205/s ✔[S19]. BytePlus 720p 약 $0.231/s는 3자 인용 ◇[S23] | 480/720/**1080p**, 4~30초 ✔[S43] | fal "Commercial use" ✔[S19]. 공식 조항 확인 불가. AI 표시 삭제 금지 ◇ |
| **Seedance 2.0** | **지원** ◇ fal `end_image_url`[S22] | 480p/720p/1080p, 4~15초 ◇ | AA **4위 1176** ✔[S1] / Arena 5위 1475 ◇ | fal Standard $0.3024/s ◇[S22] | Seedance v2: 480/720/1080p, 티어 Standard/Fast/Mini ✔[S43] | — |
| **Wan 3.0** | **지원** ✔ Alibaba 문서 `first_frame`/`last_frame` 각 1장[S24]. 단 mer.vin 표는 "wan-3 first-frame only"(Replicate 경로로 추정)라 **상충** ✔[S4] | 480P/720P/1080P, 2~30초, 비율 adaptive·21:9·16:9·4:3·1:1·3:4·9:16, 30fps, 워터마크 기본 꺼짐 ✔[S24] | AA **6위 1164** ✔[S1] / Arena 3위 1480 ◇[S3] | fal 480p $0.05/s, 720p $0.10/s, 1080p $0.20/s ◇[S26]. Alibaba 공식은 $0.068~$0.28/s(prime), 할인 중 ◇[S25] | 480/720/1080p, 2~30초 ✔[S43] | 유료 서비스는 사용 가능, 체험 생성물은 상업 불가 ◇. 현재 프리뷰 ✔[S24] |
| **Veo 3.1** (Std/Fast/Lite) | **지원** ✔ 첫 프레임 `image`, 끝 프레임 `config.lastFrame`, Veo 3.1 계열만[S9] | 720p(기본), 1080p·4K는 **8초만**, 길이 4/6/8초, 16:9·9:16 ✔[S9] | AA **11위 1082** ✔[S1] / Arena 1398 ◇[S3] | 오디오 포함 기본가: Std 720p·1080p $0.40/s, 4K $0.60/s. Fast $0.10/$0.12/$0.30. Lite $0.05/$0.08 ✔[S10]. fal 첫-끝 엔드포인트(무음) $0.20/s ◇[S42] | 목록에 "2개 이미지 = 첫/마지막 프레임" 명시 ✔[S43] | Gemini API 약관(위 Omni와 동일) ◇[S12]. SynthID ✔[S9] |
| **Kling 3.0** (Std/Pro) | **지원** ◇ fal `end_image_url`[S32]. Turbo는 자료 상충 | Std 720p, Pro 1080p, 3~15초, 16:9·9:16 ◇ | AA 19~20위 약 1051~1055 ◇[S1] (상위 15위에는 없음 ✔) / — | fal Pro 무음 $0.112/s, 오디오 $0.168/s ◇[S32] | **Kling V3**: "첫/마지막 프레임" 명시, 720p, 3~15초 ✔[S43] | 회원은 상업 제한 없음 ◇[S33] |
| **PixVerse V6 / C1** | **지원** ◇ Transition API `first_frame_img`/`last_frame_img`[S34] | 360~1080p, 1~15초. 공식 Transition 문서엔 비율 파라미터 없음 ◇ | V6 AA 15위 1070 ✔[S1] | fal V6 transition 720p $0.045/s(무음) ◇[S35] | C1·V6에 "전환" 명시 ✔[S43] | 상업 제한 없음 ◇[S36] |
| **Vidu Q3** | **지원** ◇ `start-end-to-video`[S37] | 540p~1080p, 24fps, 1~16초. 비율 파라미터 없음(입력 이미지가 결정) ◇ | AA Q3 Pro 18위 1056 ◇[S1] (상위 15위에는 없음 ✔) | Q3-Pro 720P $0.10/s, 1080P $0.12/s. Turbo $0.055/$0.065 ◇[S38] | Vidu Q3: 720/1080p ✔[S43] | API 약관 상업 제한 없음 ◇[S39] |
| **Luma Ray 3.2** | 지원 ◇ `start_frame`/`end_frame`[S41] | 최대 1080p, 5/10초 ◇ | AA 상위 15위에 없음 ✔, 전체 표 미등재는 ◇[S1] | 5초 블록 540p $0.15, 720p $0.30, 1080p $1.20 (10초 값이 표와 안 맞음) ◇[S40] | 목록에 없음 ✔[S43] | API 상업 조항 못 찾음 |
| **Runway Gen-4.5** | **미지원(첫 프레임만)** ✔ SDK `position: 'first'`[S28], mer.vin도 동일 ✔[S4] | API 720p급 ◇ | AA 상위 25위 밖 ◇ (상위 15위에는 없음 ✔) | 12 credits/s, 크레딧당 $0.01 ◇[S29] | "Runway" 5/10초, 720p, 이미지→영상만 ✔[S43] | 약관상 상업 제한 없음 ◇[S30] |
| **Sora 2** | 해당 없음 | — | — | — | — | **API 종료 2026-09-24** ✔[S31] |

---

## 3. 독립 리더보드

실존 확인: **Artificial Analysis Video Arena** ✔[S1], **Arena(구 LMArena) Image-to-Video** ◇[S3], VBench(2025년 모델 중심이라 참고 가치 낮음 ◇). 

**AA 이미지→영상 v1.0, With Audio 상위 15** ✔[S1] (열람 2026-10-07, 페이지에 갱신일 없음)

| 순위 | 모델 | Elo |
|---|---|---|
| 1 | MiniMax H3 Max | 1195±99 |
| 2 | MiniMax H3 | 1181±8 |
| 3 | Gemini Omni Flash (v1) | 1178±7 |
| 4 | Dreamina Seedance 2.0 720p | 1176±7 |
| 5 | HiDream-O1-Video-1.0 | 1175±10 |
| 6 | Wan 3.0 | 1164±8 |
| 7~10 | HappyHorse-1.1 1104, grok-imagine-video-1.5 1098, MAGI-2 Preview 1093, HappyHorse-1.0 1083 | |
| 11 | Veo 3.1 | 1082±7 |
| 12~15 | Wan 2.7 1077, grok-imagine-video 1072, Veo 3.1 Lite 1071, PixVerse V6 1070 | |

- 1~6위와 7위 사이에 약 60점 격차가 있다. Veo 3.1은 H3·Omni·Seedance 2.0·Wan 3.0보다 90점 이상 낮다.
- 이 표는 **프레임 보간이 아니라 이미지→영상 선호도**다. H3 Max의 ±99는 신뢰구간이 넓다는 뜻이다.

**Arena 이미지→영상** ◇[S3] (페이지 표기 "Last Updated: September 21, 2026"): 1 minimax-h3 1495±5(57,112표), 2 gemini-omni-1.1-flash 1488±11(3,734표), 3 wan3.0 1480±11(3,442표), 4 dreamina-seedance-2.5-720p 1477±7, 5 dreamina-seedance-2.0-720p 1475±7. 2·3위는 표본이 적어 신뢰구간이 넓다.

---

## 4. 형태 붕괴·시간적 일관성 근거

**독립 정량 비교는 못 찾았다.** 3D 미니어처 디오라마만 다룬 비교 글도 없다. 아래는 모두 리뷰어 의견이거나 제작사 주장이다.

- **같은 이미지를 시작·끝에 넣으면 움직임이 줄어든다** ✔[S4] (mer.vin, 2026-09-19, 개인 블로그, 소형·저가 모델 위주): "Roughly ten times less movement", "Passing the same image as both frames gives a mathematically exact loop. It also suppresses motion, because the model has half the clip to travel out and half to come back.", 권고는 "Close it yourself — crossfade or ping-pong, free and better than every model flag." Seedance·Kling·Veo 본체는 이 실험 대상이 아니었다. → B 루프에 직접 적용되는 근거이나 일반화에는 한계가 있다.
- **MiniMax H3** (리뷰어 의견 ◇[S7], 2026-10-06): 손·소품·충돌·빠른 액션에서 Seedance보다 아티팩트가 많고 15초 전체에서 캐릭터 일관성이 떨어질 수 있다. 시작+끝 프레임 앵커는 상태 전환에 효과적이라고 평가했다. 우리 장면(비행기가 섬에서 섬으로)은 접촉·충돌이 없는 이동이라 영향이 작을 것으로 보이나 이것은 추정이다.
- **Seedance 2.5** (리뷰어 의견 ◇[S6], 2026-08-03): morphing이 덜하고 시간적 일관성에 중점. Omni Flash보다 비용은 높지만 모션 품질이 높다는 평.
- **Gemini Omni** (리뷰어 의견 ◇[S6]): 모션이 부드럽고 짧은 클립에서 피사체가 유지되며, 길어지면 일관성이 떨어진다. Google 공식 블로그는 시작·끝 프레임 보간을 "seamless looping clips"에 적합하다고 소개한다 ◇[S11] (제작사 주장).
- **Seedance 2.5 vs Veo 3.1** (판매업체 블로그 ◇[S5], 2026-09-05): Veo는 동작이 더 자연스럽고 Seedance는 더 시네마틱하지만 복잡한 물체 이동은 둘 다 약했다는 평.

---

## 5. 젠스파크 실사용 확인 (2026-10-07, 로그인된 Aside 브라우저에서 새 탭으로 조회만 함)

조회만 했고 **생성·전송 버튼은 누르지 않았다**(입력창에 문구를 입력해 예상 크레딧 표시 여부만 확인, 전송하지 않음). 사용자의 기존 탭은 건드리지 않았다.

**계정·크레딧** ✔[S44]
- 플랜 Plus, 사용 가능 크레딧 **10,000**, 사용 0, 현재 주기 2026-10-06 ~ 2026-11-06(GMT+9). 사용 내역에는 구독 +10,000만 있음.
- LLM·이미지는 무료 할당량, **영상·오디오는 크레딧 사용** ✔[S43].

**영상 에이전트의 선택 가능 모델(설명 문구 그대로 요약)** ✔[S43]

| 모델 | 목록 설명 | 설정 패널에서 확인한 옵션 |
|---|---|---|
| Seedance 2.5 (New) | 30초 단일샷, 오디오, 4~30초, 최대 1080p, 입력 이미지 최대 30개 | 480/720/1080p, 비율 Auto·9:16·16:9·3:4·1:1·4:3·21:9, 길이 입력(기본 5), 생성 횟수 1/2, 오디오, 참조 모드, 초안(480p 미리보기) |
| Seedance v2 | 2.0, 오디오·립싱크, 4~15초, 1080p | 480/720/1080p, 위와 같은 비율, 티어 Standard/Fast/Mini, 오디오, 참조 모드 |
| Seedance Pro Fast | "**첫/마지막 프레임 지원**", 5·10초, 1080p | 비율 7종, 길이, 생성 횟수 |
| MiniMax H3 (New) | 2K, 멀티모달 참조, 저가 768p 티어 | 768p/2K, 비율 7종, 길이, 참조 모드 |
| MiniMax H3 Max (New) | 후속학습, 빠름, Turbo 모드 | 480p/768p, 티어 Standard/Turbo, 참조 모드 |
| Wan 3.0 (New) | 2~30초, 최대 1080p, 입력 이미지 최대 10개 | 480/720/1080p, 비율 6종(21:9 없음), 오디오, 티어 Standard/Fast, 참조 모드 |
| Gemini Omni Flash (New) | 오디오, 대화형 편집, 3~10초, 16:9/9:16, 720p | 비율 Auto·9:16·16:9만, 해상도·오디오 옵션 없음 |
| Gemini Veo 3.1 | "**2개 이미지 = 첫/마지막 프레임**", 4/6/8초, 16:9/9:16, 720p/1080p/4K | 720p/1080p/4k, 비율 Auto·9:16·16:9, 길이(기본 4), 오디오, 티어 Standard/Fast, 참조 모드, 비디오 입력 모드 Extend |
| Kling V3 | "오디오와 **첫/마지막 프레임**", 3~15초, 16:9/9:16/1:1, 720p | 비율 Auto·9:16·16:9·1:1, 오디오, 티어 Pro/Standard/Turbo |
| Kling O3 | "1~2개 이미지로 **프레임-투-프레임**", 3~15초, 720p | 비율 4종, 오디오, 티어 Pro/Standard, 참조 모드, 비디오 입력 모드 Reference/Edit |
| PixVerse C1 / V6 | "참조-투-비디오 및 **전환**" / "전환 및 확장", 최대 1080p | C1: 360~1080p, 비율 7종. V6: 720/1080p, 입력 모드 Extend |
| Vidu Q3 | 1~16초, 720p/1080p, Turbo 티어 | 720/1080p, 비율 6종, 오디오, 티어 Standard/Turbo, 참조 모드 |
| Wan V2.7, Happy Horse, Grok Imagine Video 1.5, FLUX 3 Video, Runway, Veo 3 | 목록에 있음 (Runway는 이미지→영상만) | Wan V2.7: 480/720p, 비율 4종 |

**시작/끝 프레임**
- 목록 설명에 **명시된 모델**: Veo 3.1, Kling V3, Kling O3, Seedance Pro Fast, PixVerse(전환).
- **명시되지 않은 모델**: Seedance 2.5/v2, MiniMax H3/H3 Max, Wan 3.0, Gemini Omni Flash, Vidu Q3. 이 모델들이 젠스파크 UI에서 프레임 지정을 받는지는 **확인 불가**다.
- 입력 UI는 `파일 및 기타 추가`(로컬 파일 찾기 / AI 드라이브 / Google 드라이브 / 새 채팅)와 `에셋`뿐이고 시작·끝 프레임 전용 슬롯은 보이지 않았다. 모델별 `참조 모드` 스위치가 있다.
- 젠스파크의 "Gemini Omni Flash"는 **1.1 표기가 없다.** Runway SDK 기준 v1은 첫 프레임만 받으므로 ✔[S28], 젠스파크의 Omni가 v1이면 끝 프레임을 쓸 수 없을 위험이 있다(미확인).
- Seedance 2.5는 젠스파크가 1080p를 제공하지만 fal은 480p/720p만 표기한다(출처 간 불일치).

**1회 생성 크레딧: 확인 불가**
- 설정 패널, 모델 목록, 티어 선택기(Standard/Ultra는 LLM 티어), 전송 버튼 hover, 프롬프트 입력 후 화면 어디에도 예상 크레딧이 표시되지 않았다 ✔[S43].
- 공식 `credits-guide`는 영상 단가 숫자가 없고 "앱 안의 실시간 가격을 확인하라"는 안내뿐이다(길이가 길수록, 고해상도/4K일수록 비싸다는 서술만) ✔[S45].
- 사용 내역이 0건이라 과거 실측도 없다 ✔[S44].
- 검색 요약에 "영상 1회 시도가 수백~1,000 크레딧대"라는 서술이 있었으나 출처 페이지를 특정할 수 없고 모델도 불명이라 **근거로 쓰지 않는다**.
- **약관**: 산출물 소유권·워터마크는 명시 없음. 상업 이용은 "향후 유료 등급으로 제한될 수 있다"는 문구만 있다(현재 Plus는 유료) ✔[S46] (Last Updated 2026-04-02).

---

## 6. 클립별 추천

가정: 시작·끝 프레임은 Codex로 만든 정지 이미지를 고정, C는 8초, B는 6초, 해상도 720p급이면 충분(Grok이 720p 상한이었음).

### C 히어로 낮·밤 × 16:9·9:16 (이동 피사체, 첫/끝 고정) — 4클립

| | 모델 | 근거 |
|---|---|---|
| **1순위** | **MiniMax H3** | 시작/끝 프레임 지원 ✔[S14]. 이미지→영상 선호도 최상위(AA 2위, Arena 1위). fal $0.06/s로 가장 싸다. 비율은 입력 이미지를 따르므로 16:9와 9:16 이미지를 각각 주면 된다 ✔[S14]. **리스크**: 네이티브 상한 768p(2K는 별도 재생성 단계 ◇), 접촉·빠른 액션에서 아티팩트가 많다는 리뷰 ◇[S7]. |
| **2순위** | **Gemini Omni 1.1 Flash** | 공식 문서에 첫→끝 프레임 보간, 16:9·9:16 명시 ✔[S8]. 약 $0.101/s ✔[S10]. **리스크**: 문서 기준 해상도 기본 720p(1080p·4K는 업스케일) ✔[S8], 젠스파크에서는 v1일 수 있어 API(`gemini-omni-1.1-flash`)로 써야 안전. |
| 보험 | Seedance 2.5 → Veo 3.1 | 디오라마에서 형태가 무너질 때. Seedance는 morphing이 덜하다는 평 ◇[S6]이나 fal 720p $0.473/s로 H3의 약 8배. Veo 3.1은 AA 순위가 낮지만 젠스파크에서 첫/마지막 프레임이 **UI에 명시된** 유일한 상위 브랜드 모델 ✔[S43]. |

### B 모바일 연기 시네마그래프 9:16 (루프) — 1클립

| | 방법 | 근거 |
|---|---|---|
| **1순위** | **H3로 일반 이미지→영상 생성(연기만 움직이도록 프롬프트) 후 ffmpeg 크로스페이드로 루프를 닫는다** | 첫=끝 프레임은 움직임을 줄인다는 실측 ✔[S4]. 시네마그래프는 "한 요소만 움직임"이 목적이라 정지가 심하면 의미가 없다. 크로스페이드는 무료다. |
| **2순위** | Omni 1.1 Flash에 첫=끝 프레임 | Google이 "seamless looping clips"용이라고 소개 ◇[S11]. 독립 검증은 없음. 1회(약 $0.6)로 A/B 비교 후 선택. |

### 공방이 만들 수 있는 것 (요청 시)
- `scripts/design-lab/`에 **크로스페이드 루프 도구**(ffmpeg `xfade`)를 추가할 수 있다. 지시가 없어서 만들지 않았다.

---

## 7. 예상 총비용

전제: C 8초 × 4 + B 6초 × 1 = **38초**/회. "3회"는 클립당 3번 시도(재생성 포함). 오디오는 쓰지 않는다. 가격은 API 단가(원문 단위의 USD/초) × 초이며 **세금·환율 제외**.

| 경로 | 단가 (조건) | 1회 38초 | 3회 114초 |
|---|---|---|---|
| **H3 (fal, 768p)** ✔[S14] | $0.06/s | **$2.28** | **$6.84** |
| H3 (공식 API, 768P) ✔[S15] | $0.08/s | $3.04 | $9.12 |
| H3 (fal, 2K) ✔[S14] | $0.13/s | $4.94 | $14.82 |
| **Omni 1.1 Flash (720p)** ✔[S10] | 5,792 tokens/s × $17.50/1M ≈ $0.10136/s | **$3.85** | **$11.56** |
| Veo 3.1 Lite (720p, 오디오 포함 기본가) ✔[S10] | $0.05/s | $1.90 | $5.70 |
| Veo 3.1 Fast (720p) ✔[S10] | $0.10/s | $3.80 | $11.40 |
| Veo 3.1 Standard (720p) ✔[S10] | $0.40/s | $15.20 | $45.60 |
| Wan 3.0 (fal, 720p) ◇[S26] | $0.10/s | $3.80 | $11.40 |
| Seedance 2.5 (fal, 720p) ✔[S19] | $0.4730/s | $17.97 | $53.92 |
| Seedance 2.0 (fal, 720p) ◇[S22] | $0.3024/s | $11.49 | $34.47 |
| Kling 3.0 Pro (fal, 무음) ◇[S32] | $0.112/s | $4.26 | $12.77 |

**권장 구성의 예상**: H3 1순위로 5클립 3회 시도 **약 $6.84~$9.12**(fal 또는 공식) + Omni 2순위로 일부 클립을 다시 뽑는다면 1회분 $3.85 → **합계 약 $11~13**.

주의
- Veo 3.1의 1080p·4K는 8초만 가능 ✔[S9]. B의 6초 클립은 720p여야 한다.
- 젠스파크는 크레딧 단가를 몰라서 USD를 계산할 수 없다. 잔여는 10,000 크레딧(Plus 구독에 포함된 값).

---

## 8. 확인 불가·불확실 항목

1. **젠스파크 1회 크레딧**: UI·공식 문서 모두 미표시. 실측하려면 생성 1회 필요.
2. **젠스파크의 H3·Omni·Seedance 2.5·Wan 3.0이 프레임 지정을 받는지**, Omni 버전이 1.1인지.
3. **한국 가입·결제 제약**: Google(Gemini API 가용 지역에 South Korea 포함 ◇), BytePlus(South Korea 포함 ◇) 외에는 확인하지 못했다. 결제 제약은 전부 확인 불가.
4. **Seedance 2.5 공식 BytePlus 문서**(해상도 480/720 vs 1080, 상업 조항, 워터마크)는 JS 렌더링이라 못 읽었다. fal 상태는 `Partner` ✔[S19].
5. **MiniMax 공식 약관 원문**과 API 워터마크 여부는 못 읽었다. 오픈웨이트 라이선스는 API 사용과 무관하다 ◇.
6. **Wan 3.0 끝 프레임**: Alibaba 공식 문서는 지원 ✔, mer.vin 표는 first-only. 제공처별 차이일 수 있다. 현재 프리뷰.
7. **Kling 3.0 Turbo의 끝 프레임**: 자료 상충(지원 vs 첫 프레임만). Std/Pro를 쓰는 편이 안전 ◇.
8. **Luma 공식 가격표**: 10초 값이 5초 블록 2개와 맞지 않음. 최대 길이 5/10초 vs "20초"가 엇갈림 ◇.
9. **시간적 일관성·형태 붕괴의 독립 정량 비교, 3D 디오라마 사례**: 없음. AA·Arena는 보간이 아니라 첫 프레임 이미지→영상 선호도다.
10. AA 리더보드는 갱신일이 페이지에 없고 I2V v2.0(1080p 표준화)이 예정이라 수치가 바뀔 수 있다. 하위 에이전트가 본 이전 스냅샷과 순위가 달랐다(예: H3 Max 1201 → 1195).
11. 하위 조사원의 "Veo 3.1 끝 프레임은 8초에서만"이라는 서술은 **원문과 달라 교정했다.** 원문은 "8초 필수" 조건을 확장·참조 이미지·1080p/4K에 붙였고 끝 프레임에는 붙이지 않았다 ✔[S9]. 다만 2025-10의 포럼 글에 4초에서 오류가 났다는 보고가 있다 ◇.

---

## 9. 출처

| ID | 내용 | URL | 날짜 |
|---|---|---|---|
| S1 | Artificial Analysis 이미지→영상 리더보드 ✔ | https://artificialanalysis.ai/video/leaderboard/image-to-video | 열람 2026-10-07 (페이지 갱신일 미표기, AA-Video-I2V v1.0) |
| S2 | Artificial Analysis 텍스트→영상 리더보드 ◇ | https://artificialanalysis.ai/video/leaderboard/text-to-video | 열람 2026-10-07 |
| S3 | Arena 이미지→영상 리더보드 ◇ | https://arena.ai/leaderboard/image-to-video | 페이지 표기 2026-09-21 |
| S4 | mer.vin: 첫/끝 프레임 모델 실측 ✔ | https://mer.vin/2026/09/which-ai-video-models-actually-take-a-first-and-last-frame/ | 2026-09-19 |
| S5 | Krea: Seedance 2.5 vs Veo 3.1 (판매업체) ◇ | https://www.krea.ai/blog/seedance-2-5-vs-veo-3-1-which-is-better-full-comparison-2026 | 2026-09-05 |
| S6 | MindStudio: Seedance 2.5 vs Gemini Omni Flash (리뷰어 의견) ◇ | https://www.mindstudio.ai/blog/seedance-2-5-vs-gemini-omni-flash | 2026-08-03 |
| S7 | Leadde: MiniMax H3 리뷰 (리뷰어 의견) ◇ | https://leadde.ai/blog/mini-max-h3-review | 2026-10-06 |
| S8 | Gemini API 문서: Omni ✔ | https://ai.google.dev/gemini-api/docs/omni | 열람 2026-10-07 (날짜 미표기) |
| S9 | Gemini API 문서: Veo ✔ | https://ai.google.dev/gemini-api/docs/veo | 페이지 표기 2026-01(3.1·Fast), 2026-03(Lite) |
| S10 | Gemini API 가격 ✔ | https://ai.google.dev/gemini-api/docs/pricing | 페이지 표기 2026-10-07 UTC |
| S11 | Google 블로그: Gemini Omni 1.1 Flash ◇ | https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/ | 2026-08-27 |
| S12 | Gemini API 약관 ◇ | https://ai.google.dev/gemini-api/terms | 2026-04-28 |
| S13 | TechCrunch: Gemini Omni 발표 ◇ | https://techcrunch.com/2026/05/19/googles-gemini-omni-turns-images-audio-and-text-into-video-and-thats-just-the-start/ | 2026-05-19 |
| S14 | fal: MiniMax H3 이미지→영상 ✔ | https://fal.ai/models/minimax/h3/image-to-video | 열람 2026-10-07 |
| S15 | MiniMax 가격(pay-as-you-go) ✔ | https://platform.minimax.io/docs/guides/pricing-paygo | 열람 2026-10-07 |
| S16 | MiniMax API 레퍼런스(video generation v2) ◇ | https://platform.minimax.io/docs/api-reference/video-generation-v2-create | 열람 2026-10-07 |
| S17 | MiniMax 공식 블로그: H3 ◇ | https://www.minimax.io/blog/minimax-h3 | 2026-07-31 |
| S18 | fal: MiniMax H3 Max 이미지→영상 ◇ | https://fal.ai/models/minimax/h3-max/image-to-video | 열람 2026-10-07 |
| S19 | fal: Seedance 2.5 이미지→영상 ✔ | https://fal.ai/models/bytedance/seedance-2.5/image-to-video | 열람 2026-10-07 |
| S20 | Replicate: Seedance 2.5 ✔ | https://replicate.com/bytedance/seedance-2.5 | 열람 2026-10-07 |
| S21 | ByteDance Seed 블로그: Seedance 2.5 ◇ | https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5 | 2026-07-31 |
| S22 | fal: Seedance 2.0 이미지→영상 ◇ | https://fal.ai/models/bytedance/seedance-2.0/image-to-video | 열람 2026-10-07 |
| S23 | glbgpt: Seedance 2.5 BytePlus 가격 인용(3자) ◇ | https://www.glbgpt.com/hub/seedance-2-5-pricing/ | 2026-08-21 |
| S24 | Alibaba Model Studio: Wan 3.0 API ✔ | https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference | 열람 2026-10-07 (날짜 미표기, "Currently in preview") |
| S25 | Alibaba Model Studio 가격 ◇ | https://www.alibabacloud.com/help/en/model-studio/model-pricing | 열람 2026-10-07 |
| S26 | fal: Wan 3.0 이미지→영상 ◇ | https://fal.ai/models/alibaba/wan-3.0/image-to-video | 열람 2026-10-07 |
| S28 | Runway Node SDK `image-to-video.ts` ✔ | https://raw.githubusercontent.com/runwayml/sdk-node/main/src/resources/image-to-video.ts | 열람 2026-10-07 |
| S29 | Runway 가격 ◇ | https://docs.dev.runwayml.com/guides/pricing | 열람 2026-10-07 |
| S30 | Runway 이용약관 ◇ | https://runway.com/terms-of-use | 2026-09-15 시행 |
| S31 | OpenAI 영상 생성 가이드(Sora 종료) ✔ | https://developers.openai.com/api/docs/guides/video-generation | 열람 2026-10-07 (종료일 2026-09-24 명시) |
| S32 | fal: Kling v3 Pro 이미지→영상 ◇ | https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video | 열람 2026-10-07 |
| S33 | Kling 유료 약관 ◇ | https://kling.ai/docs/payment-policy | 2026-04-21 시행 |
| S34 | PixVerse API 문서: Transition ◇ | https://docs.platform.pixverse.ai/transitionfirst-last-frame-generation-15123014e0 | 열람 2026-10-07 |
| S35 | fal: PixVerse V6 Transition ◇ | https://fal.ai/models/fal-ai/pixverse/v6/transition | 열람 2026-10-07 |
| S36 | PixVerse 플랫폼 약관 ◇ | https://pixverse.ai/en/pixverse-platform-terms-of-service | 2026-09-04 갱신 |
| S37 | Vidu API 문서: start-end-to-video ◇ | https://platform.vidu.com/docs/start-end-to-video | 열람 2026-10-07 |
| S38 | Vidu API 가격 ◇ | https://platform.vidu.com/docs/pricing | 열람 2026-10-07 |
| S39 | Vidu API 약관 ◇ | https://platform.vidu.com/docs/terms-of-use | 2025-01-23 시행 |
| S40 | Luma API 가격 ◇ | https://lumalabs.ai/api/pricing | 열람 2026-10-07 |
| S41 | Luma Agents API 문서 ◇ | https://docs.agents.lumalabs.ai/ | 열람 2026-10-07 |
| S42 | fal: Veo 3.1 첫-끝 프레임 엔드포인트 ◇ | https://fal.ai/models/fal-ai/veo3.1/first-last-frame-to-video | 열람 2026-10-07 |
| S43 | 젠스파크 AI 비디오 화면(로그인, 직접 조회) ✔ | https://www.genspark.ai/agents?type=video_generation_agent | 2026-10-07 |
| S44 | 젠스파크 크레딧 사용량 화면(직접 조회) ✔ | https://www.genspark.ai/credit-usage | 2026-10-07 |
| S45 | 젠스파크 크레딧 가이드 ✔ | https://www.genspark.ai/helpcenter/credits-guide | 열람 2026-10-07 (날짜 미표기) |
| S46 | 젠스파크 이용약관 ✔ | https://www.genspark.ai/terms | Last Updated 2026-04-02 |
