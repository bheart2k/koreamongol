# 시안 C 「살아있는 지도」 — 생성 프롬프트 기록

> 작성: 지도(C 워커) / 2026-10-07  
> 이미지: Codex 내장 `image_gen` (`codex exec`, 1672×941 / 941×1672 / 1448×1086 PNG)  
> 영상: Grok `reference_to_video` 720p (루프 6종만 생성 — 히어로 플라이스루 4종은 잔액 소진(402)으로 미생성, 사용자 결정으로 영상 없이 진행)  
> 원본: `.design-lab-src/c/` (git 제외) · 웹용: `public/design-lab/c/`

## 진행 이력 (기준 룩 프레임)

1. `k0-desktop*.txt` 5종 비교 → 클레이 슬랩 방향(v3) 선택 → 은행·학교 현대화·한옥 추가(v7).
2. PM 피드백 ① 몽골 섬이 부속물처럼 작음 ② 'AI 3D'처럼 촘촘함 ③ 장소 판독성 → `k0-v2-equal.txt`로 두 섬 대등·양식화·실루엣 구분 재생성 → `k0-v2-pullback.txt`로 여백 확보.
3. PM 피드백 '몽골 섬이 알프스처럼 보임' → `k0-mgl-fix.txt`(image edit)로 나무 없는 완만한 초원 구릉으로 보정 → **k0-day.png 확정**.
4. PM 피드백 '비행기가 정점에서 시작·터미널 지붕으로 착륙' → 시작 프레임(몽골 섬 이륙 직후, `k0-start.txt`)과 끝 프레임(서울 섬 활주로 착륙, `k1-end-runway.txt`)을 따로 편집해 **k0-start / k1-end** 로 교체.

## 최종 사용 이미지

| 웹 파일 | 원본 | 프롬프트 | 레퍼런스 |
|---|---|---|---|
| `k0-start.webp` | `img/k0-start.png` | `k0-start.txt` | k0-day.png + k1-end.png |
| `k1-end.webp` | `img/k1-end.png` | `k1-end-runway.txt` | k1-day.png (k1-settle.txt 파생) |
| `m0-start.webp` | `img/m0-start.png` | `m0-start.txt` | m0-day.png (m0-mobile.txt) + m1-end.png |
| `m1-end.webp` | `img/m1-end.png` | `m1-end-runway.txt` | m1-day.png (m1-settle.txt 파생) |
| `*-night.webp (히어로 4)` | `img/*-night.png` | `night.txt` | 각 낮 프레임 |
| `c1~c6 *.webp, *-m.webp` | `img/c*.png` | `closeups/*.txt` | k0-day.png(c1) / k1-day·k1-end.png(c2~c6) |
| `c1~c6 *-night*.webp` | `img/c*-night.png` | `night.txt` | 각 낮 클로즈업 |

## 프롬프트 원문

모든 Codex 호출 앞에는 "Use the built-in image_gen tool exactly once … reply only with the saved image path." 지시문을 붙였다(레퍼런스가 있으면 `-i`로 첨부).

### 기준 전경 (두 섬 대등) — k0-v2-equal.txt

```text
A stylized premium 3D clay illustration of two floating island homelands of equal importance, side by side in a calm pastel morning sky, joined by one luminous gold flight path. Three-quarter view from about 35 degrees above, both islands fully inside the frame with generous breathing room around them. The upper third of the frame is quiet open sky reserved for a headline.

Left island, Mongolia, as large and as visually weighty as the right one: rolling green-gold steppe rising to soft sculpted mountains at its back, a winding mirror-blue river, a small family of three white felt gers with warm doorways and thin smoke curls, a few horses grazing. Right island, a contemporary Seoul neighborhood. Both islands rest on the same clean rounded slab with neat layers of cream, sand and deep navy.

On the Seoul island, few large simple buildings, each instantly recognizable by silhouette, colour and one prop, with open space between them: three slim cream apartment towers with horizontal balcony bands (home); a white hospital with a big frosted-glass atrium and a white ambulance with a terracotta stripe at its door; a compact bank clad in deep navy with a warm gold canopy; a tiny one-storey corner convenience store with a glowing glass front and two little outdoor tables with a cream parasol; a subway entrance under a curved frosted-glass canopy with stairs going down; a bus shelter with one rounded deep-navy city bus; a factory with a sawtooth roof, a tall slim chimney and stacked terracotta and navy cargo containers; a long four-storey cream school facing a sand-coloured sports field with two small goals; a small airport terminal with a sweeping white wave roof at the island's edge facing the flight path; and one hanok with a curved charcoal tile roof by a small pond.

Style: unified matte clay material with smooth softly rounded edges and simplified geometry, frosted glass as the only second material, very low micro-detail, no people, almost no small props, trees as a few smooth rounded clay forms in sage and muted gold. Soft global illumination, gentle ambient occlusion, warm low sun from the upper left, soft long shadows. Restrained palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Calm, elegant, adult, like a high-end design studio key visual; refined proportions, never toy-like or cartoonish.

The gold flight path rises from the steppe island in a graceful arc and descends to the airport terminal, with one small white airplane on it. Soft matte clouds drift beneath the islands. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

### 기준 전경 여백 조정 — k0-v2-pullback.txt

레퍼런스: k0e-a.png

```text
The same stylized premium 3D clay illustration as the reference, with the camera pulled back a little so the whole composition breathes. Both floating islands are fully inside the frame with wide empty sky margins on the far left and far right (at least a tenth of the frame width on each side), and they sit in the lower sixty percent of the frame. The upper third is calm open pastel sky, a smooth gradient from pale sky blue to warm cream, empty and reserved for a headline. The two islands keep equal size and equal visual weight, side by side with a clear gap of sky between them, joined by the luminous gold flight path that rises from the steppe island in a graceful arc and descends to the airport terminal, with one small white airplane at the top of the arc.

Keep the left Mongolian island exactly as in the reference (sculpted mountains at the back, winding mirror-blue river, three white felt gers with warm doorways and smoke curls, horses) and the right Seoul island exactly as in the reference (three slim cream apartment towers, white hospital with frosted-glass atrium and ambulance, deep-navy bank with gold canopy, convenience store with parasol tables, airport terminal with wave roof and small control tower, sawtooth factory with chimney and terracotta and navy containers, school with sand-coloured sports field, curved frosted-glass subway canopy, navy buses, hanok with charcoal tile roof by a pond). Both islands on the same clean rounded slab with layers of cream, sand and deep navy.

Unified matte clay with softly rounded edges and frosted glass, very low micro-detail, no people. Soft global illumination, warm low sun from the upper left, soft long shadows. Palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Soft matte clouds beneath the islands. Calm, elegant, adult; never toy-like. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

### 몽골 섬 보정 — k0-mgl-fix.txt

레퍼런스: k0p-a.png → 결과 k0-day.png

```text
Edit only the left floating island so it reads unmistakably as the Mongolian steppe; keep everything else in the image exactly the same — the right Seoul island and all its buildings, the gold flight path and airplane, the sky, the clouds, the camera, the framing, the island positions and sizes, the layered cream, sand and deep navy slab, the lighting and the matte clay style.

On the left island: replace the sharp snowy alpine peaks and the many leafy trees with a vast, almost treeless steppe — wide gently rolling grassland hills in soft green-gold, broad open grass colour everywhere, and low, rounded, softly eroded distant hills along the back edge, smooth and calm with no sharp peaks and no snow. Keep the winding mirror-blue river, with only a few small shrubs along its banks and no other trees. Keep the three white felt gers with warm doorways and thin smoke curls, and the few horses grazing on the open grass. Same matte clay rendering, smooth surfaces, very low micro-detail. No text, letters, signage, logos, flags, national symbols or watermark anywhere.
```

### 정착 구도 (데스크톱) — k1-settle.txt

레퍼런스: k0-day.png → k1-day.png

```text
The same stylized premium 3D clay illustration as the reference, but the camera has flown along the gold flight path and settled closer over the right-hand Seoul island: the Seoul island now fills most of the frame, centered, seen from the same three-quarter angle about 40 degrees from above, so every building is large and instantly readable. The rounded layered slab edge of cream, sand and deep navy is visible along the lower part of the frame, and a band of calm pale sky with soft matte clouds surrounds the island. The Mongolian island is out of frame; the gold flight path enters from the upper-left and descends to the airport terminal.

Keep exactly the same buildings, positions and layout as on the reference Seoul island, each separated by open space: the airport terminal with sweeping white wave roof and small control tower at the back-left with a small plane on the apron; the three slim cream apartment towers at the back-center; the white hospital with frosted-glass atrium and a white ambulance with terracotta stripe at the back-right; the compact deep-navy bank with warm gold canopy at the right; the small convenience store with glowing glass front and cream parasol tables at the right; the sawtooth-roof factory with tall slim chimney and stacked terracotta and navy containers in the center; the long cream school with sand-coloured sports field and two small goals at the left; the curved frosted-glass subway canopy over stairs at the front-center; the two rounded deep-navy buses at the center-right; and the hanok with curved charcoal tile roof beside a small pond at the front-right. Smooth rounded clay trees in sage and muted gold.

Unified matte clay with softly rounded edges and frosted glass, very low micro-detail, no people. Soft global illumination, warm low sun from the upper left, soft long shadows, gentle ambient occlusion. Palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Calm, elegant, adult; never toy-like. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

### 정착 구도 활주로 착륙 — k1-end-runway.txt

레퍼런스: k1-day.png → k1-end.png (모바일은 같은 프롬프트를 9:16로: m1-end-runway.txt)

```text
Edit this exact image and keep everything else identical — camera, framing, the island's shape and layered slab, every building in its exact position (airport terminal and control tower, apartment towers, hospital and ambulance, navy bank, convenience store, factory with chimney and containers, school and sports field, subway canopy, buses, hanok and pond), all trees, the sky, the clouds, the light and the matte clay style. Changes:
1. Along the open left rim of the island, in front of and to the left of the airport terminal, add one short, clean pale-grey runway strip with soft white centre dashes, running diagonally from the island's left edge toward the terminal, in clear open ground that does not touch or overlap any building, tree or road.
2. One small white airplane has just landed and is rolling on that runway, near its far end close to the terminal, sitting flat on the runway surface.
3. Remove the small parked airplane from the apron.
4. The thin luminous gold flight path comes down from the upper-left sky in a smooth arc, lines up with the runway direction, and ends exactly at the near (left-edge) end of the runway; it no longer touches the terminal roof.
No text, letters, numbers, signage, logos, flags, national symbols or watermark anywhere.
```

### 시작 프레임 이륙 — k0-start.txt

레퍼런스: k0-day.png + k1-end.png → k0-start.png (모바일: m0-start.txt)

```text
Edit the first image and keep everything else identical — camera, framing, both islands' shapes, sizes and positions, the Mongolian steppe with gers, horses and river, every building on the Seoul island in its exact position, the sky, the sun, the clouds, the light and the matte clay style. Changes:
1. The small white airplane has just taken off from the Mongolian steppe island: it is now low in the sky just above the right edge of the Mongolian island, nose pointing up and to the right, beginning to climb toward the Seoul island.
2. The long gold flight arc between the islands is removed; only a very short, thin luminous gold trail remains directly behind the airplane, starting from the Mongolian island's right edge.
3. On the Seoul island, add the same short pale-grey runway with soft white centre dashes that the second image shows along the island's left rim beside the airport terminal, empty, not touching any building.
4. Remove the small parked airplane from the Seoul island's apron.
No text, letters, numbers, signage, logos, flags, national symbols or watermark anywhere.
```

### 모바일 전경 9:16 — m0-mobile.txt

레퍼런스: k0-day.png → m0-day.png

```text
The same stylized premium 3D clay world as the reference, recomposed for a tall 9:16 phone screen with the two floating islands stacked vertically, equal in size and visual weight, both fully inside the frame with clear sky margins on the left and right. The top quarter of the frame is calm open pastel sky, a smooth gradient from pale sky blue to warm cream, left empty for a headline. Below it, the Mongolian island floats slightly left of center: vast almost treeless gently rolling green-gold steppe hills with low rounded distant hills at its back, a winding mirror-blue river with a few shrubs on its banks, three white felt gers with warm doorways and smoke curls, a few horses. Under it, with a gap of sky between, the Seoul island floats slightly right of center with the same buildings as the reference: three slim cream apartment towers, white hospital with frosted-glass atrium and ambulance, deep-navy bank with gold canopy, convenience store with parasol tables, airport terminal with wave roof and small control tower, sawtooth factory with slim chimney and terracotta and navy containers, school with sand-coloured sports field, curved frosted-glass subway canopy, deep-navy buses, hanok with charcoal tile roof by a pond. Both islands sit on the same clean rounded slab with layers of cream, sand and deep navy. The luminous gold flight path curves from the Mongolian island down to the airport terminal of the Seoul island, with one small white airplane on it. Soft matte clouds drift beneath and between the islands.

Seen from a three-quarter angle about 35 degrees from above. Unified matte clay with softly rounded edges and frosted glass, very low micro-detail, no people. Soft global illumination, warm low sun from the upper left, soft long shadows. Palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Calm, elegant, adult; never toy-like. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

### 모바일 정착 9:16 — m1-settle.txt

레퍼런스: k1-day.png → m1-day.png

```text
The same stylized premium 3D clay Seoul neighborhood island as the reference, reframed for a tall 9:16 phone screen: the camera is closer and looks down more steeply, about 55 degrees from above, so the round island fills the full width of the frame and its depth fills most of the height. Every building keeps the same relative position as in the reference and stays large, separated and instantly readable: airport terminal with sweeping white wave roof and small control tower with a small plane at the top-left; three slim cream apartment towers at the top-center; white hospital with frosted-glass atrium and white ambulance with terracotta stripe at the top-right; deep-navy bank with warm gold canopy at the right; small convenience store with glowing glass front and cream parasol tables at the middle-right; sawtooth-roof factory with tall slim chimney and stacked terracotta and navy containers in the center; long cream school with sand-coloured sports field and two small goals at the middle-left; two rounded deep-navy buses at the lower-center; curved frosted-glass subway canopy over stairs at the lower-left; hanok with curved charcoal tile roof beside a small pond at the bottom-right. Smooth rounded clay trees in sage and muted gold.

A thin band of calm pale sky with a glowing sun at the very top, the gold flight path entering from the top-left and descending to the airport terminal, and the rounded layered slab edge of cream, sand and deep navy visible along the bottom above soft matte clouds. Unified matte clay with softly rounded edges and frosted glass, very low micro-detail, no people. Soft global illumination, warm low sun from the upper left, soft long shadows. Palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Calm, elegant, adult; never toy-like. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

### 야간 변형 (공통) — night.txt

```text
The exact same image — identical camera, framing, composition, island shapes and positions, every building, prop, tree, road and the gold flight path in exactly the same place — re-lit as a calm, luxurious blue-hour night. The sky becomes a deep navy #1B2D4F gradient fading to a soft indigo near the horizon, with a fine scattering of tiny stars and a thin crescent moon high in the upper area; the sun is gone. The clouds below become soft moonlit blue-grey. Windows of the apartments, hospital, school, bank and airport terminal glow warm gold from inside in a natural mix (not every window lit); the convenience store glows brightest, spilling warm light onto its parasol tables; small warm street lamps line the roads; the buses and the ambulance have soft headlights; the subway glass canopy glows from within; the hanok's paper doors glow amber and reflect in the pond. Where a Mongolian steppe island with gers is present, its gers glow warm through their doorways and their smoke curls catch the moonlight, the river reflects the moon, horses are soft silhouettes. The gold flight path glows brighter like a thread of light and the airplane carries tiny navigation lights. Cool moonlight rim on the matte clay, warm interior light as the contrast. Same unified matte clay and frosted glass style, very low micro-detail, no people. Serene, elegant, adult. No text, letters, numbers, signage, logos, flags, national symbols or watermark anywhere.
```

### 장소 클로즈업 (4:3) — closeups/

공통 꼬리말:

```text
Same stylized premium 3D clay rendering as the reference: unified matte clay with softly rounded edges and frosted glass, very low micro-detail, no people, smooth rounded clay trees in sage and muted gold. Soft global illumination, warm low morning sun from the upper left, long soft shadows, gentle ambient occlusion, delicate tilt-shift depth of field so the background softly blurs. Palette: cream #FAF6F0, pale sky #E8F0FE, deep navy #1B2D4F, muted gold #D4A843, touches of terracotta #C45B3E. Calm, elegant, adult, like a high-end design studio key visual; never toy-like. Simple, uncluttered composition with one clear subject, suitable for gentle animation. No text, letters, numbers, signage, logos, flags, national symbols, crosses or watermark anywhere.
```

- **c1-steppe**: A closer view of the Mongolian steppe island from the reference, seen from a low three-quarter angle near its edge: a vast, almost treeless, gently rolling green-gold grassland with low rounded hills behind; three white felt gers with warm doorways and thin smoke curls rising; a few horses grazing on the open grass; the winding mirror-blue river curving through the scene with a few small shrubs on its banks. The layered cream, sand and deep navy slab edge of the island runs along the bottom of the frame above soft clouds. In the upper right sky, the thin luminous gold flight path rises gracefully away from the island with one small white airplane on it.

- **c2-airport-runway**: A closer view of the airport corner of the Seoul island from the reference: the terminal with its sweeping white wave roof, tall glass facade and small round control tower; beside it, along the island's rim, the short pale-grey runway with soft white centre dashes, where one small white airplane has just landed and is rolling toward the terminal; the thin luminous gold flight path descends from the upper-left sky in a smooth arc and ends exactly at the near end of the runway, never touching the terminal roof; in the foreground a curb road where one rounded deep-navy city bus waits. The layered cream, sand and deep navy slab edge of the island and soft clouds are visible at the lower-left edge.

- **c3-living**: A closer view of a residential corner of the Seoul island from the reference: the three slim cream apartment towers with horizontal balcony bands rising behind, and in front of them along a quiet street the compact deep-navy bank building with its warm gold canopy and the small one-storey convenience store with a softly glowing glass front and two little outdoor tables under a cream parasol. Rounded clay trees line the street.

- **c4-work**: A closer view of the factory on the Seoul island from the reference: the long cream factory with its sawtooth roof of slate-blue panels and a tall slim cream chimney with a terracotta band, and beside it neatly stacked cargo containers in terracotta and deep navy on a clean pale yard, a few rounded clay trees around. The layered slab edge of the island and soft clouds appear at the bottom-right edge.

- **c5-health**: A closer view of the hospital on the Seoul island from the reference: the calm white hospital building with a tall frosted-glass atrium entrance and a slim canopy, and a small white ambulance with a single terracotta stripe parked at its door, on a pale clean forecourt framed by rounded clay trees.

- **c6-culture**: A closer view of the riverside corner of the Seoul island from the reference: the small traditional hanok with gracefully curved charcoal tile roof eaves, warm wooden frame and cream paper doors, beside a still mirror-like pond edged with smooth pale stones and rounded clay trees in sage and muted gold; behind it, slightly softened by depth of field, the long cream four-storey school building beside its sand-coloured sports field.

## Grok 영상 (reference_to_video, 720p, 6초)

### 생성·사용: 장소 루프 (first_frame = last_frame = 클로즈업, 4:3)

- **loop-c1**: The camera stays completely locked and every building, island and object stays perfectly still and solid in place; only this subtle ambient motion happens, and the clip returns seamlessly to its opening frame: thin white smoke curls rise slowly from the gers and fade, the grass ripples softly in a breeze, sunlight glints on the river, the horses lower their heads to graze, soft clouds drift slowly below.
- **loop-c3**: The camera stays completely locked and every building, island and object stays perfectly still and solid in place; only this subtle ambient motion happens, and the clip returns seamlessly to its opening frame: warm lights glow and softly brighten in a few apartment windows, the cream parasol sways slightly, the rounded trees sway gently in a breeze, soft clouds drift slowly in the distance.
- **loop-c4**: The camera stays completely locked and every building, island and object stays perfectly still and solid in place; only this subtle ambient motion happens, and the clip returns seamlessly to its opening frame: a soft plume of white steam rises slowly from the tall chimney and drifts away to the right, the rounded trees sway gently, soft clouds drift slowly below.
- **loop-c5**: The camera stays completely locked and every building, island and object stays perfectly still and solid in place; only this subtle ambient motion happens, and the clip returns seamlessly to its opening frame: the ambulance's roof light pulses with a soft warm glow, sunlight glints slowly across the glass atrium, the rounded trees sway gently, soft clouds drift slowly in the distance.
- **loop-c6**: The camera stays completely locked and every building, island and object stays perfectly still and solid in place; only this subtle ambient motion happens, and the clip returns seamlessly to its opening frame: soft ripples spread across the pond and its reflections shimmer, the rounded trees sway gently in a breeze, a few small golden leaves drift down onto the water, soft clouds drift slowly in the distance.

- loop-c2(공항)는 생성했으나, 공항 클로즈업을 활주로 착륙 장면으로 교체하면서 사용 중단(새 루프는 미생성).

### 미생성: 히어로 플라이스루 (402 Payment Required)

| 컷 | 비율 | first → last |
|---|---|---|
| hero-day | 16:9 | k0-start.png → k1-end.png |
| hero-night | 16:9 | k0-start-night.png → k1-end-night.png |
| hero-m-day | 9:16 | m0-start.png → m1-end.png |
| hero-m-night | 9:16 | m0-start-night.png → m1-end-night.png |

프롬프트(데스크톱):

```text
The small white airplane takes off from just above the right edge of the Mongolian steppe island on the left, climbs in a smooth rising arc across the open sky between the two islands, reaches the top of the arc above the gap, then descends toward the Seoul island on the right and touches down on the short runway at that island's left rim, rolling to a stop near the terminal. A thin glowing gold trail draws itself behind the airplane along this path. At the same time the camera glides slowly forward and down toward the Seoul island, ending in a closer, centered view above it. The islands, buildings and trees stay perfectly still and solid, and the airplane never passes through any building.
```

프롬프트(모바일):

```text
The small white airplane departs from just beside the lower-right edge of the Mongolian steppe island at the top of the frame, flies in a smooth curve down through the open sky toward the Seoul island below, and touches down on the short runway at that island's left rim, rolling to a stop near the terminal. A thin glowing gold trail draws itself behind the airplane along this path. At the same time the camera glides slowly down and forward toward the Seoul island, ending in a closer, centered view above it. The islands, buildings and trees stay perfectly still and solid, and the airplane never passes through any building.
```

영상이 생기면: `node scripts/design-lab/video2frames.mjs .design-lab-src/c/video/hero-day.mp4 --out public/design-lab/c/seq-day --fps 15 --width 1280 --quality 68` (모바일 `seq-m-day`, `--preset mobile`) 후 `src/app/design-lab/c/content.js`의 `seq` 경로만 채우면 캔버스 스크럽이 자동으로 켜진다.
