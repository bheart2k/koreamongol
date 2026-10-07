#!/usr/bin/env node
// 영상 → 웹용 MP4(H.264, yuv420p, faststart, 무음) + 포스터 WebP
// 사용: node scripts/design-lab/video2mp4.mjs <영상>... --out <출력폴더> [--preset desktop|mobile] [--width N] [--crf N]
import { basename, extname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  MP4_PRESETS, ensureDir, fail, fileSize, fmtBytes, num, pickPreset, probeVideo, runFfmpeg,
} from './_lib.mjs';

const HELP = `영상 → 웹용 MP4 + 포스터 WebP
  node scripts/design-lab/video2mp4.mjs <영상>... --out <출력폴더> [옵션]

옵션
  -o, --out <dir>       출력 폴더 (필수)
  -p, --preset <name>   desktop(폭 1280, crf25) | mobile(폭 720, crf27)
  -w, --width <px>      폭 (높이는 비율 유지, 짝수. 원본보다 크게 키우지 않음)
      --crf <N>         H.264 CRF (낮을수록 고화질·대용량, 기본 프리셋값)
      --fps <N>         최대 fps (기본 24)
      --poster-time <s> 포스터로 쓸 시각(초, 기본 0)
      --poster-quality <1-100>  포스터 WebP 품질 (기본 80)
      --suffix <str>    출력 파일명 뒤에 붙일 문자열 (예: --suffix=-m → loop-m.mp4, loop-m.poster.webp, 값이 - 로 시작하면 = 필수)
  -h, --help

출력: <이름><suffix>.mp4, <이름><suffix>.poster.webp  (오디오 제거, -movflags +faststart)`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string', short: 'o' },
      preset: { type: 'string', short: 'p' },
      width: { type: 'string', short: 'w' },
      crf: { type: 'string' },
      fps: { type: 'string' },
      'poster-time': { type: 'string' },
      'poster-quality': { type: 'string' },
      suffix: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help || !positionals.length) return console.log(HELP);
  if (!values.out) throw new Error('--out 이 필요합니다.');

  const preset = { ...MP4_PRESETS.desktop, ...pickPreset(MP4_PRESETS, values.preset) };
  const crf = num(values.crf, preset.crf, 'crf');
  const maxFps = num(values.fps, preset.fps, 'fps');
  const posterTime = values['poster-time'] ? Number(values['poster-time']) : 0;
  const posterQuality = num(values['poster-quality'], 80, 'poster-quality');
  const suffix = values.suffix ?? '';
  const outDir = ensureDir(values.out);

  for (const input of positionals) {
    const name = `${basename(input, extname(input))}${suffix}`;
    const mp4 = join(outDir, `${name}.mp4`);
    const poster = join(outDir, `${name}.poster.webp`);
    if (resolve(mp4) === resolve(input)) throw new Error(`입력과 출력이 같습니다: ${input}`);
    const src = probeVideo(input);
    // 원본보다 크게 키우지 않고, 짝수 폭으로 맞춤
    const width = Math.floor(Math.min(num(values.width, preset.width, 'width'), src.width) / 2) * 2;

    runFfmpeg([
      '-i', input,
      '-an',
      // 1280 이하 SDR 웹 영상 표준: BT.709 / tv range
      '-vf', `fps=fps=${Math.min(maxFps, src.fps || maxFps)},scale=${width}:-2:flags=lanczos:out_color_matrix=bt709:out_range=tv,setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
      '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-movflags', '+faststart',
      mp4,
    ]);

    runFfmpeg([
      '-ss', String(posterTime), '-i', input,
      '-frames:v', '1',
      '-vf', `scale=${width}:-2:flags=lanczos`,
      '-pix_fmt', 'bgra',
      '-c:v', 'libwebp', '-quality', String(posterQuality), '-compression_level', '6',
      poster,
    ]);

    const out = probeVideo(mp4);
    console.log(
      `${basename(input)} → ${name}.mp4  ${out.width}×${out.height} · ${out.duration.toFixed(2)}s · ${fmtBytes(fileSize(mp4))}  |  poster ${fmtBytes(fileSize(poster))}`
    );
  }
  console.log(`\n→ ${outDir}`);
}

main().catch(fail);
