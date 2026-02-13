/**
 * Lexical 에디터 테마 설정
 * KoreaMongol 테마 변수와 호환
 */

const editorTheme = {
  // 기본 텍스트
  paragraph: 'mb-2 last:mb-0',

  // 텍스트 포맷
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
  },

  // 링크
  link: 'text-primary underline cursor-pointer hover:text-primary/80',

  // 리스트
  list: {
    ul: 'list-disc pl-6 mb-2',
    ol: 'list-decimal pl-6 mb-2',
    listitem: 'mb-1',
    nested: {
      listitem: 'list-none',
    },
  },

  // 인용문
  quote: 'border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2',

  // 코드 블록
  code: 'bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto my-2 block',
  codeHighlight: {
    atrule: 'text-primary',
    attr: 'text-primary',
    boolean: 'text-orange-500',
    builtin: 'text-primary',
    cdata: 'text-muted-foreground',
    char: 'text-green-500',
    class: 'text-primary',
    'class-name': 'text-primary',
    comment: 'text-muted-foreground italic',
    constant: 'text-orange-500',
    deleted: 'text-destructive',
    doctype: 'text-muted-foreground',
    entity: 'text-orange-500',
    function: 'text-primary',
    important: 'text-orange-500',
    inserted: 'text-green-500',
    keyword: 'text-purple-500',
    namespace: 'text-primary',
    number: 'text-orange-500',
    operator: 'text-muted-foreground',
    prolog: 'text-muted-foreground',
    property: 'text-primary',
    punctuation: 'text-muted-foreground',
    regex: 'text-green-500',
    selector: 'text-green-500',
    string: 'text-green-500',
    symbol: 'text-orange-500',
    tag: 'text-primary',
    url: 'text-primary underline',
    variable: 'text-orange-500',
  },

  // 헤딩
  heading: {
    h1: 'text-2xl font-bold mb-4 mt-6',
    h2: 'text-xl font-bold mb-3 mt-5',
    h3: 'text-lg font-semibold mb-2 mt-4',
  },

  // 테이블
  table: 'border-collapse w-full my-4',
  tableCell: 'border border-border px-3 py-2 min-w-[75px] align-top',
  tableCellHeader: 'border border-border px-3 py-2 bg-muted font-semibold text-left',
  tableRow: '',
  tableRowStriping: 'even:bg-muted/30',

  // 구분선 (Horizontal Rule)
  hr: 'border-t-2 border-border my-6',
};

export default editorTheme;
