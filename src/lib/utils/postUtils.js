/**
 * Post 유틸리티 - Lexical JSON 처리
 * (기존 Post 모델의 static methods를 분리)
 */

/**
 * Lexical JSON에서 텍스트 추출
 */
export function extractTextFromContent(content) {
  try {
    const parsed = JSON.parse(content);
    if (parsed.root) {
      const texts = [];
      const extractText = (node) => {
        if (node.text) texts.push(node.text);
        if (node.children) node.children.forEach(extractText);
      };
      extractText(parsed.root);
      return texts.join(' ');
    }
  } catch {
    // JSON 파싱 실패 시 그대로 반환
  }
  return content;
}

/**
 * summary 생성
 */
export function generateSummary(content, maxLength = 150) {
  const text = extractTextFromContent(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
