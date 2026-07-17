// 팩트 재검증 결과를 admin inbox에 type='recheck'로 큐잉하는 스크립트
// 사용법: node scripts/recheck-queue.mjs <items.json> [--dry-run]
// items.json 형식: [{ "subject": "...", "content": "...", "priority": "high|medium|low" }]
// - 같은 제목의 미처리(pending/reviewing) recheck가 있으면 중복 큐잉하지 않는다.
// - 이 스크립트는 INSERT만 한다. 기존 데이터 수정/삭제 없음.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

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

const PRIORITIES = ['low', 'medium', 'high'];

async function main() {
  const jsonPath = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!jsonPath) {
    console.error('사용법: node scripts/recheck-queue.mjs <items.json> [--dry-run]');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL이 없습니다 (.env / .env.local 확인)');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const items = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'));
  if (!Array.isArray(items)) {
    console.error('items.json 루트는 배열이어야 합니다');
    process.exit(1);
  }

  let inserted = 0;
  let skipped = 0;
  for (const item of items) {
    const subject = String(item.subject || '').slice(0, 255);
    const content = String(item.content || '');
    const priority = PRIORITIES.includes(item.priority) ? item.priority : 'medium';

    if (!subject || !content) {
      console.warn('skip(필드 누락):', subject || '(제목 없음)');
      skipped++;
      continue;
    }

    const dup = await sql`
      SELECT id FROM inbox
      WHERE type = 'recheck' AND subject = ${subject} AND status IN ('pending', 'reviewing')
      LIMIT 1`;
    if (dup.length) {
      console.log('skip(미처리 중복 존재):', subject);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log('[dry-run] queued:', subject, `(${priority})`);
      inserted++;
      continue;
    }

    await sql`
      INSERT INTO inbox (type, category, subject, content, priority)
      VALUES ('recheck', 'fact', ${subject}, ${content}, ${priority})`;
    console.log('queued:', subject, `(${priority})`);
    inserted++;
  }

  console.log(`완료 — 큐잉 ${inserted}건, 건너뜀 ${skipped}건${dryRun ? ' (dry-run)' : ''}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
