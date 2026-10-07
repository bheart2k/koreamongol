# 시안 D 「전시된 두 고향」 — 생성 프롬프트 기록

> 작성: 모형(D 워커) / 2026-10-07
> 이미지: Codex 내장 `image_gen` (`codex exec`, 1672×941 / 941×1672 PNG) — 영상 생성 없음(이번 라운드 제약)
> 원본: `.design-lab-src/d/img/` (git 제외) · 프롬프트 원문 파일: `.design-lab-src/d/prompts/` · 생성 도구: `.design-lab-src/d/gen.sh`
> 웹용: `public/design-lab/d/` (WebP)

모든 Codex 호출 앞에는 "Use the built-in image_gen tool exactly once … reply only with the saved image path." 지시문을 붙였다(레퍼런스는 `-i` 로 첨부, 절대 경로).

## 진행 이력 (기준 룩 프레임)

1. `k0-a/b/c.txt` 3종 비교 — 받침대 2개형(a·c) vs 긴 오크 테이블 + 브라스 테두리 받침(b) → **b 방향 선택**.
2. `k0-b-e1.txt`(image edit): 카메라를 조금 빼서 좌우 여백·상단 40% 헤드라인 벽 확보.
3. 아치 발이 강 속에 서 있음 → `k0-archfix.txt`(edit)로 초원 위 브라스 받침으로 이동 → PM 통과.
4. PM 보정 권고 '모래색 등고선 = 고비로 읽힘' → `flock.txt`(edit)로 몽골 모형에만 세이지 그린 플로킹. **서울 쪽은 원본 픽셀을 유지**하도록 두 모형 사이 틈(x 800–880px)에서 부드럽게 합성 → **k0.png 확정**.
5. 근접 프레임 K1: K0의 서울 영역 crop(x 50.5%, y 42%, w 48%)을 1672×941로 키운 뒤 `k1-rerender.txt`로 재렌더 → 원본 crop과 겹쳐도 잔상 없음(돌리 확대 끝에서 이음새 없이 교차).
6. 모바일: `m0-a.txt`(9:16 재구성) → `m0-edit.txt`(헤드라인 벽 확보·아치 착지점 보정) → `flock.txt` → **m0.png**. 근접 프레임은 세로 전용 구도 `m1-portrait.txt` → **m1.png** (crop 대신 초점 이동 교차).
7. 야간(다크모드): 같은 `night.txt`를 각 낮 이미지에 edit — 구도 유지 확인(K0 야간 crop ↔ K1 야간 정렬 OK).

## 최종 사용 이미지

| 웹 파일 | 원본 | 프롬프트 | 레퍼런스 |
|---|---|---|---|
| `k0.webp` | `img/k0.png` | k0-b → k0-b-e1 → k0-archfix → flock (+서울 쪽 원본 합성) | — |
| `k1.webp` | `img/k1.png` (=k1-b) | `k1-rerender.txt` | `img/k1-crop.png` (k0 crop 확대) |
| `m0.webp` | `img/m0.png` (=m0-flock-a) | m0-a → m0-edit → flock | k0-b-e1 |
| `m1.webp` | `img/m1.png` (=m1-a) | `m1-portrait.txt` | k1-a |
| `*-night.webp` (히어로 4종) | `img/*-night.png` | `night.txt` | 각 낮 프레임 |
| `r1-steppe ~ r6-culture(.webp, -m.webp)` | `img/r*.png` | `r*.txt` (r3 은 `r3-living-b.txt`) | r1: k0 / r2–r6: k1 |
| `r*-night(.webp, -m.webp)` | `img/r*-night.png` | `night.txt` | 각 낮 클로즈업 |
| `finale.webp` / `finale-m.webp` | `img/finale.png`(=finale-b) / `img/finale-m.png` | `finale.txt` / `finale-m.txt` | k0-night / m0-night |
| `cover.webp` (1600×1100) | `img/cover.png` | `cover-d.txt` 결과를 16:11 crop(x 176px~) 후 1600×1100 | k0 |

## 프롬프트 원문

### k0-b

```text
Editorial photograph of an architect's presentation: two precise architectural scale models of equal size placed side by side on one long, low exhibition table of pale European oak, in a quiet, minimal gallery with a seamless warm off-white wall. Camera at a three-quarter view about 35 degrees above, 70mm lens, shallow depth of field. Both models sit fully inside the frame in the lower sixty percent, with wide empty margins on the far left and far right; the table's crisp front edge runs along the bottom of the frame. The upper third of the frame is calm, empty wall reserved for a headline.

Each model is built on its own thin square base of cream board with a fine brushed-brass edge trim, with a clear gap of oak table between the two bases.

Left model, the Mongolian steppe: a wide, almost treeless landscape of gently rolling hills built from stacked laser-cut contour layers of cream board and pale basswood, the layer edges subtly visible like a topographic study model; low rounded hills along the back edge, no sharp peaks, no snow, no forest; a winding river inlaid in translucent deep-navy acrylic; three small white gers with a soft felt texture, each with a slim dark roof ring and a tiny wooden door; a few tiny brushed-brass horse figurines grazing on the open grassland.

Right model, a contemporary Seoul neighborhood in the white massing-model tradition, every building readable by its form alone, with calm open space between them: three slim apartment towers with fine horizontal balcony lines; a hospital with a tall frosted-acrylic atrium entrance; a compact bank block with a thin brushed-brass canopy; a tiny one-storey corner convenience store with a softly glowing frosted front; a subway entrance under a curved frosted-acrylic canopy with stairs going down; a bus shelter with one small deep-navy bus; a factory with a sawtooth roof and a slim chimney, with a few stacked shipping containers in terracotta and deep navy; a long low school beside a pale sports field; a small airport terminal with a sweeping wave roof beside a short runway along the model's left edge; and one hanok with a gracefully curved charcoal tile roof and warm wooden frame beside a small pond of navy acrylic. Streets are fine engraved lines in the cream base. Trees are sparse, minimal, abstract spheres of pale sage and muted gold flock.

A single thin brushed-brass wire rises from the steppe model in a high, graceful arch over the gap between the two models and descends to the start of the runway on the Seoul model, like a sculptural flight path; one tiny brushed-brass airplane is fixed on the arch near its highest point.

Lighting: a single soft gallery spotlight from the upper left as key light, long soft raking shadows that reveal the layered contours and the crisp building edges; gentle warm bounce; quiet ambient occlusion.

Materials: matte white and warm cream plaster and paper board, laser-cut basswood, fine brushed-brass details, translucent deep-navy acrylic for water and frosted acrylic for glass. Palette restrained and desaturated: warm off-white, cream, pale oak, with colour only as small accents in deep navy #1B2D4F, brushed brass gold #D4A843 and terracotta #C45B3E. Mood: calm, precise, quietly luxurious, museum-quality craftsmanship, adult and dignified, like an editorial photograph in an architecture magazine. Never toy-like: no bright primary colours, no soft rounded clay shapes, no cartoon styling, no plastic look. No people, no text, letters, numbers, signage, labels, plaques, logos, flags, national symbols or watermark anywhere.
```

### k0-b-e1

```text
Edit this exact photograph of two architectural scale models on a long pale-oak exhibition table and keep its style, materials, lighting, colours and every detail of both models identical — the Mongolian steppe model with its stacked contour hills, navy-acrylic river, three white felt gers and small brass horses; the Seoul model with its three slim apartment towers, airport terminal with wave roof, runway and small white airplane, central hospital with glass atrium, factory with chimney and terracotta and navy containers, long school with sports field, hanok with charcoal roof beside its navy pond, curved frosted subway canopy, bus shelter with the navy bus, glass convenience store and the bank with its brass canopy; the thin bases with brushed-brass edge trim; the soft diagonal beam of gallery light on the warm off-white wall. Changes:
1. Pull the camera back a little so the whole composition breathes: both models stay equal in size, now with clear empty margins of warm table and wall on the far left and the far right (about one twelfth of the frame width on each side), and the models sit in the lower half of the frame.
2. The upper forty percent of the frame is calm, empty warm off-white gallery wall with the soft diagonal light beam, reserved for a headline.
3. The thin brushed-brass wire arch now starts from the open grassland at the front-right corner of the steppe model (not from the river), rises in a smooth, graceful arc whose highest point sits just below the empty upper area, and comes down to touch the near end of the runway on the Seoul model; the tiny brass airplane stays fixed at the top of the arch.
4. The oak table's front edge runs straight across the lower part of the frame.
No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### k0-archfix

```text
Edit this exact photograph and keep absolutely everything identical — the camera, framing and composition, the warm off-white wall with its soft diagonal beam of light, the pale-oak table, both models with every hill, ger, horse, river bend, building, tree, the runway and airplane, the brushed-brass base trims, the colours and the lighting. Make only one change to the thin brushed-brass wire arch: its left foot no longer stands in the navy river; instead it rises from the open, flat grassland on the steppe model, between the three white gers and the river, slightly in front of the river, fixed into the grass with a tiny round brass foot. From there it keeps the same smooth, graceful arc with the tiny brass airplane at its top and still comes down at its right end to the runway on the Seoul model. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### flock

```text
Edit this exact photograph and keep absolutely everything identical — the camera, framing and composition, the warm off-white wall and its diagonal beam of light, the pale-oak table, the thin brushed-brass arch and the tiny brass airplane, the whole Seoul model with every building, tree, road, runway and airplane exactly as it is, both brushed-brass base trims, the lighting and the overall restrained colours. Change only the surface of the Mongolian steppe model so that it clearly reads as green summer grassland rather than sand or desert: cover the rolling ground and the stacked contour hills with a fine, soft, low-saturation sage-green model-making flock (scale-model grass powder), with subtle natural variation from muted sage to pale olive and a hint of dry gold on the hilltops, applied delicately so the stacked laser-cut contour layers and their crisp edges stay clearly visible underneath. Keep the minimal, refined architectural-model look — not realistic lawn, not bright green, not toy-like. Keep the navy-acrylic river, the three white felt gers, the small brass horses and the few tiny shrubs exactly as they are. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### k1-rerender

```text
The attached image is an enlarged, soft, low-resolution crop of a photograph of an architectural scale model of a Seoul neighbourhood on a pale-oak exhibition table. Re-render it as a crisp, high-resolution editorial photograph of the same model, as if shot with a sharp 100mm lens: keep the exact same composition, framing, camera angle and perspective, and keep every element in exactly the same position and at exactly the same size — the three slim apartment towers at the back, the airport terminal with its sweeping white wave roof, the runway on the left with the small white airplane, the thin brushed-brass wire arriving at the end of the runway from the upper left, the central hospital with its tall glass atrium, the factory with sawtooth roof, slim chimney and stacked terracotta and navy containers, the long school and its pale sports field, the hanok with curved charcoal tile roof beside the small navy-acrylic pond, the curved frosted subway canopy, the bus shelter with the small deep-navy bus, the small glass convenience store with warm light, the compact bank with its thin brass canopy, the sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and its brushed-brass edge trim, the oak table and the warm off-white wall. Add only fine, believable model-making detail and texture: crisp laser-cut edges, delicate window mullions, balcony lines, paper and plaster grain, the slight translucency of the frosted acrylic, the soft sheen of brushed brass. Same warm gallery light from the upper left with soft shadows, same restrained colours. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### m0-a

```text
The same museum exhibition as the reference, recomposed for a tall 9:16 phone screen, in exactly the same photographic style, materials, colours and gallery lighting: the same two architectural scale models, equal in size, now placed one behind the other on the same long pale-oak exhibition table, seen from a steeper angle about 45 degrees from above with a 50mm lens and gentle depth of field. The upper third of the frame is calm, empty, warm off-white gallery wall with one soft diagonal beam of light falling from the upper left, left empty for a headline. Below it, further back on the table, the Mongolian steppe model: stacked laser-cut contour hills of cream board and pale basswood, a winding river of translucent deep-navy acrylic, three small white felt gers and a few small brushed-brass horses. In front of it, closer to the camera and filling the full width of the frame with a slim margin on each side, the Seoul model in white and cream massing-model style with every building readable by form alone: three slim apartment towers, an airport terminal with a sweeping wave roof and a short runway with one small white airplane, a hospital with a tall frosted-glass atrium, a factory with a sawtooth roof and slim chimney beside terracotta and navy containers, a long low school with a pale sports field, a hanok with a curved charcoal tile roof beside a small navy pond, a curved frosted subway canopy, a bus shelter with one small deep-navy bus, a tiny glass convenience store glowing warmly, and a compact bank with a thin brass canopy. Both models sit on thin cream bases with fine brushed-brass edge trim. A single thin brushed-brass wire arch rises from the open grassland of the steppe model, curves gracefully forward through the air with one tiny brass airplane at its top, and comes down to the runway of the Seoul model. The crisp front edge of the oak table runs across the bottom of the frame.

Palette restrained and desaturated: warm off-white, cream, pale oak, with colour only as accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Calm, precise, quietly luxurious, museum-quality craftsmanship; never toy-like, no bright primary colours, no rounded clay shapes. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### m0-edit

```text
Edit this exact photograph of two architectural scale models on a long pale-oak exhibition table and keep its style, materials, colours, lighting and every detail of both models identical. Changes:
1. Move the camera slightly so that the whole table, with both models, sits a little lower in the frame: the upper forty percent of the frame becomes calm, empty, warm off-white gallery wall with the soft diagonal beam of light, completely free of any object.
2. The thin brushed-brass wire arch is lower and gentler: it rises from the open grassland of the steppe model in front of the river, its highest point (with the tiny brass airplane fixed on it) sits just above the steppe model, well below the empty upper wall area, and it comes down onto the near end of the runway on the Seoul model, next to the small white airplane — not onto the terminal roof.
3. The front edge of the oak table still runs across the bottom of the frame.
No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### m1-portrait

```text
The same architectural scale model of a Seoul neighbourhood as the reference, photographed for a tall 9:16 phone screen: the camera is higher and looks down more steeply, about 55 degrees from above, rotated so the model's long side runs from the top to the bottom of the frame, and the model fills almost the full width of the frame with a slim margin of pale-oak table on each side, its depth filling most of the height. Every building keeps its relative position and stays large, clearly separated and readable: the airport terminal with its sweeping white wave roof and the runway with the small white airplane, with the thin brushed-brass wire arriving onto the runway from above; the three slim apartment towers; the hospital with its tall glass atrium; the factory with sawtooth roof, slim chimney and stacked terracotta and navy containers; the long school with its pale sports field; the hanok with its curved charcoal tile roof beside the small navy pond; the curved frosted subway canopy over stairs; the bus shelter with the small deep-navy bus; the small glass convenience store with warm light; the compact bank with its thin brass canopy. Sparse sage and muted-gold flocked trees. The cream base with engraved streets and brushed-brass edge trim. A thin band of warm off-white gallery wall at the very top, the oak table at the bottom. Same warm gallery spotlight from the upper left, long soft shadows, gentle depth of field. Palette restrained: cream, warm white, pale oak, accents in deep navy #1B2D4F, brushed brass #D4A843, terracotta #C45B3E. Museum-quality, calm, precise; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### night

```text
The exact same photograph — identical camera, framing and composition, every model, building, tree, road, ger, horse, river, the brushed-brass arch and airplane, the bases, the table, all in exactly the same place and size — re-lit as the museum gallery after dark, for a night exhibition. The wall falls into a deep, calm navy darkness (#0E1729 to #1B2D4F), with only a faint warm glow where a narrow, soft-edged spotlight from high above falls onto the models; the diagonal daylight beam is gone. Inside the models, tiny warm LEDs glow: the windows of the apartment towers, hospital atrium, school, bank and airport terminal glow warm gold in a natural mix (not every window lit); the small glass convenience store glows brightest and spills warm light onto the street; fine warm street lamps line the engraved roads; the bus has soft headlights; the frosted subway canopy glows softly from within; the hanok's paper doors glow amber and reflect in the navy pond. Where the steppe model with gers is present, the gers glow softly at their doors, the sage grass falls into gentle shadow and the river catches a cool reflection. The brushed-brass arch and airplane catch the spotlight as a thin bright gold line. The oak table falls into warm shadow with a soft pool of light under the models. Cool moonlike rim light on the white surfaces, warm interior light as the contrast. Quiet, luxurious, museum-quality. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r1-steppe

```text
A close, low three-quarter detail photograph of the Mongolian steppe model from the reference: wide rolling grassland of fine sage-green flock over stacked laser-cut contour layers whose crisp edges show on the hillsides, a hint of dry gold on the hilltops; three small white gers with soft felt texture, slim dark roof rings and tiny wooden doors; a few small brushed-brass horses grazing; the winding river of translucent deep-navy acrylic with layered cream banks. On one side the thin brushed-brass wire rises from the grass on its tiny round brass foot and curves up and out of the frame. The model's brushed-brass base edge runs along the bottom of the frame above the oak table.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r2-arrive

```text
A close three-quarter detail photograph of the airport corner of the Seoul model from the reference: the terminal with its sweeping white wave roof, slim mullioned glass facade and small skylights; beside it the pale-grey runway with fine white markings and the small white airplane; the thin brushed-brass wire arch descends from the upper left and touches down at the end of the runway on a tiny round brass foot. A few flocked trees and an engraved curb road in the foreground.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r3-living-b

```text
A close three-quarter detail photograph of the residential corner of the Seoul model from the reference: the three slim white apartment towers with fine horizontal balcony lines rising behind; in front of them, along a quiet engraved street, the compact cream bank building with its thin brushed-brass canopy and a few steps, and the tiny one-storey glass convenience store glowing with warm light. Sparse sage and muted-gold flocked trees line the street.
A close, intimate three-quarter detail photograph of one residential corner of the Seoul model from the reference, with the camera low and near: the three slim white apartment towers with fine horizontal balcony lines rise large in the background, cropped by depth of field; in the middle ground, along one quiet engraved street, the compact cream bank building with its thin brushed-brass canopy and a few steps; in the foreground, the tiny one-storey glass convenience store glowing with warm light, sharp and in focus. Only these three subjects — no airport, no factory, no runway, no other buildings in view. A few sage and muted-gold flocked trees line the street.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r4-work

```text
A close three-quarter detail photograph of the factory on the Seoul model from the reference: the long cream factory with its sawtooth roof of pale grey panels and a tall slim cream chimney with a fine brass ring at its top, and beside it neatly stacked shipping containers in terracotta and deep navy on a clean pale yard, a few flocked trees around. The model's brushed-brass base edge appears at the lower right.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r5-health

```text
A close three-quarter detail photograph of the hospital on the Seoul model from the reference: the calm cream hospital block with rows of fine windows and a tall frosted-glass atrium entrance with a slim warm-lit canopy, on a pale clean forecourt with engraved paths, framed by a few sage and muted-gold flocked trees.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### r6-culture

```text
A close three-quarter detail photograph of the hanok corner of the Seoul model from the reference: the small traditional hanok with gracefully curved charcoal tile roof eaves, a warm wooden frame and cream paper doors, beside a still pond of translucent deep-navy acrylic edged with small pale stones and flocked trees in sage and muted gold; behind it, softly out of focus, the long cream school building and its pale sports field.

Same materials as the reference: matte white and cream plaster and paper board, laser-cut basswood, brushed brass, translucent deep-navy acrylic water, frosted acrylic glass, sparse sage and muted-gold flocked trees, the cream base with fine engraved streets and brushed-brass edge trim, the pale-oak exhibition table. Photographed like a detail plate in an architecture exhibition catalogue: 100mm macro lens, shallow depth of field with a soft, creamy falloff, warm gallery spotlight from the upper left with long soft shadows, calm warm off-white gallery wall softly out of focus where the background shows. Composition: one clear subject, with the important elements inside the central three quarters of the frame width, generous calm space around it. Palette restrained and desaturated: cream, warm white, pale oak, sage, with accents in deep navy #1B2D4F, brushed brass #D4A843 and terracotta #C45B3E. Museum-quality, precise, quietly luxurious; never toy-like. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### finale

```text
The same museum exhibition after dark, photographed from a lower, closer viewpoint with an 85mm lens: the thin brushed-brass wire arch with the tiny brass airplane at its highest point is the hero, sharp and caught by a narrow, soft-edged warm spotlight so it reads as a fine glowing gold line against a deep, calm navy wall (#0E1729 to #1B2D4F). Below it, softly out of focus, the two models glow: on the left the sage-green steppe model with the three white gers glowing warmly at their doors; on the right the white Seoul model with warm-lit windows and tiny street lamps; the arch rises from the steppe and lands on the Seoul model's runway. The oak table glows in a warm pool of light at the bottom of the frame. The upper half of the frame is the quiet navy wall with the arch's apex in the upper-middle area; the lower part of the frame, below the models, is calm dark wood suitable for text overlay. Serene, luxurious, museum-quality, deep navy and warm gold. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

### cover-d

```text
The exact same photograph — same museum exhibition, same two models with every detail, the brushed-brass arch and airplane, the pale-oak table top, the warm off-white wall with its diagonal light beam, same camera angle, lighting and colours — with only one change: the camera is pulled back just a little, so that both models together, with the whole arch, now occupy the central seventy percent of the frame width, leaving a calm margin of oak table top and wall of about fifteen percent of the frame width on the far left and on the far right. The table top still fills the lower part of the frame and its front edge still runs straight across near the bottom; no table legs and no floor are visible. The models sit between thirty-five and eighty-five percent of the frame height. No people, no text, letters, numbers, signage, labels, logos, flags, national symbols or watermark anywhere.
```

- `finale-m.txt`: finale.txt 와 같고 'Portrait 9:16 … the steppe model further back and the Seoul model in front' 로 바꿈.
