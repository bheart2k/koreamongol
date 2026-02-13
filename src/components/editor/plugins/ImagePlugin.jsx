'use client';

import { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $insertNodes,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { $createImageNode, ImageNode } from '../nodes/ImageNode';

// 이미지 삽입 커맨드
export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

// 설정
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_POST = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * 이미지 플러그인
 * - 툴바 버튼 클릭으로 이미지 삽입
 * - 드래그 앤 드롭 지원
 * - 클립보드 붙여넣기 지원
 */
export default function ImagePlugin({ onUpload, onError, maxImages = MAX_IMAGES_PER_POST }) {
  const [editor] = useLexicalComposerContext();

  // 현재 이미지 개수 확인
  const getImageCount = useCallback(() => {
    let count = 0;
    editor.getEditorState().read(() => {
      const nodes = editor._editorState._nodeMap;
      nodes.forEach((node) => {
        if (node instanceof ImageNode) {
          count++;
        }
      });
    });
    return count;
  }, [editor]);

  // 이미지 업로드 및 삽입
  const uploadAndInsertImage = useCallback(
    async (file) => {
      // 파일 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        onError?.('지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF, WebP만 가능)');
        return;
      }

      // 파일 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        onError?.('이미지 크기가 5MB를 초과합니다.');
        return;
      }

      // 이미지 개수 검증
      if (getImageCount() >= maxImages) {
        onError?.(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
        return;
      }

      try {
        // 업로드 콜백 호출 (부모에서 실제 업로드 처리)
        const imageUrl = await onUpload?.(file);

        if (imageUrl) {
          // 에디터에 이미지 삽입
          editor.update(() => {
            const imageNode = $createImageNode({ src: imageUrl, altText: file.name });
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              selection.insertNodes([imageNode, $createParagraphNode()]);
            } else {
              $insertNodes([imageNode, $createParagraphNode()]);
            }
          });
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        onError?.('이미지 업로드에 실패했습니다.');
      }
    },
    [editor, onUpload, onError, getImageCount, maxImages]
  );

  // INSERT_IMAGE_COMMAND 핸들러 등록
  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        if (payload.file) {
          uploadAndInsertImage(payload.file);
        } else if (payload.src) {
          // URL 직접 삽입 (이미 업로드된 이미지)
          editor.update(() => {
            const imageNode = $createImageNode({
              src: payload.src,
              altText: payload.altText || '',
            });
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              selection.insertNodes([imageNode, $createParagraphNode()]);
            } else {
              $insertNodes([imageNode, $createParagraphNode()]);
            }
          });
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, uploadAndInsertImage]);

  // 드래그 앤 드롭 핸들러
  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const imageFiles = Array.from(files).filter((file) =>
          ALLOWED_TYPES.includes(file.type)
        );

        imageFiles.forEach((file) => {
          uploadAndInsertImage(file);
        });
      }
    };

    rootElement.addEventListener('dragover', handleDragOver);
    rootElement.addEventListener('drop', handleDrop);

    return () => {
      rootElement.removeEventListener('dragover', handleDragOver);
      rootElement.removeEventListener('drop', handleDrop);
    };
  }, [editor, uploadAndInsertImage]);

  // 클립보드 붙여넣기 핸들러
  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (ALLOWED_TYPES.includes(item.type)) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            uploadAndInsertImage(file);
          }
          break;
        }
      }
    };

    rootElement.addEventListener('paste', handlePaste);

    return () => {
      rootElement.removeEventListener('paste', handlePaste);
    };
  }, [editor, uploadAndInsertImage]);

  return null;
}
