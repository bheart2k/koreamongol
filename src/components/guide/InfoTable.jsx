import { cn } from '@/lib/utils';

export function InfoTable({ headers = [], rows = [], className }) {
  if (headers.length === 0 || rows.length === 0) return null;

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy dark:bg-navy-light text-white">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold font-heading whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(
                'border-t border-border transition-colors hover:bg-sky/30 dark:hover:bg-navy-light/20',
                rowIdx % 2 === 0 ? 'bg-card' : 'bg-sky/10 dark:bg-navy/20'
              )}
            >
              {row.map((cell, cellIdx) => {
                const isObj = typeof cell === 'object' && cell !== null;
                const text = isObj ? cell.text : cell;
                const highlight = isObj ? cell.highlight : false;
                return (
                  <td
                    key={cellIdx}
                    className={cn(
                      'px-4 py-3',
                      highlight && 'font-semibold text-terracotta'
                    )}
                  >
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
