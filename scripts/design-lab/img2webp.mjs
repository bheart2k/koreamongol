#!/usr/bin/env node
// 이미지(PNG/JPG 등) → WebP 변환 (sharp)
// 사용: node scripts/design-lab/img2webp.mjs <파일|폴더>... --out <출력폴더> [--preset desktop|mobile] [--width N] [--quality N]
import { readdirSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import { IMAGE_PRESETS, ensureDir, fail, fileSize, fmtBytes, num, pickPreset } from './_lib.mjs';

const HELP = `이미지 → WebP
  node scripts/design-lab/img2webp.mjs <파일|폴더>... --out <출력폴더> [옵션]

옵션
  -o, --out <dir>       출력 폴더 (필수)
  -p, --preset <name>   desktop(폭 1920, q80) | mobile(폭 828, q78)
  -w, --width <px>      최대 폭 (원본보다 크게 키우지 않음)
  -q, --quality <1-100> WebP 품질
      --effort <0-6>    인코딩 노력도 (기본 6, 높을수록 작지만 느림)
      --lossless        무손실
      --suffix <str>    출력 파일명 뒤에 붙일 문자열 (예: --suffix=-m → hero-m.webp, 값이 - 로 시작하면 = 필수)
  -h, --help`;

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp', '.avif']);

function collect(inputs) {
  const files = [];
  for (const input of inputs) {
    const p = resolve(input);
    if (statSync(p).isDirectory()) {
      for (const name of readdirSync(p).sort()) {
        if (IMG_EXT.has(extname(name).toLowerCase())) files.push(join(p, name));
      }
    } else {
      files.push(p);
    }
  }
  return files;
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string', short: 'o' },
      preset: { type: 'string', short: 'p' },
      width: { type: 'string', short: 'w' },
      quality: { type: 'string', short: 'q' },
      effort: { type: 'string' },
      lossless: { type: 'boolean' },
      suffix: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help || !positionals.length) return console.log(HELP);
  if (!values.out) throw new Error('--out 이 필요합니다.');

  const preset = { ...IMAGE_PRESETS.desktop, ...pickPreset(IMAGE_PRESETS, values.preset) };
  const width = num(values.width, preset.width, 'width');
  const quality = num(values.quality, preset.quality, 'quality');
  const effort = Math.min(6, Math.round(num(values.effort, 6, 'effort')));
  const suffix = values.suffix ?? '';
  const outDir = ensureDir(values.out);

  const files = collect(positionals);
  if (!files.length) throw new Error('변환할 이미지가 없습니다.');

  let totalIn = 0;
  let totalOut = 0;
  for (const file of files) {
    const out = join(outDir, `${basename(file, extname(file))}${suffix}.webp`);
    if (resolve(out) === resolve(file)) throw new Error(`입력과 출력이 같습니다: ${file}`);
    const info = await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort, lossless: !!values.lossless, smartSubsample: true })
      .toFile(out);
    const inSize = fileSize(file);
    totalIn += inSize;
    totalOut += info.size;
    console.log(
      `${basename(file)} → ${basename(out)}  ${info.width}×${info.height}  ${fmtBytes(inSize)} → ${fmtBytes(info.size)}`
    );
  }
  console.log(`\n${files.length}장 · 원본 ${fmtBytes(totalIn)} → WebP ${fmtBytes(totalOut)} (${outDir})`);
}

main().catch(fail);
