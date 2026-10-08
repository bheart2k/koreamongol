// 데이터 절약 모드
export function prefersSaveData() {
  if (typeof navigator === 'undefined') return false;
  return Boolean(navigator.connection?.saveData);
}

// 데이터 절약·느린 망이면 영상 대신 정지 이미지만 쓴다
export function prefersLightAssets() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType || '') || c.effectiveType === '3g';
}
