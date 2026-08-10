// 일회성: 법무부 매뉴얼 PDF 텍스트 추출 (검증 후 삭제)
import { readFileSync, writeFileSync } from 'fs';
import zlib from 'zlib';

const FILE = process.argv[2] || 'C:/workspace/koreamongol/scripts/tmp_manual_260130.pdf';
const PAGE_FROM = parseInt(process.argv[3] || '30', 10);
const PAGE_TO = parseInt(process.argv[4] || '48', 10);
const OUT = process.argv[5] || 'C:/workspace/koreamongol/scripts/tmp_pdf_text.txt';

const buf = readFileSync(FILE);
const latin = buf.toString('latin1');

// --- 오브젝트 인덱스 구축 ---
const objs = new Map(); // num -> {start, end}
const objRe = /(\d+)\s+0\s+obj\b/g;
let m;
while ((m = objRe.exec(latin)) !== null) {
  const num = parseInt(m[1], 10);
  const start = m.index + m[0].length;
  const endIdx = latin.indexOf('endobj', start);
  if (endIdx !== -1 && !objs.has(num)) objs.set(num, { start, end: endIdx });
}

function objBody(num) {
  const o = objs.get(num);
  return o ? latin.slice(o.start, o.end) : '';
}

function getStream(num) {
  const o = objs.get(num);
  if (!o) return null;
  const body = latin.slice(o.start, o.end);
  const sIdx = body.indexOf('stream');
  if (sIdx === -1) return null;
  let dataStart = o.start + sIdx + 'stream'.length;
  if (latin[dataStart] === '\r') dataStart++;
  if (latin[dataStart] === '\n') dataStart++;
  const eIdx = latin.indexOf('endstream', dataStart);
  const rawData = buf.slice(dataStart, eIdx);
  if (/\/FlateDecode/.test(body.slice(0, sIdx))) {
    try { return zlib.inflateSync(rawData); } catch (e) {
      try { return zlib.inflateSync(rawData.slice(0, rawData.length - 1)); } catch (e2) { return null; }
    }
  }
  return rawData;
}

// --- ToUnicode CMap 파싱 ---
function parseCMap(streamBuf) {
  const map = new Map();
  const s = streamBuf.toString('latin1');
  // bfchar
  for (const bc of s.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const pair of bc[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const src = parseInt(pair[1], 16);
      const dstHex = pair[2];
      let str = '';
      for (let i = 0; i + 4 <= dstHex.length; i += 4) str += String.fromCharCode(parseInt(dstHex.slice(i, i + 4), 16));
      map.set(src, str);
    }
  }
  // bfrange
  for (const br of s.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const tri of br[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const lo = parseInt(tri[1], 16), hi = parseInt(tri[2], 16), dst = parseInt(tri[3].slice(0, 4), 16);
      for (let c = lo; c <= hi && c - lo < 65536; c++) map.set(c, String.fromCharCode(dst + (c - lo)));
    }
  }
  return map;
}

// --- 페이지 목록 (문서 순서 = obj 등장 순서) ---
const pageNums = [];
for (const [num, o] of objs) {
  const head = latin.slice(o.start, Math.min(o.end, o.start + 200));
  if (/\/Type\s*\/Page(?![s])/.test(head)) pageNums.push(num);
}

const cmapCache = new Map();
function fontCMap(fontObjNum) {
  if (cmapCache.has(fontObjNum)) return cmapCache.get(fontObjNum);
  let cm = null;
  const fb = objBody(fontObjNum);
  // Type0 폰트면 DescendantFonts 안 볼 필요 없이 /ToUnicode가 상위에 있음
  const tu = fb.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
  if (tu) {
    const st = getStream(parseInt(tu[1], 10));
    if (st) cm = parseCMap(st);
  }
  cmapCache.set(fontObjNum, cm);
  return cm;
}

function resolveFontDict(pageBody) {
  // /Resources 가 인라인이거나 ref일 수 있음
  let resBody = pageBody;
  const rref = pageBody.match(/\/Resources\s+(\d+)\s+0\s+R/);
  if (rref) resBody = objBody(parseInt(rref[1], 10));
  const fonts = new Map(); // name -> objnum
  // /Font << /F1 5 0 R ... >> 또는 /Font ref
  let fontSec = null;
  const fref = resBody.match(/\/Font\s+(\d+)\s+0\s+R/);
  if (fref) fontSec = objBody(parseInt(fref[1], 10));
  else {
    const fi = resBody.indexOf('/Font');
    if (fi !== -1) fontSec = resBody.slice(fi, fi + 2000);
  }
  if (fontSec) {
    for (const fm of fontSec.matchAll(/\/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R/g)) {
      fonts.set(fm[1], parseInt(fm[2], 10));
    }
  }
  return fonts;
}

function decodeHex(hex, cmap) {
  let s = '';
  for (let i = 0; i + 4 <= hex.length; i += 4) {
    const code = parseInt(hex.slice(i, i + 4), 16);
    s += cmap && cmap.has(code) ? cmap.get(code) : '';
  }
  return s;
}

function extractPage(pageNum) {
  const body = objBody(pageNum);
  const fonts = resolveFontDict(body);
  // Contents: 단일 ref 또는 배열
  const contents = [];
  const cArr = body.match(/\/Contents\s*\[([^\]]+)\]/);
  if (cArr) for (const r of cArr[1].matchAll(/(\d+)\s+0\s+R/g)) contents.push(parseInt(r[1], 10));
  else {
    const cRef = body.match(/\/Contents\s+(\d+)\s+0\s+R/);
    if (cRef) contents.push(parseInt(cRef[1], 10));
  }
  let text = '';
  for (const cn of contents) {
    const st = getStream(cn);
    if (!st) continue;
    const cs = st.toString('latin1');
    let curCMap = null;
    // 토큰 순회: Tf(폰트 설정), Tj/TJ(텍스트), Td/TD/T*(줄바꿈 힌트)
    const tokRe = /\/([A-Za-z0-9]+)\s+[\d.]+\s+Tf|<([0-9A-Fa-f]+)>\s*Tj|\[((?:[^\]]|\](?!\s*TJ))*)\]\s*TJ|(T\*|TD|Td|ET)/g;
    let t;
    while ((t = tokRe.exec(cs)) !== null) {
      if (t[1] !== undefined) {
        const fn = fonts.get(t[1]);
        curCMap = fn ? fontCMap(fn) : null;
      } else if (t[2] !== undefined) {
        text += decodeHex(t[2], curCMap);
      } else if (t[3] !== undefined) {
        for (const h of t[3].matchAll(/<([0-9A-Fa-f]+)>/g)) text += decodeHex(h[1], curCMap);
      } else if (t[4] !== undefined) {
        if (t[4] === 'T*' || t[4] === 'TD' || t[4] === 'Td' || t[4] === 'ET') text += '\n';
      }
    }
  }
  return text.replace(/\n{2,}/g, '\n');
}

const out = [];
out.push(`total pages: ${pageNums.length}`);
for (let i = PAGE_FROM - 1; i < Math.min(PAGE_TO, pageNums.length); i++) {
  out.push(`\n========== PAGE ${i + 1} (obj ${pageNums[i]}) ==========`);
  out.push(extractPage(pageNums[i]));
}
writeFileSync(OUT, out.join('\n'), 'utf-8');
console.log('done. pages=' + pageNums.length);
