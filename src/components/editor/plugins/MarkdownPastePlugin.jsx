'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $insertNodes,
  PASTE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  $createLineBreakNode,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createListNode,
  $createListItemNode,
} from '@lexical/list';
import {
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  TableCellHeaderStates,
} from '@lexical/table';
import { $createLinkNode } from '@lexical/link';
import { $createCodeNode } from '@lexical/code';

// 인라인 스타일 파싱 (볼드, 이탤릭, 링크)
function createNodesFromText(text) {
  const nodes = [];
  let remainingText = text;

  // 정규식 개선: Lazy matching 사용
  while (remainingText) {
    // 링크: [text](url)
    const linkMatch = remainingText.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // 볼드: **text** (Lazy matching으로 변경하여 * 문자가 포함되지 않은 최단 구간 매칭)
    const boldMatch = remainingText.match(/\*\*(.*?)\*\*/);
    // 이탤릭: *text* (Negative lookbehind/lookahead로 **와 구분)
    const italicMatch = remainingText.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    // 인라인 코드: `text`
    const codeMatch = remainingText.match(/`([^`]+)`/);

    let bestMatch = null;
    let type = '';

    // 가장 먼저 나오는 매치 찾기
    const matches = [
      { match: linkMatch, type: 'link' },
      { match: boldMatch, type: 'bold' },
      { match: italicMatch, type: 'italic' },
      { match: codeMatch, type: 'code' },
    ];

    for (const item of matches) {
      if (item.match) {
        if (!bestMatch || item.match.index < bestMatch.index) {
          bestMatch = item.match;
          type = item.type;
        }
      }
    }

    if (!bestMatch) {
      nodes.push($createTextNode(remainingText));
      break;
    }

    // 매치 앞부분 일반 텍스트 추가
    if (bestMatch.index > 0) {
      nodes.push($createTextNode(remainingText.slice(0, bestMatch.index)));
    }

    // 매치된 부분 처리
    if (type === 'link') {
      const linkNode = $createLinkNode(bestMatch[2]);
      linkNode.append($createTextNode(bestMatch[1]));
      nodes.push(linkNode);
    } else if (type === 'bold') {
      const textNode = $createTextNode(bestMatch[1]);
      textNode.setFormat('bold');
      nodes.push(textNode);
    } else if (type === 'italic') {
      const textNode = $createTextNode(bestMatch[1]);
      textNode.setFormat('italic');
      nodes.push(textNode);
    } else if (type === 'code') {
      const textNode = $createTextNode(bestMatch[1]);
      textNode.setFormat('code');
      nodes.push(textNode);
    }

    remainingText = remainingText.slice(bestMatch.index + bestMatch[0].length);
  }

  return nodes;
}

// 마크다운 테이블 파싱 함수
function parseMarkdownTable(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length < 3) return null;

  const isTableLine = (line) => line.includes('|');
  if (!lines.every(isTableLine)) return null;

  const isSeparator = (line) => {
    const cleaned = line.replace(/[\s|:-]/g, '');
    return cleaned === '' && line.includes('-');
  };

  const separatorIndex = lines.findIndex((line, i) => i > 0 && isSeparator(line));
  if (separatorIndex === -1) return null;

  const parseRow = (rowStr) => {
    let str = rowStr.trim();
    if (str.startsWith('|')) str = str.slice(1);
    if (str.endsWith('|')) str = str.slice(0, -1);
    return str.split('|').map((cell) => cell.trim());
  };

  const headerRows = lines.slice(0, separatorIndex).map(parseRow);
  const bodyRows = lines.slice(separatorIndex + 1).map(parseRow);

  if (bodyRows.length === 0) return null;

  return { headerRows, bodyRows };
}

function createTableFromParsed(parsed) {
  const table = $createTableNode();

  parsed.headerRows.forEach((cells) => {
    const rowNode = $createTableRowNode();
    cells.forEach((cellText) => {
      const cell = $createTableCellNode(TableCellHeaderStates.ROW);
      const paragraph = $createParagraphNode();
      const textNodes = createNodesFromText(cellText);
      textNodes.forEach(node => paragraph.append(node));
      cell.append(paragraph);
      rowNode.append(cell);
    });
    table.append(rowNode);
  });

  parsed.bodyRows.forEach((cells) => {
    const rowNode = $createTableRowNode();
    cells.forEach((cellText) => {
      const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
      const paragraph = $createParagraphNode();
      const textNodes = createNodesFromText(cellText);
      textNodes.forEach(node => paragraph.append(node));
      cell.append(paragraph);
      rowNode.append(cell);
    });
    table.append(rowNode);
  });

  return table;
}

export default function MarkdownPastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const clipboardData = event instanceof ClipboardEvent ? event.clipboardData : null;
        if (!clipboardData) return false;

        const plainText = clipboardData.getData('text/plain');
        const htmlData = clipboardData.getData('text/html');

        const isFromIDE = htmlData && (
          htmlData.includes('vscode-') ||
          htmlData.includes('monaco-') ||
          htmlData.includes('data-vscode')
        );

        const hasMarkdownSyntax = plainText && (
          /^#{1,6}\s/m.test(plainText) ||
          /\*\*(.*?)\*\*/m.test(plainText) ||
          /^>\s/m.test(plainText) ||
          /^[-*]\s/m.test(plainText) ||
          /^\d+\.\s/m.test(plainText) ||
          /`[^`]+`/m.test(plainText) ||
          / \[.+?\]\(.+?\)/m.test(plainText) ||
          /^\|.+\|$/m.test(plainText) ||
          /^\[IMAGE:.+?\]$/m.test(plainText)
        );

        if ((isFromIDE || hasMarkdownSyntax || !htmlData) && plainText) {
          event.preventDefault();

          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.removeText();
            }

            const lines = plainText.split('\n');
            const nodesToInsert = [];
            
            let currentList = null; 
            let listType = null;
            let currentQuote = null; // 연속된 인용구 처리용

            for (let i = 0; i < lines.length; i++) {
              let line = lines[i].trimEnd(); 
              const trimmedLine = line.trim();

              if (!trimmedLine) {
                // 빈 줄: 리스트/인용구 종료, 문단 추가
                currentList = null;
                listType = null;
                currentQuote = null;
                nodesToInsert.push($createParagraphNode());
                continue;
              }

              // 1. 구분선
              if (/^(?:---|___|\*\*\*)$/.test(trimmedLine)) {
                currentList = null;
                currentQuote = null;
                nodesToInsert.push($createHorizontalRuleNode());
                continue;
              }

              // 2. 헤딩
              const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
              if (headingMatch) {
                currentList = null;
                currentQuote = null;
                const level = headingMatch[1].length;
                const headingNode = $createHeadingNode(`h${level}`);
                const textNodes = createNodesFromText(headingMatch[2]);
                textNodes.forEach(n => headingNode.append(n));
                nodesToInsert.push(headingNode);
                continue;
              }

              // 2.5 코드 블록
              if (trimmedLine.startsWith('```')) {
                currentList = null;
                currentQuote = null;
                
                // 언어 추출 (예: ```javascript -> javascript)
                const language = trimmedLine.slice(3).trim();
                
                let codeContent = '';
                let j = i + 1;
                while (j < lines.length) {
                  const nextLine = lines[j]; // 들여쓰기 유지를 위해 trim하지 않음 (단, 끝 공백은 제거 가능)
                  if (nextLine.trim().startsWith('```')) {
                    j++; // 닫는 ``` 건너뛰기
                    break;
                  }
                  codeContent += nextLine + '\n';
                  j++;
                }
                
                // 마지막 줄바꿈 제거
                if (codeContent.endsWith('\n')) {
                  codeContent = codeContent.slice(0, -1);
                }

                const codeNode = $createCodeNode(language);
                codeNode.append($createTextNode(codeContent));
                nodesToInsert.push(codeNode);
                
                i = j - 1; // 인덱스 점프
                continue;
              }

              // 3. 인용구 (연속 처리)
              const quoteMatch = trimmedLine.match(/^>\s+(.+)$/);
              if (quoteMatch) {
                currentList = null;
                // 이미 인용구 블록 중이라면 거기에 추가
                if (currentQuote) {
                  // 줄바꿈을 위해 Soft break나 새 문단 추가
                  // QuoteNode 안에는 ParagraphNode가 들어갈 수 있음
                  // 여기서는 단순하게 줄바꿈 후 텍스트 추가 방식 대신, 
                  // 인용구 내의 문단으로 처리하는 것이 일반적임.
                  
                  // 하지만 Lexical QuoteNode는 ElementNode이므로 바로 TextNode를 가질 수도 있고 BlockNode를 가질 수도 있음.
                  // 깔끔하게 하기 위해 매 줄마다 ParagraphNode를 생성해서 넣음
                  const p = $createParagraphNode();
                  const textNodes = createNodesFromText(quoteMatch[1]);
                  textNodes.forEach(n => p.append(n));
                  currentQuote.append(p);
                } else {
                  // 새 인용구 시작
                  currentQuote = $createQuoteNode();
                  const p = $createParagraphNode();
                  const textNodes = createNodesFromText(quoteMatch[1]);
                  textNodes.forEach(n => p.append(n));
                  currentQuote.append(p);
                  nodesToInsert.push(currentQuote);
                }
                continue;
              } else {
                // 인용구가 아닌 줄이 나오면 인용구 종료
                currentQuote = null;
              }

              // 4. 리스트 (비순서)
              const ulMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
              if (ulMatch) {
                currentQuote = null;
                if (!currentList || listType !== 'bullet') {
                  currentList = $createListNode('bullet');
                  listType = 'bullet';
                  nodesToInsert.push(currentList);
                }
                const listItem = $createListItemNode();
                const textNodes = createNodesFromText(ulMatch[1]);
                textNodes.forEach(n => listItem.append(n));
                currentList.append(listItem);
                continue;
              }

              // 5. 리스트 (순서)
              const olMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
              if (olMatch) {
                currentQuote = null;
                if (!currentList || listType !== 'number') {
                  currentList = $createListNode('number');
                  listType = 'number';
                  nodesToInsert.push(currentList);
                }
                const listItem = $createListItemNode();
                const textNodes = createNodesFromText(olMatch[1]);
                textNodes.forEach(n => listItem.append(n));
                currentList.append(listItem);
                continue;
              }
              
              currentList = null;
              listType = null;

              // 6. 이미지 플레이스홀더
              const imageMatch = trimmedLine.match(/^\ \[IMAGE:\s*(.+?)\]$/);
              if (imageMatch) {
                const p = $createParagraphNode();
                const text = $createTextNode(`📸 [이미지: ${imageMatch[1].split('-')[0].trim()}]`);
                text.setFormat('bold');
                p.append(text);
                nodesToInsert.push(p);
                continue;
              }

              // 7. 테이블
              if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
                let tableBlock = trimmedLine;
                let j = i + 1;
                while (j < lines.length) {
                  const nextLine = lines[j].trim();
                  if (nextLine.startsWith('|') && nextLine.endsWith('|')) {
                    tableBlock += '\n' + nextLine;
                    j++;
                  } else {
                    break;
                  }
                }
                
                const tableData = parseMarkdownTable(tableBlock);
                if (tableData) {
                  const tableNode = createTableFromParsed(tableData);
                  nodesToInsert.push(tableNode);
                  i = j - 1; 
                  continue;
                }
              }

              // 8. 일반 텍스트
              const p = $createParagraphNode();
              const textNodes = createNodesFromText(trimmedLine); // 라인 전체를 파싱
              textNodes.forEach(n => p.append(n));
              nodesToInsert.push(p);
            }

            if (nodesToInsert.length > 0) {
              $insertNodes(nodesToInsert);
            }
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}
