import { type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';
import { touchable } from '../Touchable/Touchable.variants';

import {
  droppableInline,
  droppableInlineMedia,
  droppableRegionIcon,
  droppableRegionOverlay,
  droppableZone,
  droppableZoneIcon,
  type DroppableInlineVariants,
} from './Droppable.variants';
import {
  useDroppable,
  useFilePick,
  type AcceptContract,
} from './useDroppable';

/**
 * One behavior, three feedback presentations:
 *
 *   inline — decorates the wrapped element (avatar / icon replace)
 *   zone   — a standing dashed target (a .md / context file)
 *   region — overlays a big content area (composer / folder), provider-style
 *
 * Controlled: none of them store what was dropped — they emit
 * `onDrop(files)` / `onReject(reason)` and the parent decides.
 */

interface DroppableBaseProps {
  accept?: AcceptContract;
  onDrop?: (files: File[]) => void;
  onReject?: (reason: string) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface DroppableInlineProps
  extends DroppableBaseProps,
  Pick<DroppableInlineVariants, 'rounded'> {
  /** Glyph floated over the media while a drag hovers (default upload). */
  glyph?: ReactNode;
}

// @@T ato-1 begin
export const DroppableInline: { (p: DroppableInlineProps): import('react').JSX.Element; displayName: string } = (({
  accept,
  onDrop,
  onReject,
  disabled,
  rounded,
  glyph,
  className,
  children,
}: DroppableInlineProps): import('react').JSX.Element => {
  const { state, reason, handlers } = useDroppable({
    accept,
    onDrop,
    onReject,
    disabled,
  });
  const { open, input } = useFilePick({ accept, onDrop, onReject });
  const showGlyph = state === 'over' || state === 'reject';
  return (
    <button
      type="button"
      onClick={open}
      {...handlers}
      title={reason ?? 'Click or drop to replace'}
      disabled={disabled}
      className={cn(
        touchable({ inline: true, rounded: 'full', noBrightness: false }),
        droppableInline({ state, rounded }),
        className,
      )}
    >
      <span className={droppableInlineMedia({ state, rounded })}>
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-white transition-opacity',
          showGlyph
            ? 'opacity-100'
            : 'opacity-0',
        )}
      >
        {state === 'reject'
          ? (
            <StrokeIcon name="x" size={18} />
          )
          : (
            (glyph ?? <StrokeIcon name="uploadCloud" size={18} />)
          )}
      </span>
      {input}
    </button>
  );
}) as { (p: DroppableInlineProps): import('react').JSX.Element; displayName: string };
// @@T ato-1 end

DroppableInline.displayName = 'DroppableInline';

export interface DroppableZoneProps extends DroppableBaseProps {
  /** Standing icon (default upload cloud); reject swaps in a warning. */
  icon?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  compact?: boolean;
}

// @@T ato-1 begin
export const DroppableZone: { (p: DroppableZoneProps): import('react').JSX.Element; displayName: string } = (({
  accept,
  onDrop,
  onReject,
  disabled,
  icon,
  label,
  hint,
  compact = false,
  className,
  children,
}: DroppableZoneProps): import('react').JSX.Element => {
  const { state, reason, handlers } = useDroppable({
    accept,
    onDrop,
    onReject,
    disabled,
  });
  const { open, input } = useFilePick({ accept, onDrop, onReject });
  const rejected = state === 'reject';
  const iconSize = compact
    ? 18
    : 22;
  return (
    <div className={className}>
      <button
        type="button"
        onClick={open}
        {...handlers}
        disabled={disabled}
        className={cn(
          touchable({ rounded: 'lg', noBrightness: false }),
          droppableZone({ state, compact, disabled: disabled === true }),
        )}
      >
        <span className={droppableZoneIcon({ state, compact })}>
          {rejected
            ? (
              <StrokeIcon name="alertTriangle" size={iconSize} />
            )
            : (
              (icon ?? <StrokeIcon name="uploadCloud" size={iconSize} />)
            )}
        </span>
        <span
          className={cn(
            'font-semibold',
            compact
              ? 'text-[13px]'
              : 'text-sm',
            rejected
              ? 'text-danger'
              : 'text-fg1',
          )}
        >
          {rejected
            ? reason
            : state === 'over'
              ? 'Release to add'
              : (label ?? 'Drag a file here')}
        </span>
        {!rejected && hint != null && (
          <span className="font-mono text-[11.5px] text-fg3">{hint}</span>
        )}
      </button>
      {children}
      {input}
    </div>
  );
}) as { (p: DroppableZoneProps): import('react').JSX.Element; displayName: string };
// @@T ato-1 end

DroppableZone.displayName = 'DroppableZone';

export interface DroppableRegionProps extends DroppableBaseProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Reserved height for the wrapped area (px). Genuinely dynamic. */
  minHeight?: number;
}

// @@T ato-1 begin
export const DroppableRegion: { (p: DroppableRegionProps): import('react').JSX.Element; displayName: string } = (({
  accept,
  onDrop,
  onReject,
  disabled,
  label,
  hint,
  minHeight = 200,
  className,
  children,
}: DroppableRegionProps): import('react').JSX.Element => {
  const { state, reason, handlers } = useDroppable({
    accept,
    onDrop,
    onReject,
    disabled,
  });
  const rejected = state === 'reject';
  const active = state === 'over' || rejected;
  const style: CSSProperties = { minHeight };
  return (
    <div
      {...handlers}
      className={cn('relative rounded-lg', className)}
      style={style}
    >
      {children}
      <div aria-hidden={!active} className={droppableRegionOverlay({ state })}>
        <span className={droppableRegionIcon({ state })}>
          <StrokeIcon
            name={rejected
              ? 'alertTriangle'
              : 'uploadCloud'}
            size={28}
          />
        </span>
        <span className="font-display text-lg font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
          {rejected
            ? reason
            : (label ?? 'Drop files to add them here')}
        </span>
        {!rejected && hint != null && (
          <span className="text-[13px] opacity-85 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}) as { (p: DroppableRegionProps): import('react').JSX.Element; displayName: string };
// @@T ato-1 end

DroppableRegion.displayName = 'DroppableRegion';

export type DroppableFeedback = 'inline' | 'zone' | 'region';

export type DroppableProps =
  | ({ feedback?: 'zone' } & DroppableZoneProps)
  | ({ feedback: 'inline' } & DroppableInlineProps)
  | ({ feedback: 'region' } & DroppableRegionProps);

/** The one public component — `feedback` picks the presentation. */
// @@T ato-1 begin
export const Droppable: { (props: DroppableProps): import('react').JSX.Element; displayName: string } = ((props: DroppableProps): import('react').JSX.Element => {
  if (props.feedback === 'inline') {
    const { feedback: _feedback, ...rest } = props;
    return <DroppableInline {...rest} />;
  }
  if (props.feedback === 'region') {
    const { feedback: _feedback, ...rest } = props;
    return <DroppableRegion {...rest} />;
  }
  const { feedback: _feedback, ...rest } = props;
  return <DroppableZone {...rest} />;
}) as { (props: DroppableProps): import('react').JSX.Element; displayName: string };
// @@T ato-1 end

Droppable.displayName = 'Droppable';
