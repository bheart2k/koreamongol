# design-lab 공용 미디어 도구

홈 리디자인 시안(`/design-lab/a|b|c`)용 에셋 변환 도구. Node 22 + sharp + ffmpeg. 프로젝트 루트(`C:\workspace\koreamongol`)에서 실행한다.

| 도구 | 용도 |
|---|---|
| `img2webp.mjs` | 이미지 → WebP (최대 폭·품질 지정) |
| `video2frames.mjs` | 영상 → WebP 프레임 시퀀스 (캔버스 스크럽용) |
| `video2mp4.mjs` | 영상 → 웹용 MP4(H.264, faststart, 무음) + 포스터 WebP |
| `upload-r2.mjs` | 폴더 → R2 `design-lab/…` 업로드 (아래 R2 업로드 절) |
| `shot.mjs` | headless Chrome(별도 프로필)+CDP 검증: `node scripts/design-lab/shot.mjs <plan.json>` → 스크롤 지점별 스크린샷·콘솔 에러·페이지 높이·전송량(`report.json`). plan 형식은 파일 머리 주석 |
| `codex-image.sh` | Codex 내장 image_gen 1회 호출(Git Bash): `scripts/design-lab/codex-image.sh <out.png> <prompt.txt> [레퍼런스…]` → PNG + `<out>.log` |

- 원본 영상(생성 MP4)은 R2 `design-lab/originals/<시안>/…`(`https://cdn.koreamongol.com/design-lab/originals/…`)에 보관한다. Codex 이미지 원본은 `~/.codex/generated_images/`에도 남는다.
- 웹용 에셋은 R2 `design-lab/v1/<시안>/…`(`https://cdn.koreamongol.com/design-lab/v1/…`)에만 둔다.
- 원본과 웹용 파일 모두 프로젝트 안(`public/` 포함)에는 두지 않는다.

**흐름:** 원본과 웹용 파일은 프로젝트 밖 임시 폴더(예: 세션 스크래치 또는 `%TEMP%\design-lab\`)에서 만든다 → `upload-r2.mjs`로 R2에 올린다 → 로컬 사본은 지운다. 아래 예시의 `$SRC`(원본)와 `$W`(웹용 출력)는 그 임시 폴더다.

```powershell
$SRC = "$env:TEMP\design-lab\src"   # 원본 PNG/MP4
$W   = "$env:TEMP\design-lab\web"   # 웹용 출력 — R2 업로드 후 삭제
```

## ffmpeg

- 설치: winget `Gyan.FFmpeg` 9.0.2 (libx264·libwebp 포함)
- 경로: `C:\Users\jedik\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe` (`ffprobe.exe`도 같은 폴더)
- **이미 열려 있던 셸은 PATH에 없다.** 도구 3종은 `FFMPEG_PATH` 환경변수 → PATH → 위 winget 폴더 순으로 알아서 찾으므로 그대로 쓰면 된다.
- ffmpeg를 직접 호출해야 하면 그 셸에서 한 번만:
  ```powershell
  $env:Path += ";C:\Users\jedik\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin"
  ```

## 프리셋

옵션을 직접 주면 프리셋보다 우선한다. 프리셋을 생략하면 `desktop` 기준이다.

| 도구 | desktop | mobile |
|---|---|---|
| img2webp | 폭 1920, q80 | 폭 828, q78 (390px @2x ≈ 780) |
| video2frames | 24fps, 폭 1280, q70 | 16fps, 폭 720, q68 |
| video2mp4 | 폭 1280, crf 25, 최대 24fps | 폭 720, crf 27, 최대 24fps |

폭은 비율 유지(높이 자동·짝수). 원본보다 크게 키우지 않는 도구는 img2webp, video2mp4다.

## 사용법

### 이미지 → WebP
```powershell
# 폴더 통째로 / 파일 여러 개
node scripts/design-lab/img2webp.mjs $SRC\a\img --out $W\a --preset desktop
node scripts/design-lab/img2webp.mjs $SRC\a\img\k1-m.png --out $W\a --preset mobile --suffix=-m

# 옵션 직접 지정
node scripts/design-lab/img2webp.mjs $SRC\a\hero.png --out $W\a --width 2560 --quality 85
```
`--effort 0-6`(기본 6), `--lossless`도 있다. **`--suffix`의 값이 `-`로 시작하면 `=`로 붙여 쓴다** (`--suffix=-m`).

### 영상 → WebP 프레임 시퀀스
```powershell
node scripts/design-lab/video2frames.mjs $SRC\a\v1.mp4 --out $W\a\seq-v1 --preset desktop
node scripts/design-lab/video2frames.mjs $SRC\a\v1-m.mp4 --out $W\a\seq-v1-m --preset mobile

# 구간·fps 지정 (예: 2초 지점부터 4초, 12fps)
node scripts/design-lab/video2frames.mjs $SRC\a\v1.mp4 --out $W\a\seq --start 2 --duration 4 --fps 12 --width 960 --quality 65
```
- 출력: `frame-0001.webp …`(`--prefix`로 접두어 변경) + `manifest.json`
- `manifest.json`: `{ count, fps, width, height, pattern, startIndex, bytes, avgBytes }` — 프레임 수·크기를 코드에서 읽을 때 쓴다.
- 같은 prefix의 기존 프레임은 실행 시작 시 먼저 지운다 (프레임 수가 줄어도 잔여 파일이 남지 않음).
- manifest도 다른 웹용 파일과 함께 `upload-r2.mjs`로 R2에 올린다.
- 용량 감: 용량은 장면에 크게 좌우된다. 반드시 출력된 합계로 판단하고 예산(첫 화면 1.5MB, 데스크톱 25MB, 모바일 10MB)과 비교한다.

### 영상 → MP4 + 포스터
```powershell
node scripts/design-lab/video2mp4.mjs $SRC\a\loop1.mp4 --out $W\a --preset desktop
node scripts/design-lab/video2mp4.mjs $SRC\a\loop1-m.mp4 --out $W\a --preset mobile --suffix=-m
```
- 출력: `<이름>.mp4`(H.264 High, yuv420p, BT.709, `+faststart`, 오디오 제거), `<이름>.poster.webp`
- 포스터 시각/품질: `--poster-time 1.5`, `--poster-quality 85`
- `--crf`(낮을수록 고화질·대용량), `--fps`(최대 fps) 조절 가능
- 여러 파일을 한 번에 넣을 수 있다 (`<영상>...`).

### R2 업로드 (cdn.koreamongol.com)
`node scripts/design-lab/upload-r2.mjs <폴더>`는 `<폴더>/**`를 버킷의 `design-lab/v1/**`에 같은 상대 경로로 올립니다. 예를 들어 `node scripts/design-lab/upload-r2.mjs $W`를 실행하면 `$W\d\k1.webp`가 `design-lab/v1/d/k1.webp`로 올라갑니다. 폴더 인자는 필수입니다. 이렇게 올린 파일은 `https://cdn.koreamongol.com/design-lab/v1/...`로 제공되고, 코드에서는 `src/app/design-lab/_shared/asset.js`의 `labAsset('/design-lab/...')`로 참조합니다. 키는 `.env.local`의 `R2_*`를 씁니다. 각 파일에 확장자별 Content-Type과 `Cache-Control: public, max-age=31536000, immutable`이 붙고, 업로드는 동시에 8개까지 합니다(`--concurrency N`). 버킷에 같은 크기의 파일이 이미 있으면 건너뛰므로 다시 실행해도 안전합니다. `--dry-run`을 붙이면 올릴 목록만 보여 줍니다. `--prefix`(기본 `design-lab/v1`, `design-lab/` 아래만 허용)로 올릴 위치를 바꾸고, `--ext mp4,webp`로 해당 확장자만 고를 수 있습니다. 원본 영상은 `node scripts/design-lab/upload-r2.mjs $SRC --prefix design-lab/originals --ext mp4`로 올립니다. 2026-10-08에 그때까지의 원본 영상 47개(170MB)를 이 방식으로 백업했고, 로컬 `.design-lab-src`는 삭제했습니다. 끝나면 이번에 올린 로컬 파일의 크기를 버킷과 대조합니다. 대조 결과가 맞으면 로컬 사본은 직접 지웁니다. 스크립트는 로컬과 버킷 어느 쪽의 파일도 지우지 않고, 쓰기는 지정한 prefix 아래로만 합니다. 이미 올린 파일의 내용을 바꿀 때는 immutable 캐시 때문에 같은 경로로 덮어쓰면 안 됩니다. 파일명이나 버전(`v2`)을 바꿔서 올립니다.

## 생성 영상의 첫/끝 프레임 확인 (brief 3절: 실제로 움직였는지 검수)

```powershell
# 첫 프레임
ffmpeg -y -i v1.mp4 -frames:v 1 first.png
# 끝 프레임 (-frames:v 1 을 붙이면 안 된다 — 끝 프레임이 아니라 시작점 프레임이 나옴)
ffmpeg -y -sseof -0.2 -i v1.mp4 -update 1 last.png
```
두 PNG를 직접 열어 비교한다. 루프 영상은 첫 프레임과 끝 프레임이 일치해야 한다.

## 주의

- 입력 파일과 출력 경로가 같으면 거부한다. 원본과 웹용 파일 모두 프로젝트 안(`public/` 포함)에 두지 않는다.
- 모바일 영상·이미지는 단순 리사이즈가 아니라 **9:16 전용 소스**를 따로 만든 뒤 mobile 프리셋을 적용한다 (brief 3절).
- 변환 후 WebP·MP4를 직접 열어 화질(밴딩·블록)을 눈으로 확인한다. 도구는 용량만 보고한다.
