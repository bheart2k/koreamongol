// design-lab 공용 헬퍼: ffmpeg 경로 탐색, 프리셋, 파일 유틸
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ---- 프리셋 (명시 옵션이 항상 우선) ----
export const IMAGE_PRESETS = {
  desktop: { width: 1920, quality: 80 },
  mobile: { width: 828, quality: 78 }, // 390px @2x ≈ 780 → 828
};

export const FRAME_PRESETS = {
  desktop: { fps: 24, width: 1280, quality: 70 },
  mobile: { fps: 16, width: 720, quality: 68 },
};

export const MP4_PRESETS = {
  desktop: { width: 1280, crf: 25, fps: 24 },
  mobile: { width: 720, crf: 27, fps: 24 },
};

// ---- ffmpeg / ffprobe 경로 ----
// 우선순위: 환경변수(FFMPEG_PATH, FFPROBE_PATH) → PATH → winget(Gyan.FFmpeg) 설치 폴더
function worksOnPath(name) {
  const r = spawnSync(name, ['-version'], { stdio: 'ignore' });
  return r.status === 0;
}

function findInWinget(exe) {
  const base = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (!existsSync(base)) return null;
  for (const pkg of readdirSync(base)) {
    if (!pkg.startsWith('Gyan.FFmpeg')) continue;
    const pkgDir = join(base, pkg);
    for (const sub of readdirSync(pkgDir)) {
      const candidate = join(pkgDir, sub, 'bin', `${exe}.exe`);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

const cache = {};
export function resolveBin(name) {
  if (cache[name]) return cache[name];
  const envKey = `${name.toUpperCase()}_PATH`;
  let bin = null;
  if (process.env[envKey] && existsSync(process.env[envKey])) bin = process.env[envKey];
  else if (worksOnPath(name)) bin = name;
  else bin = findInWinget(name);
  if (!bin) {
    throw new Error(
      `${name}을(를) 찾지 못했습니다. winget install --id Gyan.FFmpeg -e 로 설치하거나 ${envKey} 환경변수에 경로를 지정하세요.`
    );
  }
  cache[name] = bin;
  return bin;
}

export function runFfmpeg(args) {
  const r = spawnSync(resolveBin('ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    throw new Error(`ffmpeg 실패 (code ${r.status})\n${r.stderr || r.error || ''}`.trim());
  }
}

// 영상 정보 (width, height, duration, fps, codec)
export function probeVideo(file) {
  const r = spawnSync(
    resolveBin('ffprobe'),
    [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,codec_name,duration:format=duration',
      '-of', 'json', file,
    ],
    { encoding: 'utf-8' }
  );
  if (r.status !== 0) throw new Error(`ffprobe 실패: ${file}\n${r.stderr}`);
  const j = JSON.parse(r.stdout);
  const s = j.streams?.[0];
  if (!s) throw new Error(`영상 스트림이 없습니다: ${file}`);
  const [n, d] = (s.r_frame_rate || '0/1').split('/').map(Number);
  return {
    width: s.width,
    height: s.height,
    codec: s.codec_name,
    fps: d ? n / d : 0,
    duration: Number(s.duration || j.format?.duration || 0),
  };
}

// ---- 공통 유틸 ----
export function fmtBytes(n) {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)}MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${n}B`;
}

export function fileSize(p) {
  return statSync(p).size;
}

export function ensureDir(p) {
  mkdirSync(p, { recursive: true });
  return resolve(p);
}

// 숫자 옵션 파싱 (미지정 → fallback, 잘못된 값 → 에러)
export function num(value, fallback, label) {
  if (value === undefined) return fallback;
  const v = Number(value);
  if (!Number.isFinite(v) || v <= 0) throw new Error(`--${label} 값이 올바르지 않습니다: ${value}`);
  return v;
}

export function pickPreset(presets, name) {
  if (!name) return {};
  if (!presets[name]) throw new Error(`알 수 없는 프리셋: ${name} (desktop | mobile)`);
  return presets[name];
}

export function fail(e) {
  console.error(`\n오류: ${e.message}`);
  process.exit(1);
}
