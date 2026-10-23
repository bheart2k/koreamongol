// 팩트 재검증 결과를 admin inbox에 type='recheck'로 큐잉하는 스크립트
// 사용법: node scripts/recheck-queue.mjs <items.json> [--dry-run]
// items.json 형식: [{ "subject": "...", "content": "...", "priority": "high|medium|low" }]
// - 사이트 API(POST /api/ingest/recheck)로 보낸다. DB 직접 접속·npm 패키지 없이 돌아가서 클라우드 루틴에서도 쓴다.
// - env: RECHECK_INGEST_TOKEN(필수), RECHECK_API_BASE(기본 https://koreamongol.com — 로컬 dev는 http://localhost:5005)
// - 같은 제목의 미처리(pending/reviewing) recheck가 있으면 API가 중복 큐잉하지 않는다. INSERT만 한다.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnv(file) {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    process.env[k] ??= v;
  }
}
loadEnv('.env.local');
loadEnv('.env');

const LABEL = { queued: 'queued', would_queue: '[dry-run] queued', duplicate: 'skip(미처리 중복 존재)', invalid: 'skip(필드 누락)' };

async function main() {
  const jsonPath = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!jsonPath) {
    console.error('사용법: node scripts/recheck-queue.mjs <items.json> [--dry-run]');
    process.exit(1);
  }
  const token = process.env.RECHECK_INGEST_TOKEN;
  if (!token) {
    console.error('RECHECK_INGEST_TOKEN이 없습니다 (.env 또는 환경변수 확인)');
    process.exit(1);
  }

  const items = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'));
  if (!Array.isArray(items)) {
    console.error('items.json 루트는 배열이어야 합니다');
    process.exit(1);
  }
  if (!items.length) {
    console.log('완료 — 큐잉할 항목 없음');
    return;
  }

  const base = (process.env.RECHECK_API_BASE || 'https://koreamongol.com').replace(/\/$/, '');
  const res = await fetch(`${base}/api/ingest/recheck`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items, dryRun }),
  });
  const data = await res.json().catch(() => ({}));
  for (const r of data.results || []) {
    console.log(`${LABEL[r.result] || r.result}:`, r.subject, r.priority ? `(${r.priority})` : '');
  }
  if (!res.ok) {
    console.error(`API 오류 ${res.status}: ${data.error || '응답 없음'} (${base})`);
    process.exit(1);
  }

  console.log(`완료 — 큐잉 ${data.queued}건, 건너뜀 ${data.duplicate + data.invalid}건${dryRun ? ' (dry-run)' : ''}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
