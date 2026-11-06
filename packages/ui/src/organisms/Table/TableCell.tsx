import { useRef, type CSSProperties, type ReactElement, type ReactNode } from 'react';

import { cn } from '../../lib';

import {
  tableCellClamp,
  tableCellJustify,
  tableCellText,
  tableCellTruncate,
  tableCellWrap,
} from './Table.variants';

export type CellOverflow = 'wrap' | 'truncate' | 'clamp';
export type CellAlign = 'start' | 'center' | 'end';

export interface TableTip {
  text: string;
  x: number;
  y: number;
}

export interface TableCellProps {
  mode?: CellOverflow;
  lines?: number;
  align?: CellAlign;
  children?: ReactNode;
  onTip?: (tip: TableTip) => void;
  offTip?: () => void;
}

/**
 * The overflow-aware cell — the td-ellipsis fix from the original table demo. text-overflow
 * doesn't clip on a <td>: the table must be table-fixed, the <td> capped
 * with max-w-0, and the clip must live on a block CHILD. So content is
 * wrapped in a div, and a tooltip is surfaced only when the text is
 * genuinely clipped (scrollWidth / scrollHeight probe on hover).
 */
export const TableCell: {
  (props: TableCellProps): ReactElement | null;
  displayName?: string;
} = ({
  mode = 'wrap',
  lines = 2,
  align = 'start',
  children,
  onTip,
  offTip,
}: TableCellProps): ReactElement | null => {
  const ref = useRef<HTMLDivElement>(null);
  const enter = () => {
    if (mode === 'wrap' || !onTip) return;
    const el = ref.current;
    if (!el) return;
    const clipped =
      mode === 'truncate'
        ? el.scrollWidth > el.clientWidth + 1
        : el.scrollHeight > el.clientHeight + 1;
    if (clipped) {
      const r = el.getBoundingClientRect();
      onTip({
        text: el.textContent ?? '',
        x: r.left + r.width / 2,
        y: r.top,
      });
    }
  };

  if (mode === 'truncate')
    return (
      <div
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={offTip}
        className={cn(tableCellTruncate(), tableCellText({ align }))}
      >
        {children}
      </div>
    );

  if (mode === 'clamp') {
    // -webkit-line-clamp takes the per-column line count — genuinely dynamic.
    const style: CSSProperties = { WebkitLineClamp: lines };
    return (
      <div
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={offTip}
        className={cn(tableCellClamp(), tableCellText({ align }))}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        tableCellWrap(),
        tableCellJustify({ align }),
        tableCellText({ align }),
      )}
    >
      {children}
    </div>
  );
};

TableCell.displayName = 'TableCell';
