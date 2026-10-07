// /design-lab/videos 데이터 — 젠스파크로 만든 영상. 새 영상은 이 배열에 항목만 추가한다.
// 완료(status: 'done') 영상은 페이지에서 좌우로 나란히 놓이고, 아래 비교표의 열이 된다.
//
// status    : 'done' | 'pending'(생성 중) | 'failed'
// method    : 'A' = 직접 조작(Claude Code → aside repl), 'B' = Aside 에이전트(aside exec)
// bytes     : { original, web } 실제 파일 크기(바이트, stat 실측). original = R2 cdn.koreamongol.com/design-lab/originals/_genspark/<id>.mp4,
//             web = R2 cdn.koreamongol.com/design-lab/v1/videos/<id>.mp4 (scripts/design-lab/video2mp4.mjs 변환본: H.264·faststart·무음)
// credits   : { estimate: 확인 폼 표시값, actual: 실제 차감, before, after: 잔액 }
// frameMatch: 첫 프레임↔입력 시작, 끝 프레임↔입력 끝의 평균 절대 픽셀 차(0–255, 낮을수록 일치), opposite = 반대 이미지와의 차
// userNote  : 사용자 소견(원문 그대로) / reviewNotes: 워커 검수 메모 (순서 관련 내용은 비교 의미가 없어 넣지 않는다)
// 사용법·실측 근거: C:\Users\jedik\.claude\docs\genspark-video.md

import { LAB_ASSET_BASE } from '../_shared/asset';

// 에셋은 R2 cdn.koreamongol.com/design-lab/v1/videos/
const DIR = `${LAB_ASSET_BASE}/videos`;

export const METHOD_LABEL = {
  A: '방법 A · 직접 조작 (aside repl)',
  B: '방법 B · Aside 에이전트 (aside exec)',
};

// 사용자 소견 — 두 영상 공통 (원문 그대로)
export const commonUserNote = '품질은 Seedance가 확실히 좋다. 작게 볼 때는 MiniMax로도 충분하지만, 크게 보면 MiniMax는 쓰기 어렵다.';

export const videos = [
  {
    id: 'c-hero-day-h3-test',
    status: 'done',
    date: '2026-10-07',
    label: 'MiniMax H3 · 낮',
    title: '시안 C 히어로 · 낮 — 몽골 섬에서 서울 섬으로',
    scene: '구름 위 두 떠 있는 섬(클레이 디오라마). 몽골 초원 섬에서 출발한 작은 여객기가 금빛 궤적을 그리며 날아 서울 섬 왼쪽 활주로에 착륙하고, 카메라는 서울 섬으로 밀고 들어간다.',
    model: 'MiniMax H3',
    settings: '768p · 16:9 · 8초 · 생성 1회 · 참조 모드 끔 · 자동 프롬프트 끔',
    method: 'A',
    output: '1344×768 (7:4) · 24fps · 8.00초 (192프레임)',
    audio: '원본: AAC 오디오 있음(실제 소리, 평균 −15.8dB, 끄기 옵션 없음) · 웹본: 무음',
    bytes: { original: 5226217, web: 2216337 },
    credits: { estimate: 640, actual: 704, before: 10000, after: 9296 },
    elapsed: '확인 폼 제출 → 완성 약 231초',
    frameMatch: { start: 9.7, end: 14.3, opposite: 53 },
    userNote: '비행기가 짧은 거리로 바로 이동하느라 갈팡질팡하다가 활주로(도로)에 어색하게 착륙한다. 마지막 이미지에 억지로 맞춘 느낌.',
    reviewNotes: [
      '확인한 프레임에서 건물 관통·형태 붕괴 없음, 클레이 질감 일관',
      '시작 이미지에서 비행기가 이미 공중이라 지상 이륙 장면은 없음',
      '출력이 7:4라 16:9 입력과 약간의 크롭·스케일 차이',
    ],
    src: `${DIR}/c-hero-day-h3-test.mp4`,
    poster: `${DIR}/c-hero-day-h3-test.poster.webp`,
    start: `${DIR}/c-hero-day-h3-test-start.webp`,
    end: `${DIR}/c-hero-day-h3-test-end.webp`,
    genspark: 'https://www.genspark.ai/agents?id=40c5fde0-89e0-4e30-9b68-cb4c139a0376',
  },
  {
    id: 'c-hero-night-seedance-test',
    status: 'done',
    date: '2026-10-07',
    label: 'Seedance 2.5 · 밤',
    title: '시안 C 히어로 · 밤 — 몽골 섬에서 서울 섬으로',
    scene: '초승달 아래 구름 위 두 섬(밤, 서울 섬에 불이 켜짐). 비행기가 빛나는 궤적을 그리며 몽골 섬에서 날아와 서울 섬 활주로에 내리고, 카메라는 서울 섬으로 밀고 들어간다.',
    model: 'Seedance 2.5',
    settings: '720p · 16:9 · 8초 · 오디오 끔',
    method: 'B',
    output: '1280×720 (16:9) · 24fps · 8.04초 (193프레임)',
    audio: '원본: 오디오 트랙 없음(오디오 끔) · 웹본: 무음',
    bytes: { original: 2379955, web: 1544161 },
    credits: { estimate: 1848, actual: 2033, before: 9296, after: 7263 },
    elapsed: '확인 폼 제출 → 완성 약 261초 (4분 21초)',
    frameMatch: { start: 5.8, end: 7.4, opposite: 46 },
    userNote: '비행기 움직임이 훨씬 자연스럽다. 활주로에 진입할 회전 공간을 미리 확보하려고 뒤쪽으로 크게 돌아갔다가 다시 꺾어 들어온다.',
    reviewNotes: [
      '건물 관통 없음, 형태 안정',
      '5초 전후 궤적이 카메라 이동과 겹쳐 약간 꺾여 보임',
    ],
    src: `${DIR}/c-hero-night-seedance-test.mp4`,
    poster: `${DIR}/c-hero-night-seedance-test.poster.webp`,
    start: `${DIR}/c-hero-night-start.webp`,
    end: `${DIR}/c-hero-night-end.webp`,
    genspark: 'https://www.genspark.ai/agents?id=8af6fed4-1e88-405f-a6f5-560f8e2a73f5',
  },
];
