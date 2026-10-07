# 시안 B 「두 개의 고향」 — 이미지·영상 프롬프트 기록

> 작성: 시안 B 워커(고향) / 2026-10-07
> 원본: `.design-lab-src/b/` (git 제외) · 웹용: `public/design-lab/b/`

## 도구·절차

- 이미지: Codex CLI 0.160.1 `codex exec` → 내장 `image_gen`. 래퍼가 "brief 그대로 1장 생성" 지시 + `-i` 레퍼런스 첨부. 결과는 `~/.codex/generated_images/<session-id>/`에서 복사.
- 영상: Grok Build 1.0.46 `grok --prompt-file` → `reference_to_video` 1회 호출. **first_frame = last_frame = 스틸**(심리스 루프), duration 6s, 720p. 3:4 패널은 4:5 스틸을 3:4로 센터 크롭해 첫 프레임으로 사용(Grok가 4:5 미지원).
- 검수: 생성물은 전부 직접 열어 봄. 영상은 첫/중간/끝 프레임을 추출해 실제 움직임과 루프 일치를 확인.
- 파생 원칙: **기준 룩 프레임(히어로 몽골)** → 한국 짝은 몽골 사진을 마스터로 파생 → 나머지 몽골 사진은 기준 프레임을 "색·그레인만" 레퍼런스로 → 그 한국 짝은 다시 몽골 사진을 마스터로 파생.

## 후처리

- 히어로 지평선 실측(밝기 변화 최대 행): 몽골 56.06% · 한국 56.85% (데스크톱 3:4) / 모바일 54.66% · 53.70%. 코드에서 컨테이너 쿼리 단위로 두 패널의 지평선을 같은 높이에 고정.
- 이음매 하늘 톤 일치: 한국 히어로 스틸·영상에 채널 게인 R×1.21 G×1.17 B×1.075 (모바일 R×1.18 G×1.15 B×1.09). 몽골(기준 룩)은 원본 유지.
- WebP: 공용 `scripts/design-lab/img2webp.mjs` (데스크톱 q80 원본폭, 모바일 828폭, 플레이트 640폭 -sm). 영상: `video2mp4.mjs` (H.264, 무음, faststart).

## 폐기한 시도 (요약)

| 시도 | 폐기 이유 |
|---|---|
| hero_v1–v7 (16:9 단일 파노라마: 게르 옆 강 건너 서울) | 합성 지리라 관광 브로슈어처럼 읽힘, 파스텔 노을·태양 원반이 상투적, 딥틱 운율 없음 |
| m_hero_a | 초원이 아니라 경작 밀밭처럼 보임 |
| m_hero_c | 하늘이 너무 파랗고 채도가 높아 종이 팔레트와 맞지 않음 |
| k_hero_a / k_hero_c | 남산이 없어 서울이 덜 읽힘 (b 채택) |
| k_hero_mob_a | 남산 형태가 뾰족한 화산처럼 보임 |
| p1_kr (1차) | 반원형 정자 지붕처럼 나옴. 실제 한옥 처마 구조와 다름 → 선자서까래로 재생성 |
| p1_kr3 | 모서리 공포 형태가 어색함 (kr2 채택) |
| finale_b | 김이 덜 얽힘 (a 채택) |

## 채택 이미지 프롬프트

### B-기준 룩 프레임 · 히어로 몽골 (데스크톱 4:5)

- 레퍼런스: 없음 (텍스트만)
- 결과: `hero-mn-4x5.png → 3:4 크롭 hero-mn.webp`

```text
Aspect ratio: vertical portrait 4:5.

Quiet, minimal fine-art photograph for a luxury culture magazine: the open Mongolian steppe in soft pearl morning light after dawn, a thin layer of mist lying low over the land. A perfectly level horizon crosses the frame at 62 percent of its height from the top. In the lower part, a flat, endless field of dry wheat-gold grass, tactile and finely detailed in the foreground, dissolving into mist toward the horizon. On the horizon, small and alone, a white felt ger with a muted terracotta door sits in the left third, a single fine line of chimney smoke rising straight up into still air. The sky fills the upper 62 percent: smooth, luminous, warm ivory at the horizon fading to a pale blue-grey above, almost empty. Restrained colour palette of bone white, straw gold, soft slate and a whisper of ink navy. Medium-format film look, Portra 160, matte finish, fine grain. No people, no animals, no text, no flags, no logos, no watermark.
```

### 히어로 한국 (데스크톱 4:5)

- 레퍼런스: hero-mn-4x5.png (마스터)
- 결과: `hero-kr-4x5.png → 3:4 크롭 + 채널 게인 그레이드 → hero-kr.webp`

```text
Aspect ratio: vertical portrait 4:5.

Use the attached photograph as the master reference and make its exact companion for a two-panel fine-art diptych: same photographer, same medium-format camera and 80mm lens, same film stock, same camera height, same light and same instant at dawn. The horizon must sit at exactly the same height as in the reference, the sky must have the identical gradient and colour, and the overall grade must match perfectly (matte, low contrast, fine grain, pale ivory and soft blue-grey with straw-gold warmth).

Scene: the Han River in Seoul at first light. The lower part of the frame is calm water, softly mirroring the sky, with a veil of mist lying on its surface. Along the horizon, the far bank of Seoul appears as a delicate low silhouette half-dissolved in mist: a gentle row of apartment blocks whose tallest, densest part sits in the right third of the frame, a long low bridge running along the far bank, and very faint low mountains behind. The foreground water has a subtle gentle texture of small ripples. Serene, dignified, spacious. No people, no boats, no text, no signs, no flags, no logos, no watermark.
```

### 히어로 몽골 (모바일 9:16)

- 레퍼런스: hero-mn-4x5.png
- 결과: `hero-mn-9x16.png → hero-mn-m.webp`

```text
Aspect ratio: tall vertical 9:16.

The attached photograph is the master reference for subject, light, mist, palette, colour grade and film grain. Recompose the same scene as a tall vertical 9:16 photograph for a phone screen: the vast Mongolian steppe with a low mist, frost-tipped straw-gold grass in the foreground, and a single small white felt ger with a muted terracotta door and a thin vertical thread of chimney smoke. Place the perfectly level horizon at 60 percent of the frame height from the top, and place the ger slightly right of the centre, at about 58 percent of the frame width. The huge quiet sky fills the upper part with the same smooth gradient: soft pale blue-grey at the top to a warm luminous cream band at the horizon. Matte, low-contrast medium-format film look. No people, no animals, no text, no flags, no logos, no watermark.
```

### 히어로 한국 (모바일 9:16)

- 레퍼런스: hero-kr-4x5.png + hero-mn-9x16.png
- 결과: `hero-kr-9x16.png → 그레이드 → hero-kr-m.webp`

```text
Aspect ratio: tall vertical 9:16.

Two reference photographs are attached. The FIRST is the Han River scene to reproduce (subject, far bank, Namsan hill with its slender tower, apartment cluster, long low bridge, mist on the water, colour grade). The SECOND is the matching Mongolian steppe photograph from the same series: copy its horizon height, its sky gradient and its light exactly, because the two will be placed side by side as a diptych on a phone screen.

Recompose the Han River scene as a tall vertical 9:16 photograph: a perfectly level horizon at 55 percent of the frame height from the top, exactly like the second reference. Calm water with a veil of mist in the lower part, gentle small ripples in the foreground softly reflecting the warm sky. On the far bank along the horizon, the low hazy silhouette of Seoul: the small rounded Namsan hill with its slender tower and a compact cluster of pale apartment towers sitting slightly left of centre, at about 40 percent of the frame width, the long low bridge running along the far bank. Huge quiet sky above, pale blue-grey at the top to a warm luminous cream band at the horizon. Matte, low-contrast medium-format film look with fine grain. No people, no boats, no text, no signs, no flags, no logos, no watermark.
```

### Pl. I 몽골 — 토오노(천창)

- 레퍼런스: hero-mn-4x5.png (색·그레인만)
- 결과: `p1-mn.webp`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph defines ONLY the colour grade, film stock, grain, softness of light and quiet mood of this photo series (matte, low contrast, pale ivory, straw gold, soft blue-grey, a whisper of ink navy, muted terracotta accents). Do not copy its subject or composition.

Fine-art editorial photograph for a luxury culture magazine, Kinfolk and Cereal aesthetic. Looking straight up from the floor inside a traditional Mongolian ger at its toono, the round wooden roof crown. The toono ring sits in the centre of the frame, open to a pale luminous morning sky, with its inner wooden spokes. Dozens of slender wooden roof poles radiate from the ring outward to every edge of the frame like rays, with the soft white underside of the felt roof visible between them. The wood is painted in a faded, muted terracotta with delicate worn ochre and ink-blue ornament. Soft daylight falls through the crown and gently lights the poles. Perfect radial symmetry, calm and majestic. Medium-format film, Kodak Portra 160, matte, fine grain. No people, no text, no flags, no national symbols, no logos, no watermark.
```

### Pl. I 한국 — 처마(선자서까래)

- 레퍼런스: p1-mn.png (마스터)
- 결과: `p1-kr.webp`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph is the master reference. Create its companion photograph for a museum-quality diptych, as if taken by the same photographer with the same camera, lens, film stock, in the same soft morning light: match its colour grade, contrast, softness and fine film grain, and echo its radiating structure, so the two images rhyme when placed side by side. Only the culture changes, from Mongolian to Korean.

Subject: standing under the corner of a traditional Korean hanok house and looking straight up. The deep eave sweeps overhead and rises gracefully toward the upturned corner of the roof (chuneo), and beneath it the fan rafters (seonjayeon) spread out from the corner like the ribs of an open folding fan, a long sequence of slender round natural-wood rafters radiating across the frame, with white plaster between their ends. Beyond the elegant curved roof edge of dark grey clay tiles, a pale luminous morning sky. Natural, unpainted honey-toned wood, no colourful temple painting. Architecturally accurate, calm and majestic. No people, no text, no signs, no flags, no national symbols, no logos, no watermark.
```

### Pl. II 몽골 — 펠트

- 레퍼런스: hero-mn-4x5.png (색·그레인만)
- 결과: `p2-mn.webp`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph defines ONLY the colour grade, film stock, grain, softness of light and quiet mood of this photo series (matte, low contrast, pale ivory, straw gold, soft blue-grey, a whisper of ink navy, muted terracotta accents). Do not copy its subject or composition.

Fine-art editorial still photograph, Kinfolk and Cereal aesthetic. An intimate frontal close-up of the thick, hand-made white sheep's-wool felt that covers a Mongolian ger, lit by low raking morning light from the left that reveals its soft, matted fibrous texture and gentle undulations. A single twisted natural rope band crosses the felt horizontally in the lower third, and a line of neat hand stitching runs vertically near the right edge. The image is almost monochrome: warm ivory and soft shadow, with the rope in pale straw. Calm, tactile, minimal, lots of quiet surface. Medium-format film look, matte, fine grain. No people, no text, no logos, no watermark.
```

### Pl. II 한국 — 한지 창호

- 레퍼런스: p2-mn.png (마스터)
- 결과: `p2-kr.webp`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph is the master reference. Create its companion photograph for a museum-quality diptych, as if taken by the same photographer with the same camera, lens, film stock and camera angle, in the same light: match its framing, camera angle, composition structure, light direction, colour grade, contrast and fine film grain as closely as possible, so the two images rhyme when placed side by side. Only the culture changes, from Mongolian to Korean.

Subject: an intimate frontal close-up of a traditional Korean hanji paper door (changhoji): translucent, fibrous mulberry paper stretched over a fine wooden lattice. Soft low morning light from the left glows through the paper, revealing its long fibres and gentle unevenness. The slim wooden lattice bars form a calm grid, one horizontal bar crossing in the lower third and one vertical bar near the right edge, echoing the rope and stitching of the reference. Almost monochrome: warm ivory paper and pale honey wood with soft shadow. No people, no text, no logos, no watermark.
```

### Pl. III 몽골 — 수테차

- 레퍼런스: hero-mn-4x5.png (색·그레인만)
- 결과: `p4-mn.webp (3:4 크롭)`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph defines ONLY the colour grade, film stock, grain, softness of light and quiet mood of this photo series (matte, low contrast, pale ivory, straw gold, soft blue-grey, a whisper of ink navy, muted terracotta accents). Do not copy its subject or composition.

Fine-art editorial still-life photograph, Kinfolk magazine aesthetic. A single bowl of hot Mongolian milk tea (suutei tsai), creamy pale beige, in a simple, slightly rounded white porcelain bowl with a fine ink-blue line around its rim, resting on a worn, softly polished wooden low table inside a ger. Soft window light from the left, deep quiet warm-shadow background. A delicate, softly backlit plume of steam rises and curls above the bowl into the dark background. View from slightly above at about 35 degrees, the bowl placed in the lower centre of the frame with generous dark negative space above for the steam. Matte, low contrast, medium-format film, fine grain. No people, no hands, no text, no logos, no watermark.
```

### Pl. III 한국 — 찻사발

- 레퍼런스: p4-mn.png (마스터)
- 결과: `p4-kr.webp (3:4 크롭)`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph is the master reference. Create its companion photograph for a museum-quality diptych, as if taken by the same photographer with the same camera, lens, film stock and camera angle, in the same light: match its framing, camera angle, composition structure, light direction, colour grade, contrast and fine film grain as closely as possible, so the two images rhyme when placed side by side. Only the culture changes, from Mongolian to Korean.

Subject: a single handmade Korean ceramic tea bowl (chatsabal) in a warm grey buncheong glaze with soft white brushed slip, holding pale jade-green tea, resting on a worn, softly polished wooden maru floor of a hanok. Soft window light from the left through a hanji paper window, a deep quiet warm-shadow background. A delicate, softly backlit plume of steam rises and curls above the bowl into the dark background. Same viewing angle, same bowl size and placement in the lower centre, same generous dark negative space above. No people, no hands, no text, no logos, no watermark.
```

### Pl. IV 몽골 — 델 원단

- 레퍼런스: hero-mn-4x5.png (색·그레인만)
- 결과: `p5-mn.webp`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph defines ONLY the colour grade, film stock, grain, softness of light and quiet mood of this photo series (matte, low contrast, pale ivory, straw gold, soft blue-grey, a whisper of ink navy, muted terracotta accents). Do not copy its subject or composition.

Fine-art editorial textile photograph, Kinfolk and Monocle aesthetic. An intimate close-up of the fabric of a traditional Mongolian deel, not worn by anyone: a length of deep ink-navy silk brocade with a subtle tone-on-tone woven cloud-scroll pattern, hanging in soft vertical folds from a plain wooden rod against a warm ivory wall. Along one edge runs a narrow trim band of muted antique gold, with a single hand-knotted round fabric button and loop. Soft daylight from the left makes the silk glow and reveals the woven pattern. Elegant, restrained, tactile. Medium-format film look, matte, fine grain. No people, no mannequin, no text, no flags, no national symbols, no logos, no watermark.
```

### Pl. IV 한국 — 한복 원단

- 레퍼런스: p5-mn.png (마스터)
- 결과: `p5-kr.webp (3:4 크롭)`

```text
Aspect ratio: vertical portrait 4:5.

The attached photograph is the master reference. Create its companion photograph for a museum-quality diptych, as if taken by the same photographer with the same camera, lens, film stock and camera angle, in the same light: match its framing, camera angle, composition structure, light direction, colour grade, contrast and fine film grain as closely as possible, so the two images rhyme when placed side by side. Only the culture changes, from Mongolian to Korean.

Subject: an intimate close-up of traditional Korean hanbok fabric, not worn by anyone: a length of translucent ivory silk gauze with a subtle woven pattern hanging in soft vertical folds from a plain wooden rod (hwaetdae) against a warm ivory wall, with a long, softly curved goreum ribbon of muted terracotta silk falling down along one edge. Soft daylight from the left makes the silk glow and shows its delicate weave. Elegant, restrained, tactile. No people, no mannequin, no text, no flags, no national symbols, no logos, no watermark.
```

### 마무리 — 한 탁자 위 두 그릇 (16:9)

- 레퍼런스: p4-mn.png + p4-kr.png
- 결과: `finale.webp`

```text
Aspect ratio: wide landscape 16:9.

Two reference photographs are attached: a bowl of Mongolian milk tea in a white porcelain bowl with an ink-blue rim, and a Korean buncheong ceramic tea bowl with green tea. They come from the same photo series. Create the closing photograph of the series in exactly the same style, light, colour grade and film grain: both bowls now rest together on one long, worn, softly polished wooden table, side by side a short distance apart, the Mongolian bowl on the left and the Korean bowl on the right, each reproduced faithfully. Soft window light from the left, deep quiet warm-shadow background. From each bowl a delicate, softly backlit plume of steam rises, and the two plumes drift toward each other and gently intertwine above the centre of the table. The bowls sit in the lower third with generous dark negative space above. Calm, warm, dignified, a feeling of sharing a table. Medium-format film, matte, fine grain. No people, no hands, no text, no logos, no watermark.
```

### 마무리 (모바일 9:16)

- 레퍼런스: p4-mn.png + p4-kr.png
- 결과: `finale-m.webp`

```text
Aspect ratio: tall vertical 9:16.

Two reference photographs are attached: a bowl of Mongolian milk tea in a white porcelain bowl with an ink-blue rim, and a Korean buncheong ceramic tea bowl with green tea. They come from the same photo series. Create the closing photograph of the series in exactly the same style, light, colour grade and film grain: both bowls now rest together on one long, worn, softly polished wooden table, close together, the Mongolian bowl on the left slightly behind and the Korean bowl on the right slightly in front, each reproduced faithfully. Soft window light from the left, deep quiet warm-shadow background. From each bowl a delicate, softly backlit plume of steam rises, and the two plumes drift toward each other and gently intertwine above the centre of the table. The bowls sit in the lower quarter of the tall frame, with a tall column of dark negative space above where the steam rises. Calm, warm, dignified, a feeling of sharing a table. Medium-format film, matte, fine grain. No people, no hands, no text, no logos, no watermark.
```

## 시네마그래프 (Grok reference_to_video)

### hero-mn-cg (3:4, 데스크톱)

- 첫=끝 프레임: `cg/hero-mn-3x4.png`
- 상태: 채택

```text
A subtle cinemagraph from a locked-off, perfectly static camera. The thin thread of smoke from the ger's chimney keeps rising slowly upward, curling gently to the right as it climbs and fading into the pale sky, and the low veil of mist over the steppe drifts slowly from left to right; the ger, the frosted grass, the horizon and the sky stay completely still. Calm, quiet dawn. Seamless loop.
```

### hero-kr-cg (3:4, 데스크톱)

- 첫=끝 프레임: `cg/hero-kr-3x4.png`
- 상태: 채택 (스틸과 같은 채널 게인 그레이드 적용)

```text
A subtle cinemagraph from a locked-off, perfectly static camera. Small soft ripples travel slowly across the surface of the river toward the camera, the warm reflections on the water shimmer gently, and the thin veil of mist on the water drifts slowly from right to left; the far bank, the city silhouette, the bridge, the hill and the sky stay completely still. Calm, quiet dawn. Seamless loop.
```

### hero-mn-cg-m (9:16, 모바일)

- 첫=끝 프레임: `cg/hero-mn-9x16.png`
- 상태: **미채택** — 루프 중간 연기가 짙고 검게 피어오름. 재생성은 Grok 402(잔액 소진)로 불가 → 사용자 결정으로 모바일 몽골 패널은 정지 이미지 확정

```text
A subtle cinemagraph from a locked-off, perfectly static camera. The thin thread of smoke from the ger's chimney keeps rising slowly upward, curling gently to the right as it climbs and fading into the pale sky, and the low veil of mist over the steppe drifts slowly from left to right; the ger, the frosted grass, the horizon and the sky stay completely still. Calm, quiet dawn. Seamless loop.
```

### hero-kr-cg-m (9:16, 모바일)

- 첫=끝 프레임: `cg/hero-kr-9x16.png`
- 상태: 채택 (그레이드 적용)

```text
A subtle cinemagraph from a locked-off, perfectly static camera. Small soft ripples travel slowly across the surface of the river toward the camera, the warm reflections on the water shimmer gently, and the thin veil of mist on the water drifts slowly from right to left; the far bank, the city silhouette, the bridge, the hill and the sky stay completely still. Calm, quiet dawn. Seamless loop.
```

### p4-mn-cg / p4-kr-cg (3:4)

- 첫=끝 프레임: `cg/p4-*-3x4.png`
- 상태: 채택 (한국 쪽은 bowl 문구만 다른 동일 프롬프트)

```text
A subtle cinemagraph from a locked-off, perfectly static camera. Only the steam moves: a delicate plume of steam keeps rising from the bowl of milk tea, curling and twisting slowly upward into the dark background and dissolving near the top of the frame. The bowl, the tea surface, the table and the room stay completely still. Quiet, warm, intimate. Seamless loop.
```

### p5-kr-cg (3:4)

- 첫=끝 프레임: `cg/p5-kr-3x4.png`
- 상태: 채택 (1차 429 일시 오류 → 재시도 성공)

```text
A subtle cinemagraph from a locked-off, perfectly static camera. A soft breeze from an unseen window on the left gently lifts the translucent ivory silk, which sways slowly to the right and settles back, and the long terracotta ribbon swings softly a few centimetres; the wooden rod, the wall and the light stay completely still. Calm, airy, elegant. Seamless loop.
```

### finale-cg (16:9) / finale-cg-m (9:16)

- 첫=끝 프레임: `cg/finale-16x9.png, cg/finale-9x16.png`
- 상태: 채택

```text
A subtle cinemagraph from a locked-off, perfectly static camera. Only the steam moves: from each of the two bowls a delicate plume of steam keeps rising slowly, the two plumes curling toward each other and softly intertwining above the table before dissolving into the dark background. The bowls, the tea, the table and the room stay completely still. Quiet, warm, intimate. Seamless loop.
```

### hero-mn-cg-m 재생성 시도 (실행 안 됨 — 402)

```text
A subtle cinemagraph from a locked-off, perfectly static camera. From the ger's chimney rises a single very thin, pale, translucent wisp of smoke, almost white like breath in cold air, that climbs slowly and gently curls to the right before fading into the sky; it stays delicate and faint the whole time, never thick or dark. The low veil of mist over the steppe drifts slowly from left to right. The ger, the frosted grass, the horizon and the sky stay completely still. Calm, quiet dawn. Seamless loop.
```
