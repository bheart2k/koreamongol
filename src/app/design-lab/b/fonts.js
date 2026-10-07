// 시안 B 전용 서체 — 몽골어 Ө/Ү 는 cyrillic-ext 에 있음 (브라우저 렌더링으로 자체 글리프 확인)
// subsets = preload 대상. 나머지 서브셋(latin, cyrillic-ext)도 @font-face 는 포함되어 필요할 때 받는다.
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

// 디스플레이 세리프: 초대형 제목·숫자 (가변 굵기 300–700 → 스타일당 파일 1개)
export const display = Cormorant_Garamond({
  subsets: ['cyrillic'],
  style: ['normal', 'italic'],
  variable: '--b-font-display',
  display: 'swap',
});

// 캡션·인덱스 번호용 모노 (첫 화면 핵심이 아니므로 preload 안 함)
export const mono = JetBrains_Mono({
  subsets: ['cyrillic'],
  variable: '--b-font-mono',
  display: 'swap',
  preload: false,
});
