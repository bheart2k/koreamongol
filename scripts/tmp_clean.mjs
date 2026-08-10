// 일회성: g4f_common.js에서 fnNewFileDownLoad 함수 추출 (검증 후 삭제)
import { readFileSync } from 'fs';
const s = readFileSync('C:/workspace/koreamongol/scripts/tmp_hikorea_g4f.js', 'utf-8');
const i = s.indexOf('function fnNewFileDownLoad');
console.log(i === -1 ? 'not found' : s.slice(i, i + 2500));
