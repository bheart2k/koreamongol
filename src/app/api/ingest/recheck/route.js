import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { db, inbox } from '@/lib/db';

// Monthly fact recheck intake: cloud routine → admin inbox (type='recheck').
// GET lists unresolved items so the routine can skip matters already queued (compared by content).
// POST is INSERT only and also skips an exact-subject match as a backstop.
const PRIORITIES = ['low', 'medium', 'high'];
const OPEN_STATUSES = ['pending', 'reviewing'];
const MAX_ITEMS = 50;

function checkAuth(request) {
  const token = process.env.RECHECK_INGEST_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'not_configured' }, { status: 501 });
  }
  const header = request.headers.get('authorization') || '';
  const provided = Buffer.from(header.startsWith('Bearer ') ? header.slice(7).trim() : '');
  const expected = Buffer.from(token);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const items = await db
      .select({
        id: inbox.id,
        status: inbox.status,
        priority: inbox.priority,
        subject: inbox.subject,
        content: inbox.content,
        createdAt: inbox.createdAt,
      })
      .from(inbox)
      .where(and(eq(inbox.type, 'recheck'), inArray(inbox.status, OPEN_STATUSES)))
      .orderBy(inbox.id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Recheck list error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items || items.length > MAX_ITEMS) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const dryRun = body.dryRun === true;

  const results = [];
  try {
    for (const item of items) {
      const subject = String(item?.subject || '').trim().slice(0, 255);
      const content = String(item?.content || '').trim();
      const priority = PRIORITIES.includes(item?.priority) ? item.priority : 'medium';
      if (!subject || !content) {
        results.push({ subject, result: 'invalid' });
        continue;
      }

      const [dup] = await db
        .select({ id: inbox.id })
        .from(inbox)
        .where(and(
          eq(inbox.type, 'recheck'),
          eq(inbox.subject, subject),
          inArray(inbox.status, OPEN_STATUSES),
        ))
        .limit(1);
      if (dup) {
        results.push({ subject, result: 'duplicate', id: dup.id });
        continue;
      }

      if (dryRun) {
        results.push({ subject, result: 'would_queue', priority });
        continue;
      }
      const [row] = await db
        .insert(inbox)
        .values({ type: 'recheck', category: 'fact', subject, content, priority })
        .returning({ id: inbox.id });
      results.push({ subject, result: 'queued', id: row.id, priority });
    }
  } catch (error) {
    console.error('Recheck ingest error:', error);
    return NextResponse.json({ error: 'server_error', results }, { status: 500 });
  }

  const count = (r) => results.filter((x) => x.result === r).length;
  return NextResponse.json({
    dryRun,
    queued: count(dryRun ? 'would_queue' : 'queued'),
    duplicate: count('duplicate'),
    invalid: count('invalid'),
    results,
  });
}
