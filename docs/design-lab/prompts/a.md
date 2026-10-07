# 시안 A 「같은 하늘 아래」 — 생성 프롬프트 기록

> 작성: 하늘(시안 A 워커) / 2026-10-07
>
> - 이미지: Codex 내장 `image_gen` (`codex exec`, 비대화형). 실제 출력 크기는 크기 지정 요청과 무관하게 **16:9 = 1672×941, 9:16 = 941×1672** 고정.
> - 영상: Grok `reference_to_video` (first/last frame 고정, 720p). 루프는 같은 이미지를 first=last로 고정.
> - 원본: `.design-lab-src/a/img/*.png`, `.design-lab-src/a/video/*.mp4` (git 제외) · 웹용: `public/design-lab/a/`
> - 이미지 프롬프트 공통 앞부분("Use your built-in image generation tool (image_gen) to create exactly ONE image … Do not write code …")은 생략.
> - 공통 금지: 글자·로고·워터마크·국기·국가 상징. 인물은 뒷모습·실루엣만.

## 1. 기준 룩 프레임 K1 (새벽 초원)

| 버전 | 방식 | 판정 |
|---|---|---|
| v1 | 새로 생성 | 탈락 — 오렌지 과채도, 스톡 사진 느낌 |
| **v2** | v1 편집(재그레이딩) | **채택** — 골드 하이라이트·딥네이비 섀도·계곡 안개 |
| v3 | 새로 생성 | 탈락 — 설산·나무로 알프스처럼 보임 |

**v1 프롬프트**

> A cinematic photographic still from a national tourism campaign film: the first minute of dawn on the Mongolian steppe, the sun just breaking the horizon. A single white felt ger stands small on the lower-left third of a vast, gently rolling grassland; a thin ribbon of wood smoke rises from its stove pipe and bends softly to the right in the still air. Behind it, three layered mountain ridges recede into pale morning haze, each fainter than the last. On a low rise on the right third, three horses stand as quiet dark silhouettes, their outlines rim-lit in gold. The sun sits exactly on the horizon right of center, producing a soft horizontal anamorphic lens flare streak and gentle bloom. The sky fills the upper two thirds of the frame and is calm and open, graded from warm gold just above the horizon through a pale desaturated band to deep navy blue at the top, with a few thin high clouds catching first light; keep the upper-center sky clean and uncluttered. Foreground grass with dew, slightly out of focus. Shot on a large-format digital cinema camera with an anamorphic lens, natural atmospheric perspective, low camera height. Color grade: highlights warm gold, shadows deep navy blue, midtones desaturated and restrained, soft contrast, subtle organic 35mm film grain, no oversaturation, no HDR look. Mood: quiet, dignified, timeless, awe-inspiring. No people, no text, no letters, no logos, no watermark, no flags, no national symbols, no border or frame.

**v2 편집 지시 (채택, 참조: v1)**

> Keep the exact composition of the attached photograph: the white ger with its smoking stove pipe on the lower left, the layered mountain ridges, the sun on the horizon right of center, the three horses on the rise at right, the dewy grass foreground. Re-grade and re-light it into a restrained, high-end cinematic film still, like a frame from a national tourism campaign shot by a master cinematographer. Pull the saturation of the orange way down: the sky near the horizon becomes a soft champagne gold, rising through a pale, desaturated blue-grey band into a deep navy blue at the top of the frame. Shadows become cool deep navy, highlights warm gold, midtones muted and slightly lifted for a soft filmic contrast curve. Add low layers of morning ground mist drifting through the valleys between the ridges and around the base of the ger, so the distance dissolves in luminous haze. Replace the starburst on the sun with a soft round bloom and one thin horizontal anamorphic lens flare streak crossing the frame. The horses become dark silhouettes with a thin golden rim light. Add fine, organic 35mm film grain over the whole image. Keep the upper-center sky clean and calm. No text, no letters, no logos, no watermark, no flags, no border or frame.

**v3 프롬프트 (탈락)**

> A restrained, high-end cinematic film still from a national tourism campaign, photographed by a master cinematographer: the first light of dawn over an immense Mongolian steppe valley. Far below a low vantage point, a single white felt ger sits small in the lower-left third, a thin thread of wood smoke rising from its stove pipe and leaning gently right. Soft rivers of ground mist lie in the folds of the valley and around the ger, and three layered mountain ridges dissolve one behind another into luminous haze. The sun has just touched the horizon right of center: a soft round bloom with one thin horizontal anamorphic lens flare streak crossing the frame, no starburst. On a gentle rise on the right third, three horses stand as dark silhouettes with a thin rim of gold light. The sky fills the upper two thirds, calm and open, graded from a champagne-gold glow at the horizon through a pale desaturated blue-grey into deep navy blue at the top; the upper-center sky is clean. Foreground grass with dew drops softly out of focus. Color grade: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, gentle halation around bright edges, fine organic 35mm film grain; nothing oversaturated, no HDR. Mood: vast, quiet, dignified, timeless. No people, no text, no letters, no logos, no watermark, no flags, no national symbols, no border or frame.

## 2. 키비주얼 (참조: K1 v2 = 색보정 기준)

### K2 일출 운해

**데스크톱 v1 (탈락: 오렌지 과채도)**

> A breathtaking cinematic aerial still just above a vast sea of clouds at sunrise, as if the camera has risen high above the Mongolian steppe. An endless, softly undulating ocean of white clouds stretches to the horizon, its tops brushed with warm gold light and its valleys in cool blue-grey shadow. On the far left, the dark tips of two distant mountain peaks pierce the cloud sea. The sun has just cleared the horizon slightly right of center, a soft round bloom with a gentle glow spilling across the cloud tops toward the camera. The sky above is enormous and clean: champagne gold at the horizon fading through a pale desaturated band into deep navy blue at the top of the frame, with no other clouds above. Match the attached frame's grade exactly: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain, gentle halation. Shot from an aircraft window-free vantage, wide anamorphic lens, crisp depth. Serene, vast, uplifting. No aircraft, no people, no text, no letters, no logos, no watermark, no flags, no border or frame.

**데스크톱 v2 — 재그레이딩 편집 (채택, 참조: v1 + K1)**

> Keep the exact composition of the first attached image: the sea of clouds, the two dark mountain peaks on the far left, the sun just above the horizon right of center. Re-grade it to match the second attached image (the reference look frame) exactly: pull the saturated orange down into a soft champagne gold at the horizon, make the sky above a calm gradient through pale desaturated blue-grey into deep navy at the top, give the cloud valleys cool blue-grey and navy shadows with only the cloud tops facing the sun catching warm gold rim light. Add a little luminous haze over the far cloud sea so the horizon softens, replace the starburst with a soft round bloom and a thin horizontal anamorphic lens flare streak, add gentle halation and fine 35mm film grain. Restrained, filmic, serene. No text, no letters, no logos, no watermark, no aircraft, no border or frame.

**모바일 9:16 (채택, 참조: K2 데스크톱)**

> A vertical 9:16 recomposition of the same scene: high above an endless sea of clouds at sunrise. The horizon sits at about 45 percent of the frame height with the sun just above it slightly right of center as a soft bloom with a thin horizontal flare; the dark tips of two distant peaks pierce the clouds at the left edge. The lower half is a deep, rolling field of cloud tops, gold on their sunlit crests and navy-blue in their valleys, rising toward the camera at the bottom. The upper sky is calm and clean, deep navy at the top.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### K3 블루아워 서울

**데스크톱 v1 (탈락: 남산타워가 실제보다 거대한 산 위에 있음)**

> A cinematic aerial still of Seoul at the morning blue hour, seen from high above the Han River just after descending through the clouds. The wide Han River curves gently through the center of the frame toward the horizon, its calm surface reflecting the sky; several long bridges cross it, their lamps glowing as fine strings of warm light. On both banks, dense clusters of high-rise apartment blocks and office towers stretch into the distance, thousands of small windows still lit warm gold. Forested mountains ring the city on the horizon, layered and softened by mist. The sun has not risen yet: a thin band of champagne-gold light glows on the horizon slightly right of center, while the rest of the sky is a deep, clean navy-blue gradient. Wisps of low cloud drift across the bottom corners of the frame, close to the camera. Color grade: deep navy and steel-blue shadows, warm gold city lights and horizon glow, muted lifted midtones, soft filmic contrast, fine 35mm film grain, gentle halation around lights. Calm, majestic, hopeful. No readable signs, no text, no letters, no logos, no watermark, no flags, no border or frame.

**데스크톱 v2 — 타워 제거·하늘 채도 완화 편집 (채택)**

> Keep everything in the first attached image exactly the same (the Han River, the bridges, the city, the clouds in the bottom corners, the mountains) with only these changes: remove the slender broadcast tower standing on the summit of the large mountain at upper left, leaving a natural forested mountain ridge there; and make the horizon glow a softer, less saturated champagne gold so the sky reads as a calm morning blue hour in deep navy and steel blue. Keep the warm gold window and bridge lights. Fine 35mm film grain. No text, no letters, no logos, no watermark, no border or frame.

**모바일 9:16 (채택)**

> A vertical 9:16 recomposition of the same scene: Seoul at the morning blue hour seen from high above, just below the clouds. The Han River enters from the lower right and curves up through the frame toward the horizon, crossed by two or three lit bridges; dense apartment blocks and towers with warm lit windows line both banks. Misty layered mountains and a thin champagne-gold horizon glow sit at about 30 percent from the top; above them a deep navy sky. Soft wisps of cloud drift across the bottom edge of the frame close to the camera. The most beautiful part of the city and river lies in the upper half of the frame.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### K4 서울 야경

**데스크톱 (채택, 참조: K3)**

> A cinematic night still of Seoul seen from a dark hillside high above the Han River. The horizon line sits at about 55 percent of the frame height. Below it, the whole city spreads out as a vast, glittering field of warm gold and soft white lights: apartment blocks, towers and long bridges strung with lamps across the wide dark river, whose calm surface mirrors the lights. Above the horizon, a vast, deep navy night sky, clean and calm, with a faint haze of city glow at the horizon and a few early stars appearing high up. The dark silhouette of the hillside with a few grasses frames the very bottom of the frame. Match the attached frame's film look: deep navy shadows, warm gold lights, muted midtones, soft filmic contrast, gentle halation around the lights, fine 35mm film grain. Quiet, majestic, a little nostalgic. No landmark towers, no readable signs, no text, no letters, no logos, no watermark, no border or frame.

**모바일 9:16 (채택, 참조: K4)**

> A vertical 9:16 recomposition of the same scene: Seoul at night seen from a dark hillside high above the Han River. The horizon with dark mountain silhouettes sits at about 45 percent of the frame height. Below it the city spreads as a glittering field of warm gold and white lights, the wide dark river curving up through the middle of the lower half with long lit bridges and mirror reflections. The upper half is a deep, clean navy night sky with a few faint stars. Dark grasses on the hillside frame the very bottom of the frame.
> Match the attached frame exactly in color grade and film look (deep navy shadows, warm gold lights, muted midtones, soft filmic contrast, gentle halation, fine 35mm film grain). A new vertical composition for a phone, not a crop. No landmark towers, no text, no letters, no logos, no watermark, no border or frame.

### K5 은하수 아래 게르 (K1과 같은 구도의 밤 — 처음과 끝이 맞물림)

**데스크톱 — K1 편집 (채택)**

> Keep the exact composition of the attached photograph (the white ger on the lower left with its stove pipe, the layered mountain ridges, the rise on the right with the horses, the grass foreground) but turn it into the deep of a clear, moonless night on the Mongolian steppe. The sun is gone. The Milky Way arches across the whole sky from lower right to upper left, dense with countless stars, its core glowing softly above the mountains. The sky is deep navy-black with a faint blue airglow near the horizon. The ger glows warmly from within: golden light spills from its small open door onto the grass, and a thin thread of smoke rises, lit faintly. The mountains are dark navy silhouettes, wisps of low mist lie in the valley catching starlight, and the horses are dark silhouettes against the stars. Long-exposure astrophotography look, cinematic, fine 35mm film grain, deep navy shadows, warm gold only in the ger light. Peaceful, eternal, a feeling of home. No text, no letters, no logos, no watermark, no flags, no border or frame.

**모바일 v1 — K1 모바일 편집 (탈락: CTA 카드가 게르를 가림)**

> Keep the exact composition of the attached photograph (the white ger left of center below the horizon with its stove pipe, the layered mountain ridges, the horses on the rise at the right edge, the dewy grass foreground) but turn it into the deep of a clear, moonless night on the Mongolian steppe. The sun is gone. The Milky Way rises through the tall sky from the horizon at lower right to the upper left, dense with countless stars, its core glowing softly above the mountains. The sky is deep navy-black with a faint blue airglow near the horizon. The ger glows warmly from within: golden light spills from its small open door onto the grass, and a thin thread of smoke rises, lit faintly. The mountains are dark navy silhouettes, wisps of low mist lie in the valley catching starlight, and the horses are dark silhouettes against the stars. Long-exposure astrophotography look, cinematic, fine 35mm film grain, deep navy shadows, warm gold only in the ger light. Peaceful, eternal, a feeling of home. No text, no letters, no logos, no watermark, no flags, no border or frame.

**모바일 v2 — 게르를 위로 올린 재구도 (채택)**

> A vertical 9:16 night scene on the Mongolian steppe, art-directed for a phone screen, matching the attached frame's look exactly. The horizon with dark navy mountain ridges sits high, at about 50 percent of the frame height. Just below the horizon, at about 52 to 56 percent of the frame height and slightly left of center, a single white felt ger glows warmly from its small open door, a thin thread of smoke rising; two horses stand as dark silhouettes on a gentle rise to the right at the same height. The whole upper half is a deep navy-black sky with the Milky Way rising from the horizon at lower right toward the upper left, dense with stars. The lower 44 percent of the frame is a calm, dark, softly dew-lit grassland gently fading to near black at the very bottom, with faint wisps of low mist. Long-exposure astrophotography look, cinematic, fine 35mm film grain, deep navy shadows, warm gold only in the ger light. No people, no text, no letters, no logos, no watermark, no flags, no border or frame.

## 3. 챕터 6장 (하루의 흐름 순서)

데스크톱 공통 꼬리말: 주 피사체는 오른쪽 절반, 왼쪽 40%는 어둡고 단순하게(타이포 자리). 참조: K1 v2(색보정만).

### 01 떠나기 전 — 게르 문 앞의 여행자

**데스크톱 v1 (탈락: 게르 문이 서양 헛간 문처럼 너무 큼)**

> Before leaving home: the inside of a Mongolian ger at early morning, looking out through its low open wooden doorway onto the bright misty steppe. Soft gold morning light floods in through the doorway and lays a long warm rectangle across the felt floor and a woven rug. Just inside the door stand a packed travel backpack and a small hard-shell suitcase, ready for a long journey. A young adult stands in the doorway seen from behind as a silhouette, one hand resting on the door frame, looking out at the horizon. The ger interior around the doorway is in deep, warm shadow with the curved wooden lattice walls barely visible. Quiet, emotional, hopeful: the moment before a new life begins.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**데스크톱 v2 — 낮은 전통 게르 문으로 편집 (채택)**

> Keep the mood, light, color grade, camera position and the interior of the ger of the first attached image (the stove on the left, the wooden chest, the lattice walls, the rug, the suitcase and backpack by the door, the long sunlit shadow on the floor). Change only the doorway so it is authentic to a real Mongolian ger: a small, low traditional ger doorway, only slightly taller than an adult, with a sturdy carved wooden door frame and a short wooden double door swung open, painted in a faded warm orange-red with a subtle worn traditional pattern. The young traveller now stands just outside the low doorway on the grass, seen from behind, framed by the doorway, looking at the sunrise over the misty steppe. No text, no letters, no logos, no watermark, no flags, no border or frame.

**모바일 (채택)**

> A vertical 9:16 recomposition of the same scene: inside a Mongolian ger at dawn, looking toward its low, open, painted orange-red wooden double door. The doorway sits in the center of the frame at about 30 to 55 percent of the height; through it, a young traveller with a backpack stands on the grass seen from behind, facing the sunrise over the misty steppe. The curved roof poles and lattice wall frame the top of the image in warm shadow. A packed suitcase and backpack stand just inside the door. A long warm rectangle of sunlight stretches from the doorway down across the rug toward the camera, filling the darker lower part of the frame.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### 02 도착 — 공항 도착장 아침빛

**데스크톱 (채택)**

> Arrival: the arrivals hall of a large modern international airport in Korea in the early morning. A soaring space of steel and glass curtain walls; long diagonal shafts of soft gold morning sunlight fall across a polished stone floor that reflects the light. A young traveler seen from behind, wearing a backpack and pulling one suitcase, has just stopped walking and looks up at the light, small in the vast hall. A few other travelers are far away, soft and blurred. Through the tall windows, a pale blue morning sky. Clean, calm, full of possibility. Any signage is far away, out of focus and unreadable.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**모바일 (채택)**

> A vertical 9:16 recomposition of the same scene: the arrivals hall of a large modern airport in Korea in the early morning. Tall glass curtain walls rise high through the frame; soft gold morning sun streams in from the upper right, laying long diagonal light beams across a polished reflective floor. A young traveller with a backpack and one suitcase stands in the center at about 35 to 60 percent of the frame height, seen from behind, looking up at the light. The lower part of the frame is a calm, darker reflective floor.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### 03 일 — 아침 산업현장

**데스크톱 v1 (루프에서 제자리걸음 → 정지 자세로 수정)**

> Work, with dignity: early morning inside a large, clean, modern Korean manufacturing plant. High clerestory windows let long beams of gold sunlight cut through faint haze above the factory floor, over orderly steel machinery, overhead cranes and stacked materials. A worker in a clean white safety helmet, a work jacket and gloves walks along a wide aisle away from the camera, upright and confident, rim-lit by the morning light; a second worker is far in the background. The space feels orderly, safe and respected, like a heroic portrait of skilled labor. Calm, strong, proud.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**정지 자세 편집 (데스크톱·모바일 공통, 채택)**

> Keep everything in the attached image exactly the same (the factory, the light beams, the haze, the machinery, the crane, the composition and color grade) with one change: the worker in the white safety helmet in the center aisle is no longer walking. He now stands still, upright and relaxed, both feet planted together on the floor, seen from behind, his head slightly raised as he looks up toward the light streaming through the high windows. The distant second worker also stands still. No text, no letters, no logos, no watermark, no border or frame.

**모바일 v1**

> A vertical 9:16 recomposition of the same scene: early morning inside a large, clean, modern Korean factory. High windows and a tall steel structure with an overhead crane beam fill the upper part of the frame; long beams of gold sunlight cut through faint haze. A worker in a white safety helmet and work jacket walks away from the camera down the center aisle, upright and confident, at about 35 to 60 percent of the frame height. The lower part of the frame is the calm, darker, reflective factory floor. Dignified, orderly, proud.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### 04 말과 문화 — 재래시장 아케이드

**데스크톱 v1 (탈락: 토트백에 가짜 글자)**

> Language and culture: a lively traditional covered market street in Seoul in the warm late afternoon. Rows of food stalls with steam rising from pots, strings of warm bulbs, baskets of fresh vegetables and fruit, soft bokeh in depth. In the right half, a young woman with a canvas tote bag stands at a stall, seen from behind, chatting with the elderly vendor whose face is turned away and hidden by steam and shadow. Golden light filters down through the translucent arcade roof. Warm, human, bustling yet calm. All shop signs are far away, out of focus and unreadable.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**데스크톱 v2 — 무지 토트백 편집 (채택)**

> Keep everything in the first attached image exactly the same (the market arcade, the light, the steam, the woman with long hair seen from behind, the vendor, the produce, the composition and grade) with one change: the canvas tote bag on her shoulder becomes completely plain natural canvas with no printing, no letters and no marks at all. Also make sure every crate, box and sign in the scene carries no letters or numbers. No text anywhere, no logos, no watermark, no border or frame.

**모바일 (채택)**

> A vertical 9:16 recomposition of the same scene: a lively covered traditional market street in Seoul in warm late-afternoon light, looking down the long arcade whose translucent roof glows gold at the top of the frame. Strings of warm bulbs, steam rising from food stalls, baskets of vegetables and fruit along the right side. A young woman with long hair and a plain canvas tote bag stands at a stall in the center of the frame at about 35 to 65 percent of the height, seen from behind, chatting with a vendor whose face is hidden by steam. Blurred shoppers far away. The lower part of the frame is the wet, light-reflecting stone pavement in deeper shadow. Every sign, box and bag is blank, without any letters.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### 05 생활 — 노을 진 주택가 골목

**데스크톱 v1 (루프에서 제자리걸음 → 정지 자세로 수정)**

> Everyday life: a quiet residential alley in Seoul at sunset. Low red-brick villa buildings with external staircases, potted plants on steps, small balconies, a few warm glowing windows. Long low gold sunlight rakes across the walls; the sky above is a soft gradient from peach to dusky blue. Electric wires cross overhead. A person seen from behind walks home up the gently sloping alley carrying a bag of groceries, their long shadow stretching toward the camera. Gentle, warm, a feeling of coming home.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**정지 자세 편집 (데스크톱·모바일 공통, 채택)**

> Keep everything in the attached image exactly the same (the brick villas, the plants, the wires, the sunset sky, the distant city, the composition and color grade) with one change: the woman with the grocery bag is no longer walking. She has stopped in the middle of the lane and stands still, both feet together, seen from behind, turning her head slightly to look at the sunset over the city, her long shadow stretching toward the camera. No text, no letters, no logos, no watermark, no border or frame.

**모바일 v1**

> A vertical 9:16 recomposition of the same scene: a quiet residential alley in Seoul at sunset, looking down a gently sloping lane. Low red-brick villas with external staircases, potted plants and warm lit windows line both sides; electric wires cross the sky. In the distance, the city and a small hill with a slender tower glow under a peach and dusky-blue sky, the sun low near the horizon at about 30 percent from the top. A woman seen from behind walks home down the center of the lane carrying a bag of groceries, at about 40 to 60 percent of the frame height, her long shadow stretching toward the camera across the darker lower part of the frame.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

### 06 사람들 — 한강 노을, 뒷모습

**데스크톱 v1 (탈락: 오렌지 과채도·어색한 단일 타워)**

> Our people: a riverside park on the Han River in Seoul at sunset. In the right half, a small group of four friends sit together on the grass near the water, seen from behind as soft silhouettes, one leaning on another's shoulder. Beyond them, the wide calm river reflects the gold and peach sunset; a long bridge and a distant soft skyline sit on the horizon under a sky fading to navy at the top. Warm, peaceful, a sense of belonging and friendship far from home.
> Composition: the main subject sits in the right half of the frame; the left 40 percent is calmer, darker and less detailed so large typography can sit over it. Cinematic still from a national tourism campaign film, anamorphic lens, natural light, shallow atmospheric depth. Color grade matching the attached frame: warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain. People only seen from behind, in silhouette or far away, never facing the camera, dressed in ordinary modern clothes. No readable signs, no text, no letters, no numbers, no logos, no watermark, no flags, no national symbols, no border or frame.

**데스크톱 v2 — 재그레이딩·스카이라인 정리 (채택)**

> Keep the composition of the first attached image (the four friends sitting on the grass seen from behind on the right, the wide Han River, the long bridge, the skyline on the horizon, the setting sun right of center). Re-grade and refine it to match the second attached image (the reference look frame): pull the saturated orange down into a soft champagne gold and peach glow around the sun, let the upper sky settle into a calm desaturated blue-grey and deep navy, keep the water reflecting a gentle gold path, cool navy shadows in the grass and figures, muted lifted midtones, soft filmic contrast, subtle haze over the far skyline, gentle halation and fine 35mm film grain. Make the skyline a believable mix of Seoul apartment blocks and a few office towers of varied heights rather than one dominant tower. No text, no letters, no logos, no watermark, no border or frame.

**모바일 (채택)**

> A vertical 9:16 recomposition of the same scene: a riverside park on the Han River in Seoul at sunset. The far skyline of apartment blocks and a long bridge sit on the horizon at about 40 percent of the frame height, the soft sun just above it, its gold path glittering down the calm wide river toward the camera. Four friends sit close together on the grass in the lower middle of the frame, seen from behind as soft silhouettes, one leaning her head on another's shoulder. The tall sky above fades from peach and champagne gold to deep navy at the top, with a few thin clouds. The very bottom of the frame is dark grass.
> Match the attached frame exactly in color grade, light, atmosphere and film look (warm gold highlights, cool deep navy shadows, muted lifted midtones, soft filmic contrast, fine 35mm film grain). This is a new vertical composition art-directed for a phone, not a crop. People only from behind or as silhouettes. No text, no letters, no numbers, no logos, no watermark, no flags, no border or frame.

## 4. Grok 영상

| 컷 | 판정 |
|---|---|
| V1 데스크톱·모바일 (K1→K2 상승) | 채택 |
| V2 데스크톱 1차 | **탈락** — 화면 중앙에 반짝이는 원형 링 이펙트 |
| V2 데스크톱 2차·모바일 (K2→K3 하강) | 채택 ("no visual effects" 명시) |
| V3 데스크톱 (K4→K5) | 채택 |
| V3 모바일 1차 | 교체 — K5 모바일 v2에 맞춰 재생성 |
| V3 모바일 2차 | 채택 |
| C3·C5 루프 1차 | **탈락** — 인물이 제자리걸음(문워크) → 정지 자세 이미지로 재생성 |
| 나머지 루프 10편 | 채택 |

**V1 데스크톱** — first_frame `k1-desktop.png` · last_frame `k2-desktop.png` · 16:9 · 8s · 720p

> One continuous cinematic crane shot at dawn: the camera tilts up and rises straight into the sky from the Mongolian steppe, so the ger, its smoke and the horses slide down and out of the bottom of the frame while the golden sky fills the view; the camera climbs through a thin layer of luminous mist and emerges just above an endless sea of gold-lit clouds, with the sun hovering on the horizon right of center the whole time. Smooth, slow, majestic, no cuts.

**V1 모바일** — first_frame `k1-mobile.png` · last_frame `k2-mobile.png` · 9:16 · 8s · 720p

> One continuous cinematic crane shot at dawn: the camera tilts up and rises straight into the sky from the Mongolian steppe, so the ger, its smoke and the horses slide down and out of the bottom of the frame while the golden sky fills the view; the camera climbs through a thin layer of luminous mist and emerges just above an endless sea of gold-lit clouds, the sun hovering on the horizon the whole time. Slow, majestic, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**V2 데스크톱 1차 (탈락)** — first_frame `k2-desktop.png` · last_frame `k3-desktop.png` · 16:9 · 8s · 720p

> One continuous cinematic shot: from just above the golden sea of clouds at sunrise, the camera pitches down and dives straight into the clouds, passes through soft glowing white cloud, and breaks out beneath them to reveal Seoul far below at the blue hour, the Han River curving through the city with its lit bridges and thousands of warm windows, while the last wisps of cloud slide away past the bottom corners of the frame. Smooth, slow, majestic descent, no cuts.

**V2 데스크톱 2차 (채택)** — first_frame `k2-desktop.png` · last_frame `k3-desktop.png` · 16:9 · 8s · 720p

> Photorealistic aerial footage in one continuous shot: starting just above a golden sea of clouds at sunrise, the camera tilts down and descends into the clouds, the frame briefly filled with soft white and gold cloud, then the camera emerges below the clouds high above Seoul at the morning blue hour, the Han River curving through the city with its lit bridges and warm windows, while thin wisps of cloud slide past the bottom corners. Slow, majestic, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**V2 모바일** — first_frame `k2-mobile.png` · last_frame `k3-mobile.png` · 9:16 · 8s · 720p

> Photorealistic aerial footage in one continuous shot: starting just above a golden sea of clouds at sunrise, the camera tilts down and descends into the clouds, the frame briefly filled with soft white and gold cloud, then the camera emerges below the clouds high above Seoul at the morning blue hour, the Han River curving up through the city with its lit bridges and warm windows, while thin wisps of cloud slide past the bottom of the frame. Slow, majestic, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**V3 데스크톱** — first_frame `k4-desktop.png` · last_frame `k5-desktop.png` · 16:9 · 8s · 720p

> One continuous photorealistic night shot: the camera slowly tilts up from the glittering lights of Seoul and the river into the deep navy sky until the frame is filled with stars and the Milky Way, then slowly tilts back down to reveal the dark Mongolian steppe with a lone ger glowing warm from its door and horses silhouetted on the rise. Slow, quiet, majestic, no cuts.

**V3 모바일 2차 (채택)** — first_frame `k4-mobile.png` · last_frame `k5-mobile.png` · 9:16 · 8s · 720p

> One continuous photorealistic night shot: the camera slowly tilts up from the glittering lights of Seoul and the river into the deep navy sky until the frame is filled with stars and the Milky Way, then slowly tilts back down to reveal the dark Mongolian steppe with a lone ger glowing warm from its door and horses silhouetted on the rise. Slow, quiet, majestic, no cuts.

**C1 루프** — first_frame `c1-desktop.png` · last_frame `c1-desktop.png` · 16:9 · 6s · 720p

> Locked-off shot from inside a Mongolian ger at dawn: through the low open doorway, wisps of mist drift slowly across the steppe from left to right and the sunrise glow gently breathes; the traveller standing just outside the door stays in place, hair stirring in the breeze; fine dust floats in the beam of light across the rug. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**C2 루프** — first_frame `c2-desktop.png` · last_frame `c2-desktop.png` · 16:9 · 6s · 720p

> Locked-off cinematic shot in a sunlit airport arrivals hall: the young traveller with the backpack stands still looking up at the light, breathing gently; far in the background, small blurred travellers walk slowly across the hall from left to right, and the soft beams of morning sun shimmer faintly on the polished floor. Calm, seamless, no camera movement, no cuts.

**C3 루프 1차 (탈락)** — first_frame `c3-desktop.png` · last_frame `c3-desktop.png` · 16:9 · 6s · 720p

> Locked-off cinematic shot inside a sunlit factory at morning: golden dust motes drift slowly upward through the beams of light, thin haze moves gently across the high windows, and the crane hook sways very slightly; the workers keep their poses with only subtle natural movement. Calm, dignified, seamless, no camera movement, no cuts.

**C3 루프 2차 (채택)** — first_frame `c3-desktop.png` · last_frame `c3-desktop.png` · 16:9 · 6s · 720p

> Locked-off cinematic shot inside a sunlit factory at morning: golden dust motes drift slowly upward through the beams of light, thin haze moves gently below the high windows, the crane hook sways very slightly; the worker stands still looking up at the light, with only subtle natural movement. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**C4 루프** — first_frame `c4-desktop.png` · last_frame `c4-desktop.png` · 16:9 · 6s · 720p

> Locked-off shot in a warm covered market at late afternoon: steam curls and rises from the pots, the hanging bulbs sway very slightly, distant blurred shoppers walk slowly in the background; the young woman at the stall stays in place with only small natural movements of her head and hair. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**C5 루프 1차 (탈락)** — first_frame `c5-desktop.png` · last_frame `c5-desktop.png` · 16:9 · 6s · 720p

> Locked-off cinematic shot of a Seoul residential alley at sunset: the leaves of the potted plants and trees sway in a light breeze, warm sunlight flickers through them onto the walls, the overhead wires sway slightly, and the walking woman's hair and grocery bag stir gently while she stays in place. Warm, calm, seamless, no camera movement, no cuts.

**C5 루프 2차 (채택)** — first_frame `c5-desktop.png` · last_frame `c5-desktop.png` · 16:9 · 6s · 720p

> Locked-off cinematic shot of a Seoul residential alley at sunset: the leaves of the potted plants and trees sway in a light breeze, warm sunlight flickers through them onto the walls, the overhead wires sway slightly; the woman standing in the lane stays in place, her hair and grocery bag stirring gently. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**C6 루프** — first_frame `c6-desktop.png` · last_frame `c6-desktop.png` · 16:9 · 6s · 720p

> Locked-off shot on the bank of the Han River at sunset: gentle ripples carry a glittering path of sunlight across the water, the grass and plants in the foreground sway in a soft breeze, and the four friends sitting together stay in place with only small natural movements. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

**C1~C6 모바일 루프 (프롬프트는 데스크톱과 같고 9:16 · 예: C1)** — first_frame `c1-mobile.png` · last_frame `c1-mobile.png` · 9:16 · 6s · 720p

> Locked-off shot from inside a Mongolian ger at dawn: through the low open doorway, wisps of mist drift slowly across the steppe from left to right and the sunrise glow gently breathes; the traveller standing at the door stays in place, hair stirring in the breeze; fine dust floats in the beam of light across the rug. Calm seamless loop, no camera movement, no cuts. Photorealistic natural light, realistic camera, no visual effects.

## 5. 웹 변환 (scripts/design-lab)

| 산출물 | 설정 | 실측 |
|---|---|---|
| `seq-hero` (V1+V2 이어붙임) | 12fps · 1280 · q64 | 193프레임 6.14MB |
| `seq-hero-m` | 8fps · 540 · q60 | 129프레임 2.95MB |
| `seq-finale` (V3) | 10fps · 1280 · q56 | 80프레임 3.47MB |
| `seq-finale-m` | 6fps · 540 · q54 | 48프레임 1.40MB |
| `c1~c6-loop.mp4` | 1280 · crf 22 | 합계 5.66MB |
| `c1~c6-loop-m.mp4` | 540 · crf 27 | 합계 1.74MB |
| 정지 이미지 WebP (k1·k3·k4·k5·c1~c6) | 데스크톱 q78 / 모바일 828폭 q74 | 1.23MB / 1.12MB |
