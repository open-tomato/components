import { type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';
import { touchableVariants } from '../../particles/touchable';

import {
  droppableInline,
  droppableInlineGlyph,
  droppableInlineMedia,
  droppableRegion,
  droppableRegionHint,
  droppableRegionIcon,
  droppableRegionLabel,
  droppableRegionOverlay,
  droppableZone,
  droppableZoneHint,
  droppableZoneIcon,
  droppableZoneLabel,
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
        touchableVariants({ inline: true, rounded: 'full', noBrightness: false }),
        droppableInline({ state, rounded }),
        className,
      )}
    >
      <span className={droppableInlineMedia({ state, rounded })}>
        {children}
      </span>
      <span
        aria-hidden
        className={cn(droppableInlineGlyph({ visible: showGlyph }))}
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

DroppableInline.displayName = 'DroppableInline';

export interface DroppableZoneProps extends DroppableBaseProps {
  /** Standing icon (default upload cloud); reject swaps in a warning. */
  icon?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  compact?: boolean;
}

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
          touchableVariants({ rounded: 'lg', noBrightness: false }),
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
          className={cn(droppableZoneLabel({ compact, rejected }))}
        >
          {rejected
            ? reason
            : state === 'over'
              ? 'Release to add'
              : (label ?? 'Drag a file here')}
        </span>
        {!rejected && hint != null && (
          <span className={droppableZoneHint()}>{hint}</span>
        )}
      </button>
      {children}
      {input}
    </div>
  );
}) as { (p: DroppableZoneProps): import('react').JSX.Element; displayName: string };

DroppableZone.displayName = 'DroppableZone';

export interface DroppableRegionProps extends DroppableBaseProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Reserved height for the wrapped area (px). Genuinely dynamic. */
  minHeight?: number;
}

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
      className={cn(droppableRegion(), className)}
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
        <span className={droppableRegionLabel()}>
          {rejected
            ? reason
            : (label ?? 'Drop files to add them here')}
        </span>
        {!rejected && hint != null && (
          <span className={droppableRegionHint()}>
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}) as { (p: DroppableRegionProps): import('react').JSX.Element; displayName: string };

DroppableRegion.displayName = 'DroppableRegion';

export type DroppableFeedback = 'inline' | 'zone' | 'region';

export type DroppableProps =
  | ({ feedback?: 'zone' } & DroppableZoneProps)
  | ({ feedback: 'inline' } & DroppableInlineProps)
  | ({ feedback: 'region' } & DroppableRegionProps);

/** The one public component — `feedback` picks the presentation. */
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

Droppable.displayName = 'Droppable';
