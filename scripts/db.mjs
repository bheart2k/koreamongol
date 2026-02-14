/**
 * DB 헬퍼 스크립트
 *
 * 사용법:
 *   node scripts/db.mjs query "SELECT * FROM users LIMIT 5"
 *   node scripts/db.mjs exec "CREATE TABLE test (id SERIAL PRIMARY KEY)"
 *   node scripts/db.mjs tables
 *   node scripts/db.mjs describe inbox
 *   node scripts/db.mjs count inbox
 *   node scripts/db.mjs push          (drizzle-kit push, 자동 env 로딩)
 *
 * .env.local에서 DATABASE_URL 자동 로딩
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// .env.local 자동 로딩
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // 따옴표 제거
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  } catch {
    // .env.local 없으면 무시
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL이 설정되지 않았습니다.');
  console.error('.env.local 파일에 DATABASE_URL을 설정해주세요.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const [, , command, ...args] = process.argv;

async function run() {
  switch (command) {
    case 'query':
    case 'exec': {
      const query = args.join(' ');
      if (!query) {
        console.error('사용법: node scripts/db.mjs query "SELECT ..."');
        process.exit(1);
      }
      const result = await sql.query(query);
      console.log(JSON.stringify(result, null, 2));
      break;
    }

    case 'tables': {
      const result = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      console.log('테이블 목록:');
      result.forEach((r) => console.log(`  - ${r.table_name}`));
      break;
    }

    case 'describe': {
      const table = args[0];
      if (!table) {
        console.error('사용법: node scripts/db.mjs describe <table_name>');
        process.exit(1);
      }
      const result = await sql.query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1
         ORDER BY ordinal_position`,
        [table]
      );
      if (result.length === 0) {
        console.error(`테이블 "${table}"을 찾을 수 없습니다.`);
        process.exit(1);
      }
      console.log(`\n${table} 테이블 구조:`);
      console.log('-'.repeat(80));
      result.forEach((col) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}${def}`);
      });
      break;
    }

    case 'count': {
      const table = args[0];
      if (!table) {
        console.error('사용법: node scripts/db.mjs count <table_name>');
        process.exit(1);
      }
      // 테이블명은 SQL 인젝션 방지를 위해 영문+언더스코어만 허용
      if (!/^[a-z_]+$/.test(table)) {
        console.error('유효하지 않은 테이블명입니다.');
        process.exit(1);
      }
      const result = await sql.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${result[0].count}건`);
      break;
    }

    case 'push': {
      // drizzle-kit push를 env 로딩된 상태로 실행
      const { execSync } = await import('child_process');
      try {
        execSync('pnpm drizzle-kit push', {
          stdio: 'inherit',
          cwd: process.cwd(),
          env: { ...process.env },
        });
      } catch (e) {
        process.exit(e.status || 1);
      }
      break;
    }

    default:
      console.log(`
DB 헬퍼 스크립트

사용법:
  node scripts/db.mjs query "SELECT * FROM users LIMIT 5"
  node scripts/db.mjs exec  "INSERT INTO ..."
  node scripts/db.mjs tables
  node scripts/db.mjs describe <table_name>
  node scripts/db.mjs count <table_name>
  node scripts/db.mjs push
      `.trim());
      break;
  }
}

run().catch((e) => {
  console.error('DB Error:', e.message);
  process.exit(1);
});
