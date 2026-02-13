'use client';

import { useCallback, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TRANSFORMERS } from '@lexical/markdown';
import { Loader2 } from 'lucide-react';

import editorTheme from './themes/editorTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ImagePlugin from './plugins/ImagePlugin';
import TableCellResizer from './plugins/TableCellResizer';
import MarkdownPastePlugin from './plugins/MarkdownPastePlugin';
import { ImageNode } from './nodes/ImageNode';

/**
 * Lexical 리치 텍스트 에디터
 * @param {string} value - 에디터 초기값 (JSON 문자열)
 * @param {Function} onChange - 변경 콜백 (JSON 문자열 반환)
 * @param {string} placeholder - 플레이스홀더 텍스트
 * @param {number} minHeight - 최소 높이 (px)
 * @param {number} maxHeight - 최대 높이 (px) - 스크롤 활성화
 * @param {Function} onError - 에러 콜백
 * @param {number} maxImages - 최대 이미지 개수
 * @param {string} boardType - 게시판 타입 (blog, free, notice)
 * @param {string} sessionId - 임시 업로드용 세션 ID
 */
export default function LexicalEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요',
  minHeight = 500,
  maxHeight = 700,
  onError,
  maxImages = 10,
  boardType,
  sessionId,
}) {
  const [isUploading, setIsUploading] = useState(false);

  // 초기 설정
  const initialConfig = {
    namespace: 'KoreaMongolEditor',
    theme: editorTheme,
    onError: (error) => {
      console.error('Lexical 에러:', error);
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
    editorState: value || undefined,
  };

  // 변경 핸들러
  const handleChange = useCallback(
    (editorState) => {
      const json = JSON.stringify(editorState.toJSON());
      onChange?.(json);
    },
    [onChange]
  );

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'posts');
      formData.append('boardType', boardType || '');
      formData.append('sessionId', sessionId || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        return result.data.url;
      } else {
        throw new Error(result.error || '업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      onError?.(error.message || '이미지 업로드에 실패했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [onError, boardType, sessionId]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-border rounded-lg bg-background relative">
        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>이미지 업로드 중...</span>
            </div>
          </div>
        )}

        {/* 툴바 */}
        <ToolbarPlugin />

        {/* 에디터 영역 - 높이 제한 및 스크롤 */}
        <div
          className="relative overflow-y-auto overflow-x-hidden editor-scroll rounded-b-lg"
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none px-4 py-3 prose prose-sm max-w-none"
                style={{ minHeight: `${minHeight - 24}px` }}
              />
            }
            placeholder={
              <div className="absolute top-3 left-4 text-muted-foreground pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* 플러그인 */}
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        <TableCellResizer />
        <HorizontalRulePlugin />
        <MarkdownPastePlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <CodeHighlightPlugin />
        <ImagePlugin
          onUpload={handleImageUpload}
          onError={onError}
          maxImages={maxImages}
        />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
