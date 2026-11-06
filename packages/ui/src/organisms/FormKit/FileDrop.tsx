import type { ReactNode } from 'react';

import { DroppableZone } from '../../atoms/Droppable/Droppable';
import { fmtBytes, type AcceptContract } from '../../atoms/Droppable/useDroppable';
import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';
// Concrete files, not the Droppable barrel, to keep static-build chunks
// acyclic (the React #130 lesson from Stage 4).

import {
  fileChip,
  fileChipIcon,
  fileChipName,
  fileChipRemove,
  fileChipSize,
  fileChipText,
} from './FormKit.variants';

/** The slice of File the control needs — parents may store just this. */
export interface FileValue {
  name: string;
  size: number;
}

export interface FileDropProps {
  value: FileValue | null;
  onChange: (file: File | null) => void;
  accept?: AcceptContract;
  label?: ReactNode;
  hint?: ReactNode;
  /** Icon for both the empty zone and the landed chip (default file glyph). */
  icon?: ReactNode;
  className?: string;
}

/**
 * A control whose input is a Droppable: a standing compact drop-zone while
 * empty, a removable file chip once a file lands. Same controlled contract
 * as every other control — value + onChange.
 */
export const FileDrop: { (props: FileDropProps): import('react').JSX.Element; displayName: string } = ({
  value,
  onChange,
  accept,
  label = 'Drop a file',
  hint,
  icon,
  className,
}: FileDropProps) => {
  if (value != null) {
    return (
      <div className={cn(fileChip(), className)}>
        <span className={fileChipIcon()}>
          {icon ?? <StrokeIcon name="fileText" size={17} />}
        </span>
        <span className={fileChipText()}>
          <span className={fileChipName()}>
            {value.name}
          </span>
          <span className={fileChipSize()}>
            {fmtBytes(value.size)}
          </span>
        </span>
        <button
          type="button"
          aria-label="Remove file"
          onClick={() => onChange(null)}
          className={cn(
            touchable({ inline: true, rounded: 'sm', noBrightness: false }),
            fileChipRemove(),
          )}
        >
          <StrokeIcon name="trash" size={15} />
        </button>
      </div>
    );
  }
  return (
    <DroppableZone
      compact
      icon={icon ?? <StrokeIcon name="fileText" size={18} />}
      label={label}
      hint={hint}
      accept={accept}
      onDrop={(files) => onChange(files[0] ?? null)}
      className={className}
    />
  );
};

FileDrop.displayName = 'FileDrop';
