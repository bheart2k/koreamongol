export { default as LexicalEditor } from './LexicalEditor';
export { default as LexicalViewer } from './LexicalViewer';

/**
 * Lexical JSON에서 순수 텍스트 추출
 * @param {string} content - Lexical JSON 문자열 또는 일반 텍스트
 * @returns {string} 순수 텍스트
 */
export function extractTextFromLexical(content) {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    const texts = [];

    // 재귀적으로 모든 텍스트 노드 추출
    const extractText = (node) => {
      if (node.text) {
        texts.push(node.text);
      }
      if (node.children) {
        node.children.forEach(extractText);
      }
    };

    if (parsed.root) {
      extractText(parsed.root);
    }

    return texts.join(' ').trim();
  } catch {
    // JSON 파싱 실패 시 일반 텍스트로 처리
    return content;
  }
}
