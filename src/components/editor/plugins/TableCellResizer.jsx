'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import {
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $isTableCellNode,
  $isTableRowNode,
  getDOMCellFromTarget,
} from '@lexical/table';
import { calculateZoomLevel } from '@lexical/utils';
import { $getNearestNodeFromDOMNode } from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MIN_ROW_HEIGHT = 33;
const MIN_COLUMN_WIDTH = 50;

/**
 * 테이블 셀 리사이저 플러그인 (Lexical Playground 기반)
 */
export default function TableCellResizerPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return isEditable
    ? createPortal(<TableCellResizer editor={editor} />, document.body)
    : null;
}

function TableCellResizer({ editor }) {
  const [activeCell, setActiveCell] = useState(null);
  const [draggingDirection, setDraggingDirection] = useState(null);
  const [pointerPosition, setPointerPosition] = useState(null);

  const resizerRef = useRef(null);
  const tableRectRef = useRef(null);
  const startPositionRef = useRef(null);
  const startSizeRef = useRef(null);

  // 마우스 위치에서 셀 찾기
  useEffect(() => {
    const onPointerMove = (event) => {
      if (draggingDirection) {
        setPointerPosition({ x: event.clientX, y: event.clientY });
        return;
      }

      const target = event.target;
      if (!target || !(target instanceof HTMLElement)) {
        setActiveCell(null);
        return;
      }

      const cell = getDOMCellFromTarget(target);
      if (!cell) {
        setActiveCell(null);
        return;
      }

      // 테이블 요소 확인 (DOM 기반으로만)
      const tableElement = cell.elem.closest('table');
      if (!tableElement) {
        setActiveCell(null);
        return;
      }

      tableRectRef.current = tableElement.getBoundingClientRect();
      setActiveCell(cell);
    };

    document.addEventListener('pointermove', onPointerMove);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
    };
  }, [editor, draggingDirection]);

  // 드래그 중 리사이징
  useEffect(() => {
    if (!draggingDirection || !pointerPosition || !activeCell) return;

    const zoom = calculateZoomLevel(activeCell.elem);

    if (draggingDirection === 'right') {
      const newWidth =
        startSizeRef.current.width +
        (pointerPosition.x - startPositionRef.current.x) / zoom;

      updateColumnWidth(Math.max(newWidth, MIN_COLUMN_WIDTH));
    } else if (draggingDirection === 'bottom') {
      const newHeight =
        startSizeRef.current.height +
        (pointerPosition.y - startPositionRef.current.y) / zoom;

      updateRowHeight(Math.max(newHeight, MIN_ROW_HEIGHT));
    }
  }, [pointerPosition, draggingDirection, activeCell]);

  // 열 너비 업데이트
  const updateColumnWidth = useCallback(
    (newWidth) => {
      if (!activeCell) return;

      editor.update(
        () => {
          const node = $getNearestNodeFromDOMNode(activeCell.elem);
          if (!$isTableCellNode(node)) return;

          // 단순하게 현재 셀만 너비 업데이트
          node.setWidth(newWidth);
        },
        { tag: 'table-resize' }
      );
    },
    [editor, activeCell]
  );

  // 행 높이 업데이트
  const updateRowHeight = useCallback(
    (newHeight) => {
      if (!activeCell) return;

      editor.update(
        () => {
          const node = $getNearestNodeFromDOMNode(activeCell.elem);
          if (!$isTableCellNode(node)) return;

          const rowIndex = $getTableRowIndexFromTableCellNode(node);
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(node);
          const rows = tableNode.getChildren();

          if (rowIndex < rows.length) {
            const row = rows[rowIndex];
            if ($isTableRowNode(row)) {
              row.setHeight(newHeight);
            }
          }
        },
        { tag: 'table-resize' }
      );
    },
    [editor, activeCell]
  );

  // 드래그 시작
  const onPointerDown = useCallback(
    (direction) => (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!activeCell) return;

      const rect = activeCell.elem.getBoundingClientRect();

      setDraggingDirection(direction);
      startPositionRef.current = { x: event.clientX, y: event.clientY };
      startSizeRef.current = { width: rect.width, height: rect.height };
    },
    [activeCell]
  );

  // 드래그 종료
  useEffect(() => {
    if (!draggingDirection) return;

    const onPointerUp = () => {
      setDraggingDirection(null);
      startPositionRef.current = null;
      startSizeRef.current = null;
    };

    document.addEventListener('pointerup', onPointerUp);
    return () => {
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggingDirection]);

  // 리사이저 핸들 스타일 계산
  const resizerStyles = useMemo(() => {
    if (!activeCell) {
      return { right: null, bottom: null };
    }

    const { top, left, width, height, right, bottom } =
      activeCell.elem.getBoundingClientRect();
    const zoom = calculateZoomLevel(activeCell.elem);

    const rightHandle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${right - 4 * zoom}px`,
      width: `${8 * zoom}px`,
      height: `${height}px`,
      cursor: 'col-resize',
      zIndex: 10000,
      backgroundColor:
        draggingDirection === 'right' ? 'var(--accent)' : 'transparent',
    };

    const bottomHandle = {
      position: 'fixed',
      top: `${bottom - 4 * zoom}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${8 * zoom}px`,
      cursor: 'row-resize',
      zIndex: 10000,
      backgroundColor:
        draggingDirection === 'bottom' ? 'var(--accent)' : 'transparent',
    };

    return { right: rightHandle, bottom: bottomHandle };
  }, [activeCell, draggingDirection]);

  if (!activeCell) return null;

  return (
    <>
      {/* 오른쪽 핸들 (열 너비 조절) */}
      <div
        ref={resizerRef}
        style={resizerStyles.right}
        onPointerDown={onPointerDown('right')}
        className="hover:bg-accent/50 transition-colors"
      />
      {/* 아래쪽 핸들 (행 높이 조절) */}
      <div
        style={resizerStyles.bottom}
        onPointerDown={onPointerDown('bottom')}
        className="hover:bg-accent/50 transition-colors"
      />
    </>
  );
}
