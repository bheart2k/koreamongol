// design-lab 에셋은 git 이 아니라 R2(cdn.koreamongol.com)에서 받는다.
// 업로드: scripts/design-lab/upload-r2.mjs <웹용 폴더> (<폴더>/** → design-lab/v1/**). 프로젝트 public 에는 두지 않는다.
// 서버·클라이언트 양쪽에서 쓰는 순수 함수만 둔다.

export const LAB_ASSET_BASE = 'https://cdn.koreamongol.com/design-lab/v1';

const LOCAL_PREFIX = '/design-lab/';

// '/design-lab/a/k1.webp' → 'https://cdn.koreamongol.com/design-lab/v1/a/k1.webp'
// 이미 http(s) URL 이거나 design-lab 경로가 아니면 그대로 돌려준다.
export function labAsset(path) {
  if (typeof path !== 'string' || /^https?:\/\//i.test(path)) return path;
  if (!path.startsWith(LOCAL_PREFIX)) return path;
  return `${LAB_ASSET_BASE}/${path.slice(LOCAL_PREFIX.length)}`;
}
