'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import editorTheme from './themes/editorTheme';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { ImageNode } from './nodes/ImageNode';

/**
 * Lexical 읽기 전용 뷰어
 * @param {string} content - 저장된 에디터 상태 (JSON 문자열)
 * @param {string} className - 추가 클래스
 */
export default function LexicalViewer({ content, className = '' }) {
  // 빈 콘텐츠 처리
  if (!content) {
    return <div className="text-muted-foreground">내용이 없습니다.</div>;
  }

  // JSON 파싱 시도 (일반 텍스트인 경우 그대로 표시)
  let editorState = null;
  try {
    const parsed = JSON.parse(content);
    // Lexical 에디터 상태인지 확인
    if (parsed.root) {
      editorState = content;
    }
  } catch {
    // JSON이 아닌 경우 일반 텍스트로 표시
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    );
  }

  const initialConfig = {
    namespace: 'KoreaMongolViewer',
    theme: editorTheme,
    editable: false,
    onError: (error) => {
      console.error('Lexical 뷰어 에러:', error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
      ImageNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      HorizontalRuleNode,
    ],
    editorState: editorState,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={`outline-none prose prose-sm max-w-none ${className}`}
          />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <CodeHighlightPlugin />
    </LexicalComposer>
  );
}
