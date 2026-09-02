/**
 * feedback 테이블 표준 컬럼 additive 추가 (1회성 마이그레이션, 2026-09-02)
 * 허브 스펙: bloomingheart_next/docs/feedback-hub-스펙.md §2.2 — 표준 제출 모듈 도입분.
 * ADD COLUMN IF NOT EXISTS만 사용 — 기존 데이터·컬럼 무접촉, 재실행 안전(멱등).
 *
 * 실행: node scripts/add-feedback-standard-columns.mjs
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// .env.local → .env 순서로 자동 로딩 (scripts/db.mjs와 동일)
for (const file of ['.env.local', '.env']) {
  try {
    const content = readFileSync(resolve(process.cwd(), file), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // 파일 없으면 무시
  }
}

const sql = neon(process.env.DATABASE_URL);

await sql.query(`ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS rating smallint,
  ADD COLUMN IF NOT EXISTS title varchar(100) DEFAULT '',
  ADD COLUMN IF NOT EXISTS feature varchar(50),
  ADD COLUMN IF NOT EXISTS page_url varchar(255),
  ADD COLUMN IF NOT EXISTS source varchar(20),
  ADD COLUMN IF NOT EXISTS viewport varchar(20),
  ADD COLUMN IF NOT EXISTS referrer varchar(500),
  ADD COLUMN IF NOT EXISTS ip_address varchar(50),
  ADD COLUMN IF NOT EXISTS country varchar(5),
  ADD COLUMN IF NOT EXISTS city varchar(100),
  ADD COLUMN IF NOT EXISTS extra text,
  ADD COLUMN IF NOT EXISTS priority varchar(10) DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS previous_status varchar(20) DEFAULT ''`);

const cols = await sql.query(
  `SELECT column_name, data_type FROM information_schema.columns
   WHERE table_schema='public' AND table_name='feedback' ORDER BY ordinal_position`
);
console.log('feedback 컬럼:', cols.map((c) => c.column_name).join(', '));
const [{ count }] = await sql.query('SELECT COUNT(*) AS count FROM feedback');
console.log(`기존 행 ${count}건 무접촉 유지. 완료.`);
