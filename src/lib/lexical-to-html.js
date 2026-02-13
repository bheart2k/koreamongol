/**
 * Lexical JSON → HTML 변환 유틸리티
 * 서버 사이드에서 Lexical 콘텐츠를 HTML로 렌더링하기 위한 함수
 */

/**
 * 텍스트 노드의 포맷을 HTML 태그로 변환
 */
function applyTextFormat(text, format) {
  if (!format) return escapeHtml(text);

  let result = escapeHtml(text);

  // Lexical format flags (비트마스크)
  // 1: bold, 2: italic, 4: strikethrough, 8: underline, 16: code, 32: subscript, 64: superscript
  if (format & 1) result = `<strong>${result}</strong>`;
  if (format & 2) result = `<em>${result}</em>`;
  if (format & 4) result = `<s>${result}</s>`;
  if (format & 8) result = `<u>${result}</u>`;
  if (format & 16) result = `<code class="bg-muted px-1.5 py-0.5 rounded text-sm">${result}</code>`;
  if (format & 32) result = `<sub>${result}</sub>`;
  if (format & 64) result = `<sup>${result}</sup>`;

  return result;
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 단일 노드를 HTML로 변환
 */
function nodeToHtml(node) {
  if (!node) return '';

  const { type, children } = node;

  switch (type) {
    case 'root':
      return children?.map(nodeToHtml).join('') || '';

    case 'paragraph':
      const pContent = children?.map(nodeToHtml).join('') || '';
      if (!pContent.trim()) return '<p class="mb-4">&nbsp;</p>';
      return `<p class="mb-4 leading-relaxed">${pContent}</p>`;

    case 'heading': {
      const tag = node.tag || 'h2';
      const headingContent = children?.map(nodeToHtml).join('') || '';
      const headingClasses = {
        h1: 'text-3xl font-bold mt-8 mb-4',
        h2: 'text-2xl font-bold mt-6 mb-3',
        h3: 'text-xl font-semibold mt-5 mb-2',
        h4: 'text-lg font-semibold mt-4 mb-2',
        h5: 'text-base font-semibold mt-3 mb-2',
        h6: 'text-sm font-semibold mt-3 mb-2',
      };
      return `<${tag} class="${headingClasses[tag] || ''}">${headingContent}</${tag}>`;
    }

    case 'text':
      let textHtml = applyTextFormat(node.text || '', node.format);
      // 스타일 적용 (색상 등)
      if (node.style) {
        textHtml = `<span style="${escapeHtml(node.style)}">${textHtml}</span>`;
      }
      return textHtml;

    case 'link':
    case 'autolink': {
      const url = node.url || '#';
      const linkContent = children?.map(nodeToHtml).join('') || url;
      const rel = node.rel || 'noopener noreferrer';
      const target = node.target || '_blank';
      return `<a href="${escapeHtml(url)}" rel="${rel}" target="${target}" class="text-accent hover:underline">${linkContent}</a>`;
    }

    case 'list': {
      const listTag = node.listType === 'number' ? 'ol' : 'ul';
      const listClass = node.listType === 'number'
        ? 'list-decimal pl-6 mb-4 space-y-1'
        : 'list-disc pl-6 mb-4 space-y-1';
      const listContent = children?.map(nodeToHtml).join('') || '';
      return `<${listTag} class="${listClass}">${listContent}</${listTag}>`;
    }

    case 'listitem': {
      const liContent = children?.map(nodeToHtml).join('') || '';
      return `<li class="leading-relaxed">${liContent}</li>`;
    }

    case 'quote': {
      const quoteContent = children?.map(nodeToHtml).join('') || '';
      return `<blockquote class="border-l-4 border-accent/50 pl-4 py-2 my-4 italic text-muted-foreground">${quoteContent}</blockquote>`;
    }

    case 'code': {
      const codeContent = children?.map(nodeToHtml).join('') || '';
      const language = node.language || '';
      return `<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm" data-language="${escapeHtml(language)}">${codeContent}</code></pre>`;
    }

    case 'code-highlight': {
      // 코드 하이라이트 내 텍스트
      return escapeHtml(node.text || '');
    }

    case 'image': {
      const { src, altText, width, height } = node;
      if (!src) return '';

      const imgWidth = width === 'auto' ? '800' : width;
      const imgHeight = height === 'auto' ? '600' : height;

      return `<figure class="my-6">
        <img
          src="${escapeHtml(src)}"
          alt="${escapeHtml(altText || '')}"
          width="${imgWidth}"
          height="${imgHeight}"
          loading="lazy"
          class="rounded-lg max-w-full h-auto mx-auto"
        />
      </figure>`;
    }

    case 'horizontalrule':
      return '<hr class="my-8 border-border" />';

    case 'table': {
      const tableContent = children?.map(nodeToHtml).join('') || '';
      return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-border">${tableContent}</table></div>`;
    }

    case 'tablerow': {
      const rowContent = children?.map(nodeToHtml).join('') || '';
      return `<tr>${rowContent}</tr>`;
    }

    case 'tablecell': {
      const tag = node.headerState ? 'th' : 'td';
      const cellClass = node.headerState
        ? 'border border-border px-4 py-2 bg-muted font-semibold'
        : 'border border-border px-4 py-2';
      const cellContent = children?.map(nodeToHtml).join('') || '';
      return `<${tag} class="${cellClass}">${cellContent}</${tag}>`;
    }

    case 'linebreak':
      return '<br />';

    default:
      // 알 수 없는 노드는 children만 렌더링
      if (children) {
        return children.map(nodeToHtml).join('');
      }
      return '';
  }
}

/**
 * Lexical JSON 문자열을 HTML로 변환
 * @param {string} content - Lexical JSON 문자열
 * @returns {string} HTML 문자열
 */
export function lexicalToHtml(content) {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);

    // Lexical 에디터 상태인지 확인
    if (!parsed.root) {
      // JSON이지만 Lexical 형식이 아닌 경우
      return `<p>${escapeHtml(content)}</p>`;
    }

    return nodeToHtml(parsed.root);
  } catch {
    // JSON 파싱 실패 시 일반 텍스트로 처리
    // 줄바꿈을 <br>로 변환
    return content
      .split('\n\n')
      .map(para => `<p class="mb-4">${escapeHtml(para).replace(/\n/g, '<br />')}</p>`)
      .join('');
  }
}

/**
 * Lexical JSON에서 순수 텍스트만 추출 (SEO용)
 * @param {string} content - Lexical JSON 문자열
 * @returns {string} 순수 텍스트
 */
export function lexicalToText(content) {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);

    if (!parsed.root) {
      return content;
    }

    const extractText = (node) => {
      if (!node) return '';

      if (node.text) return node.text;

      if (node.children) {
        return node.children.map(extractText).join(' ');
      }

      return '';
    };

    return extractText(parsed.root).replace(/\s+/g, ' ').trim();
  } catch {
    return content;
  }
}

export default lexicalToHtml;
