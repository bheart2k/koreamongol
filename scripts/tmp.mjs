// (A안) 잔재 feedback 테이블 드롭 + site_feedback → feedback rename (일회성)
// 실행: cd /c/workspace/koreamongol && node scripts/tmp.mjs

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

const envContent = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
for (const line of envContent.split('\n')) {
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

const sql = neon(process.env.DATABASE_URL);

async function main() {
  // 안전 확인: 잔재 테이블이 0건인지 재확인 (아니면 중단)
  const [{ cnt }] = await sql`SELECT COUNT(*)::int AS cnt FROM feedback`;
  if (cnt !== 0) {
    console.error(`중단: feedback 테이블에 ${cnt}건의 데이터가 있습니다. 드롭하지 않았습니다.`);
    process.exit(1);
  }

  await sql`DROP TABLE feedback`;
  console.log('1. 잔재 feedback 테이블 드롭 완료 (0건 확인 후)');

  await sql`ALTER TABLE site_feedback RENAME TO feedback`;
  await sql`ALTER INDEX site_feedback_created_idx RENAME TO feedback_created_idx`;
  await sql`ALTER INDEX site_feedback_category_created_idx RENAME TO feedback_category_created_idx`;
  console.log('2. site_feedback → feedback rename 완료 (인덱스 포함)');

  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'feedback' ORDER BY ordinal_position`;
  console.log('3. 최종 feedback 테이블 컬럼:', cols.map((c) => c.column_name).join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
