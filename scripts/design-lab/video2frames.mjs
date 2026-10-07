#!/usr/bin/env node
// 영상 → WebP 프레임 시퀀스 추출 (캔버스 스크럽용). 출력: <prefix>-0001.webp ... + manifest.json
// 사용: node scripts/design-lab/video2frames.mjs <영상> --out <출력폴더> [--preset desktop|mobile] [--fps N] [--width N] [--quality N]
import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import {
  FRAME_PRESETS, ensureDir, fail, fileSize, fmtBytes, num, pickPreset, probeVideo, runFfmpeg,
} from './_lib.mjs';

const HELP = `영상 → WebP 프레임 시퀀스
  node scripts/design-lab/video2frames.mjs <영상> --out <출력폴더> [옵션]

옵션
  -o, --out <dir>       출력 폴더 (필수). 같은 prefix의 기존 프레임은 먼저 지움
  -p, --preset <name>   desktop(24fps, 폭 1280, q70) | mobile(16fps, 폭 720, q68)
      --fps <N>         초당 프레임 수
  -w, --width <px>      폭 (높이는 비율 유지, 짝수)
  -q, --quality <1-100> WebP 품질
      --start <sec>     시작 시각(초)
      --duration <sec>  구간 길이(초)
      --prefix <str>    파일명 접두어 (기본 frame → frame-0001.webp)
  -h, --help

manifest.json: { count, fps, width, height, pattern, startIndex, bytes, avgBytes }`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string', short: 'o' },
      preset: { type: 'string', short: 'p' },
      fps: { type: 'string' },
      width: { type: 'string', short: 'w' },
      quality: { type: 'string', short: 'q' },
      start: { type: 'string' },
      duration: { type: 'string' },
      prefix: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help || !positionals.length) return console.log(HELP);
  if (!values.out) throw new Error('--out 이 필요합니다.');
  const input = positionals[0];

  const preset = { ...FRAME_PRESETS.desktop, ...pickPreset(FRAME_PRESETS, values.preset) };
  const fps = num(values.fps, preset.fps, 'fps');
  const width = num(values.width, preset.width, 'width');
  const quality = num(values.quality, preset.quality, 'quality');
  const prefix = values.prefix || 'frame';
  const outDir = ensureDir(values.out);

  const src = probeVideo(input);
  console.log(`입력: ${src.width}×${src.height} · ${src.fps.toFixed(2)}fps · ${src.duration.toFixed(2)}s · ${src.codec}`);

  // 이전 실행의 잔여 프레임 제거
  const re = new RegExp(`^${prefix}-\\d{4,}\\.webp$`);
  for (const f of readdirSync(outDir)) if (re.test(f)) rmSync(join(outDir, f));

  runFfmpeg([
    ...(values.start ? ['-ss', String(num(values.start, 0, 'start'))] : []),
    '-i', input,
    ...(values.duration ? ['-t', String(num(values.duration, 0, 'duration'))] : []),
    '-an',
    // 원본 색공간 태그 기준으로 RGB 변환 후 인코딩 → YUV 매트릭스 불일치 방지
    '-vf', `fps=${fps},scale=${Math.round(width)}:-2:flags=lanczos`,
    '-pix_fmt', 'bgra',
    '-c:v', 'libwebp', '-quality', String(quality), '-compression_level', '6',
    join(outDir, `${prefix}-%04d.webp`),
  ]);

  const frames = readdirSync(outDir).filter((f) => re.test(f)).sort();
  if (!frames.length) throw new Error('프레임이 생성되지 않았습니다.');
  const bytes = frames.reduce((sum, f) => sum + fileSize(join(outDir, f)), 0);
  const meta = await sharp(join(outDir, frames[0])).metadata();

  const manifest = {
    count: frames.length,
    fps,
    width: meta.width,
    height: meta.height,
    pattern: `${prefix}-%04d.webp`,
    startIndex: 1,
    bytes,
    avgBytes: Math.round(bytes / frames.length),
  };
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(
    `${frames.length}프레임 · ${meta.width}×${meta.height} · 합계 ${fmtBytes(bytes)} (프레임당 평균 ${fmtBytes(manifest.avgBytes)})\n→ ${outDir}`
  );
}

main().catch(fail);
