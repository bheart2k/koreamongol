import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, r2Config } from '@/lib/r2-config';

/**
 * Lexical JSON에서 이미지 URL 추출
 * @param {string} content - Lexical 에디터 콘텐츠 (JSON 문자열)
 * @returns {string[]} 이미지 URL 배열
 */
export function extractImageUrls(content) {
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    const urls = [];

    const findImages = (node) => {
      if (node.type === 'image' && node.src) {
        urls.push(node.src);
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(findImages);
      }
    };

    if (parsed.root) {
      findImages(parsed.root);
    }

    return urls;
  } catch (e) {
    console.error('[extractImageUrls] 파싱 오류:', e);
    return [];
  }
}

/**
 * 두 콘텐츠 비교하여 삭제된 이미지 URL 찾기
 * @param {string} oldContent - 이전 콘텐츠
 * @param {string} newContent - 새 콘텐츠
 * @returns {string[]} 삭제된 이미지 URL 배열
 */
export function findRemovedImages(oldContent, newContent) {
  const oldUrls = extractImageUrls(oldContent);
  const newUrls = new Set(extractImageUrls(newContent));

  return oldUrls.filter((url) => !newUrls.has(url));
}

/**
 * R2에서 이미지 삭제 (서버 사이드)
 * @param {string[]} urls - 삭제할 이미지 URL 배열
 */
export async function deleteImagesFromR2(urls) {
  if (!urls || urls.length === 0) return;

  for (const url of urls) {
    try {
      // posts/ 폴더의 이미지만 삭제 (외부 이미지 보호)
      if (!url.includes('/posts/')) continue;

      const urlObj = new URL(url);
      const key = decodeURIComponent(urlObj.pathname.substring(1));

      const command = new DeleteObjectCommand({
        Bucket: r2Config.bucket,
        Key: key,
      });

      await r2Client.send(command);
    } catch (error) {
      console.error(`이미지 삭제 오류: ${url}`, error);
    }
  }
}

/**
 * 임시 이미지를 게시글 폴더로 이동
 * @param {string[]} imageUrls - 이미지 URL 배열
 * @param {string} sessionId - 세션 ID
 * @param {string} postId - 게시글 ID
 * @param {string} boardType - 게시판 타입 (blog, free, notice)
 * @returns {Promise<string[]>} 이동된 이미지 URL 배열
 */
export async function moveTempImages(imageUrls, sessionId, postId, boardType) {
  if (!imageUrls || imageUrls.length === 0) return [];

  const movedUrls = [];

  for (const oldUrl of imageUrls) {
    try {
      // temp 폴더 이미지인지 확인
      if (!oldUrl.includes('/posts/temp/')) {
        movedUrls.push(oldUrl);
        continue;
      }

      // 기존 key 추출
      const urlObj = new URL(oldUrl);
      const oldKey = decodeURIComponent(urlObj.pathname.substring(1));

      // 새 key 생성 (posts/temp/{sessionId}/{fileName} -> posts/{boardType}/{postId}/{fileName})
      const fileName = oldKey.split('/').pop();
      const newKey = `posts/${boardType}/${postId}/${fileName}`;

      // R2에서 복사
      await r2Client.send(new CopyObjectCommand({
        Bucket: r2Config.bucket,
        CopySource: encodeURI(`${r2Config.bucket}/${oldKey}`),
        Key: newKey,
      }));

      // 기존 파일 삭제
      await r2Client.send(new DeleteObjectCommand({
        Bucket: r2Config.bucket,
        Key: oldKey,
      }));

      // 새 URL 생성
      const newUrl = `${r2Config.publicUrl}/${newKey}`;
      movedUrls.push(newUrl);
    } catch (error) {
      console.error('[moveTempImages] 이미지 이동 실패:', oldUrl, error);
      movedUrls.push(oldUrl); // 실패 시 기존 URL 유지
    }
  }

  return movedUrls;
}
