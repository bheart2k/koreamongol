// 일회성: easylaw 페이지 본문 후반부 추출 (검증 후 삭제)
import { writeFileSync } from 'fs';

const url = 'https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=2853&ccfNo=3&cciNo=6&cnpClsNo=1';
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
let raw = await res.text();
raw = raw.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

const unesc = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

const text = unesc(raw.replace(/<[^>]+>/g, '\n')).replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n');
const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

const out = lines.slice(250, 400).map((l, i) => `[${i + 250}] ${l}`);
writeFileSync('C:/workspace/koreamongol/scripts/tmp_easylaw_out.txt', out.join('\n'), 'utf-8');
console.log('done');
