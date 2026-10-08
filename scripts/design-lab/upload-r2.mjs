// <폴더>/** → R2 버킷 <prefix>/** (같은 상대 경로. 예: <폴더>/d/k1.webp → design-lab/v1/d/k1.webp)
// - prefix 기본값 design-lab/v1. design-lab/ 또는 home/ 아래 prefix 만 허용한다 (버킷의 다른 경로는 건드리지 않음)
// - 쓰기는 prefix 아래로만 한다. 삭제는 하지 않는다
// - 같은 키에 같은 크기의 객체가 이미 있으면 건너뛴다 (재실행 안전)
// - --ext mp4,webp : 해당 확장자만 올린다 (없으면 전부)
// usage: node scripts/design-lab/upload-r2.mjs <폴더> [--prefix design-lab/v1] [--ext mp4] [--dry-run] [--concurrency 8]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';

const ROOT = process.cwd();
const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const CONTENT_TYPES = {
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// ---- 옵션 ----
const USAGE = 'usage: node scripts/design-lab/upload-r2.mjs <폴더> [--prefix design-lab/v1] [--ext mp4] [--dry-run] [--concurrency 8]';
const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const VALUE_OPTS = ['--concurrency', '--prefix', '--ext'];
const optValue = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : undefined;
};
const concurrency = Math.max(1, Number(optValue('--concurrency')) || 8);
const srcArg = argv.find((a, i) => !a.startsWith('--') && !VALUE_OPTS.includes(argv[i - 1]));
if (!srcArg) {
  console.error(USAGE);
  process.exit(1);
}
const SRC_DIR = resolve(ROOT, srcArg);

// 앞뒤 슬래시를 정리하고 끝에 / 를 붙인다. design-lab/ 또는 home/ 아래가 아니거나 .. 이 있으면 거부
const prefixArg = (optValue('--prefix') ?? 'design-lab/v1').replace(/^\/+|\/+$/g, '');
if (!/^(design-lab|home)\/[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*$/.test(prefixArg) || prefixArg.split('/').includes('..')) {
  console.error(`--prefix 는 design-lab/ 또는 home/ 아래 경로만 허용합니다: ${prefixArg}`);
  process.exit(1);
}
const PREFIX = `${prefixArg}/`;

const extArg = optValue('--ext');
const EXTS = extArg ? extArg.split(',').map((e) => `.${e.trim().replace(/^\./, '').toLowerCase()}`) : null;

// ---- .env.local → .env 순으로 R2_* 로딩 (이미 있는 환경변수가 우선) ----
for (const name of ['.env.local', '.env']) {
  const file = resolve(ROOT, name);
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[k] ??= v;
  }
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`환경변수 누락: ${missing.join(', ')} (.env.local 확인)`);
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// ---- 로컬 파일 목록 ----
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

if (!existsSync(SRC_DIR)) {
  console.error(`폴더 없음: ${SRC_DIR}`);
  process.exit(1);
}

const files = walk(SRC_DIR).filter((full) => !EXTS || EXTS.includes(extname(full).toLowerCase())).map((full) => {
  const rel = relative(SRC_DIR, full).split(sep).join('/');
  return { full, key: PREFIX + rel, size: statSync(full).size, type: CONTENT_TYPES[extname(full).toLowerCase()] };
});

const unknown = files.filter((f) => !f.type);
if (unknown.length) {
  console.error('Content-Type 을 모르는 확장자가 있어 중단합니다:');
  for (const f of unknown) console.error(`  ${f.key}`);
  process.exit(1);
}

// ---- 버킷의 design-lab/v1/ 아래 기존 객체 (읽기 전용 목록 조회) ----
async function listRemote() {
  const map = new Map();
  let token;
  do {
    const res = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME, Prefix: PREFIX, ContinuationToken: token }));
    for (const o of res.Contents ?? []) map.set(o.Key, o.Size);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return map;
}

const fmtMB = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;

const remote = await listRemote();
const todo = files.filter((f) => remote.get(f.key) !== f.size);
const skipped = files.length - todo.length;
const todoBytes = todo.reduce((s, f) => s + f.size, 0);

console.log(`로컬 ${files.length}개 · ${fmtMB(files.reduce((s, f) => s + f.size, 0))}`);
console.log(`건너뜀(같은 크기) ${skipped}개 · 업로드 대상 ${todo.length}개 · ${fmtMB(todoBytes)}${dryRun ? ' (dry-run)' : ''}`);

if (dryRun) {
  for (const f of todo) console.log(`  ${f.key}  ${f.type}  ${f.size}`);
  process.exit(0);
}

// ---- 업로드 (동시 실행 제한) ----
let done = 0;
const failed = [];
async function upload(f) {
  if (!f.key.startsWith(PREFIX)) throw new Error(`접두어 밖 키 거부: ${f.key}`);
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: f.key,
    Body: readFileSync(f.full),
    ContentLength: f.size,
    ContentType: f.type,
    CacheControl: CACHE_CONTROL,
  }));
}

const queue = [...todo];
await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
  for (let f = queue.shift(); f; f = queue.shift()) {
    try {
      await upload(f);
    } catch (err) {
      failed.push(`${f.key}: ${err.name || ''} ${err.message}`);
    }
    done += 1;
    if (done % 50 === 0 || done === todo.length) console.log(`  ${done}/${todo.length}`);
  }
}));

// ---- 결과 대조 ----
const after = await listRemote();
const mismatch = files.filter((f) => after.get(f.key) !== f.size).map((f) => f.key);
console.log(`업로드 ${todo.length - failed.length}개 · 실패 ${failed.length}개`);
console.log(`버킷 ${PREFIX} 전체 객체 ${after.size}개 · 이번 로컬 파일 중 크기 불일치 ${mismatch.length}개`);
for (const line of failed) console.error(`  실패 ${line}`);
for (const key of mismatch.slice(0, 20)) console.error(`  불일치 ${key}`);
if (failed.length || mismatch.length) process.exit(1);
