// 만족도 "이유 칩" 정의 — context(기능)별 + 공통. (한글허브 원형의 표준화, 2026-09-01)
//
// 왜: 별점만 남고 이유(자유입력)는 거의 안 남는다 — 타이핑 마찰이 원인.
//     탭 한 번으로 끝나는 칩 선택으로 바꿔 이유 수집률을 올린다.
//
// 코리아몽골 조정(2026-09-02): 표시는 몽골어(mn), content 저장은 한국어(ko) —
// 허브/관리자(한국어)가 그대로 읽을 수 있게 사이트의 label/labelMn 이중 라벨 규약을 따른다.
// 저장 형식: "칩1, 칩2 — 자유의견(몽골어)".
// 원본은 pedia-factory/template — 구조 수정 시 사용 저장소에 복제 동기화(칩 내용은 사이트별 자유).

// 공통 칩 — 정보 사이트 전반에 유효한 이유 (기존 4문항 주제: 유용성·신뢰도·편의성 계승)
export const COMMON_CHIPS = {
  low: [
    { ko: '오류가 있어요', mn: 'Алдаа гарсан' },
    { ko: '정보가 부족해요', mn: 'Мэдээлэл дутуу' },
    { ko: '사용법이 헷갈려요', mn: 'Ашиглахад ойлгомжгүй' },
  ],
  high: [
    { ko: '정보가 유용해요', mn: 'Мэдээлэл хэрэгтэй' },
    { ko: '믿을 수 있어요', mn: 'Найдвартай' },
    { ko: '도움이 됐어요', mn: 'Тус болсон' },
  ],
};

// 기능별 칩 — 위젯을 배치하며 채운다. 맵에 없는 context는 공통 칩만 노출(안전 폴백).
export const CONTEXT_CHIPS = {
  // 예: 'exchange': { low: [{ ko: '환율이 실제와 달라요', mn: 'Ханш зөрүүтэй' }] },
};

/**
 * 별점에 맞는 칩 목록 — 1~3점은 아쉬운 점, 4~5점은 좋은 점.
 * @returns {{ko: string, mn: string}[]}
 */
export function chipsFor(context, rating) {
  const band = rating <= 3 ? 'low' : 'high';
  const contextChips = CONTEXT_CHIPS[context]?.[band] ?? [];
  return [...contextChips, ...COMMON_CHIPS[band]];
}
