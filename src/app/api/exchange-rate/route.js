import { NextResponse } from 'next/server';

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 3600 * 1000; // 1시간

async function fetchFromCDN() {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json',
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error(`CDN ${res.status}`);
  const json = await res.json();
  return { rate: json.krw.mnt, date: json.date, source: 'fawazahmed0' };
}

async function fetchFromOpenER() {
  const res = await fetch(
    'https://open.er-api.com/v6/latest/KRW',
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error(`OpenER ${res.status}`);
  const json = await res.json();
  return { rate: json.rates.MNT, date: json.time_last_update_utc?.slice(0, 16) || '', source: 'exchangerate-api' };
}

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  let data;
  try {
    data = await fetchFromCDN();
  } catch {
    try {
      data = await fetchFromOpenER();
    } catch {
      if (cache.data) {
        return NextResponse.json({ ...cache.data, stale: true });
      }
      return NextResponse.json({ error: 'Ханш авах боломжгүй байна' }, { status: 502 });
    }
  }

  data.fetchedAt = new Date(now).toISOString();
  cache = { data, timestamp: now };
  return NextResponse.json(data);
}
