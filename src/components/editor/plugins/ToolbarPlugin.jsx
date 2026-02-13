'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createQuoteNode, $isHeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType, $patchStyleText } from '@lexical/selection';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_TABLE_COMMAND,
  $isTableNode,
  $isTableCellNode,
  $isTableRowNode,
  $insertTableColumn__EXPERIMENTAL,
  $insertTableRow__EXPERIMENTAL,
  $deleteTableColumn__EXPERIMENTAL,
  $deleteTableRow__EXPERIMENTAL,
} from '@lexical/table';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Undo2,
  Redo2,
  Quote,
  Code,
  Unlink,
  ImagePlus,
  Minus,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Palette,
  ChevronDown,
  Trash2,
  RowsIcon,
  ColumnsIcon,
} from 'lucide-react';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';

/**
 * 포탈 드롭다운 컴포넌트
 */
function PortalDropdown({ show, anchorRef, onClose, children }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (show && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [show, anchorRef]);

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose, anchorRef]);

  if (!show) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed bg-background border border-border rounded-lg shadow-xl py-1"
      style={{
        top: position.top,
        left: position.left,
        zIndex: 9999,
        minWidth: 120,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

/**
 * 에디터 툴바 플러그인
 */
export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const imageInputRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isInTable, setIsInTable] = useState(false);

  // 드롭다운 상태
  const [activeDropdown, setActiveDropdown] = useState(null);

  // 드롭다운 앵커 refs
  const headingBtnRef = useRef(null);
  const highlightBtnRef = useRef(null);
  const fontColorBtnRef = useRef(null);
  const tableBtnRef = useRef(null);

  // 색상 프리셋
  const colorPresets = [
    { name: '검정', value: '#000000' },
    { name: '빨강', value: '#ef4444' },
    { name: '주황', value: '#f97316' },
    { name: '노랑', value: '#eab308' },
    { name: '초록', value: '#22c55e' },
    { name: '파랑', value: '#3b82f6' },
    { name: '보라', value: '#8b5cf6' },
    { name: '분홍', value: '#ec4899' },
  ];

  const bgColorPresets = [
    { name: '노랑', value: '#fef08a' },
    { name: '초록', value: '#bbf7d0' },
    { name: '파랑', value: '#bfdbfe' },
    { name: '분홍', value: '#fbcfe8' },
    { name: '보라', value: '#ddd6fe' },
    { name: '주황', value: '#fed7aa' },
  ];

  // 선택 상태 업데이트
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      let checkNode = node;
      let inTable = false;
      while (checkNode) {
        if ($isTableCellNode(checkNode) || $isTableRowNode(checkNode) || $isTableNode(checkNode)) {
          inTable = true;
          break;
        }
        checkNode = checkNode.getParent();
      }
      setIsInTable(inTable);

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementDOM = editor.getElementByKey(element.getKey());

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type === 'bullet' ? 'ul' : 'ol');
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : $isCodeNode(element)
            ? 'code'
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
        setCanUndo(payload);
        return false;
      }, COMMAND_PRIORITY_CRITICAL),
      editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
        setCanRedo(payload);
        return false;
      }, COMMAND_PRIORITY_CRITICAL)
    );
  }, [editor, updateToolbar]);

  const closeDropdown = useCallback(() => setActiveDropdown(null), []);

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt('URL을 입력하세요:');
      if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatList = useCallback((type) => {
    if (blockType === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(
        type === 'ul' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
        undefined
      );
    }
  }, [editor, blockType]);

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType !== 'quote' ? $createQuoteNode() : $createParagraphNode()
        );
      }
    });
  }, [editor, blockType]);

  const formatCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType !== 'code' ? $createCodeNode() : $createParagraphNode()
        );
      }
    });
  }, [editor, blockType]);

  const formatHeading = useCallback((tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType === tag ? $createParagraphNode() : $createHeadingNode(tag)
        );
      }
    });
    closeDropdown();
  }, [editor, blockType, closeDropdown]);

  const applyStyle = useCallback((styleType, color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (styleType === 'background') {
          $patchStyleText(selection, { 'background-color': color });
        } else {
          $patchStyleText(selection, { color: color });
        }
      }
    });
    closeDropdown();
  }, [editor, closeDropdown]);

  const insertTable = useCallback((rows, cols) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: String(rows), columns: String(cols) });
    closeDropdown();
  }, [editor, closeDropdown]);

  const modifyTable = useCallback((action) => {
    editor.update(() => {
      switch (action) {
        case 'insertRowAfter': $insertTableRow__EXPERIMENTAL(false); break;
        case 'insertRowBefore': $insertTableRow__EXPERIMENTAL(true); break;
        case 'insertColumnAfter': $insertTableColumn__EXPERIMENTAL(false); break;
        case 'insertColumnBefore': $insertTableColumn__EXPERIMENTAL(true); break;
        case 'deleteRow': $deleteTableRow__EXPERIMENTAL(); break;
        case 'deleteColumn': $deleteTableColumn__EXPERIMENTAL(); break;
      }
    });
    closeDropdown();
  }, [closeDropdown]);

  const insertHorizontalRule = useCallback(() => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }, [editor]);

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors shrink-0 ${
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-border mx-1 shrink-0" />;

  return (
    <div className="border-b border-border bg-muted/30 rounded-t-lg">
      <div className="flex items-center gap-0.5 p-2 overflow-x-auto">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} disabled={!canUndo} title="실행 취소">
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} disabled={!canRedo} title="다시 실행">
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* 헤딩 */}
        <button
          ref={headingBtnRef}
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === 'heading' ? null : 'heading')}
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-muted text-foreground text-sm shrink-0"
          title="제목"
        >
          <span className="w-6 text-center">
            {blockType === 'h1' ? 'H1' : blockType === 'h2' ? 'H2' : blockType === 'h3' ? 'H3' : '¶'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <PortalDropdown show={activeDropdown === 'heading'} anchorRef={headingBtnRef} onClose={closeDropdown}>
          <button onClick={() => formatHeading('h1')} className={`w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 ${blockType === 'h1' ? 'bg-muted' : ''}`}>
            <Heading1 className="w-4 h-4" /> <span>제목 1</span>
          </button>
          <button onClick={() => formatHeading('h2')} className={`w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 ${blockType === 'h2' ? 'bg-muted' : ''}`}>
            <Heading2 className="w-4 h-4" /> <span>제목 2</span>
          </button>
          <button onClick={() => formatHeading('h3')} className={`w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 ${blockType === 'h3' ? 'bg-muted' : ''}`}>
            <Heading3 className="w-4 h-4" /> <span>제목 3</span>
          </button>
        </PortalDropdown>

        <Divider />

        {/* 텍스트 포맷 */}
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} isActive={isBold} title="굵게">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} isActive={isItalic} title="기울임">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} isActive={isUnderline} title="밑줄">
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} isActive={isStrikethrough} title="취소선">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* 하이라이트 */}
        <button
          ref={highlightBtnRef}
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === 'highlight' ? null : 'highlight')}
          className="p-2 rounded hover:bg-muted text-foreground shrink-0"
          title="형광펜"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <PortalDropdown show={activeDropdown === 'highlight'} anchorRef={highlightBtnRef} onClose={closeDropdown}>
          <div className="p-2 grid grid-cols-3 gap-1">
            {bgColorPresets.map((color) => (
              <button
                key={color.value}
                onClick={() => applyStyle('background', color.value)}
                className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </PortalDropdown>

        {/* 폰트 색상 */}
        <button
          ref={fontColorBtnRef}
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === 'fontColor' ? null : 'fontColor')}
          className="p-2 rounded hover:bg-muted text-foreground shrink-0"
          title="글자 색"
        >
          <Palette className="w-4 h-4" />
        </button>

        <PortalDropdown show={activeDropdown === 'fontColor'} anchorRef={fontColorBtnRef} onClose={closeDropdown}>
          <div className="p-2 grid grid-cols-4 gap-1">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                onClick={() => applyStyle('color', color.value)}
                className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </PortalDropdown>

        <Divider />

        {/* 리스트 */}
        <ToolbarButton onClick={() => formatList('ul')} isActive={blockType === 'ul'} title="글머리 기호">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatList('ol')} isActive={blockType === 'ol'} title="번호 매기기">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* 인용문 & 코드 */}
        <ToolbarButton onClick={formatQuote} isActive={blockType === 'quote'} title="인용문">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={formatCode} isActive={blockType === 'code'} title="코드 블록">
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* 구분선 */}
        <ToolbarButton onClick={insertHorizontalRule} title="구분선">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        {/* 테이블 */}
        <button
          ref={tableBtnRef}
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === 'table' ? null : 'table')}
          className="p-2 rounded hover:bg-muted text-foreground shrink-0"
          title="표"
        >
          <Table className="w-4 h-4" />
        </button>

        <PortalDropdown show={activeDropdown === 'table'} anchorRef={tableBtnRef} onClose={closeDropdown}>
          {!isInTable ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground mb-2">표 삽입</p>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 },
                  { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 },
                  { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 }, { r: 4, c: 6 },
                  { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 }, { r: 5, c: 6 },
                  { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, { r: 6, c: 6 },
                ].map(({ r, c }) => (
                  <button
                    key={`${r}x${c}`}
                    onClick={() => insertTable(r, c)}
                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
                  >
                    {r}×{c}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">더 큰 표가 필요하면 삽입 후 행/열을 추가하세요</p>
            </div>
          ) : (
            <div className="py-1">
              <p className="text-xs text-muted-foreground mb-1 px-3">행/열 편집</p>
              <button onClick={() => modifyTable('insertRowBefore')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2">
                <RowsIcon className="w-4 h-4" /> 위에 행 추가
              </button>
              <button onClick={() => modifyTable('insertRowAfter')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2">
                <RowsIcon className="w-4 h-4" /> 아래에 행 추가
              </button>
              <button onClick={() => modifyTable('insertColumnBefore')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2">
                <ColumnsIcon className="w-4 h-4" /> 왼쪽에 열 추가
              </button>
              <button onClick={() => modifyTable('insertColumnAfter')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2">
                <ColumnsIcon className="w-4 h-4" /> 오른쪽에 열 추가
              </button>
              <div className="border-t border-border my-1" />
              <button onClick={() => modifyTable('deleteRow')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> 행 삭제
              </button>
              <button onClick={() => modifyTable('deleteColumn')} className="w-full px-3 py-1.5 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> 열 삭제
              </button>
            </div>
          )}
        </PortalDropdown>

        <Divider />

        {/* 링크 */}
        <ToolbarButton onClick={insertLink} isActive={isLink} title={isLink ? '링크 제거' : '링크 삽입'}>
          {isLink ? <Unlink className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        </ToolbarButton>

        <Divider />

        {/* 이미지 */}
        <ToolbarButton onClick={() => imageInputRef.current?.click()} title="이미지 삽입">
          <ImagePlus className="w-4 h-4" />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, { file });
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}
