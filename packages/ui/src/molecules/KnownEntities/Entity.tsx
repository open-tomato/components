import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';
import { devWarn } from '../../lib/dev';

import { useEntityKinds } from './entityKindsContext';
import {
  entityCell,
  entityCellStack,
  entityInlineName,
  entityMeta,
  entityTile,
  entityTitle,
  entityTitleName,
  entityTone,
  toolTitleStack,
} from './KnownEntities.variants';

export type EntityLayout = 'inline' | 'stack' | 'cell' | 'title';

export interface EntityProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * `inline` — one line (leading + title + trailing); `stack` — that same
   * line with a greyed second line under it, starting below the leading
   * (for a status dot); `cell` — leading beside a compact double line (for
   * a tile); `title` — larger tile with a double line.
   */
  layout?: EntityLayout;
  /** Key into the `EntityKinds` map: supplies icon, tone and default texts. */
  kind?: string;
  /** Identity slot — replaces the glyph the kind supplies. */
  leading?: ReactNode;
  /** Top line; falls back to the kind's default title. */
  title?: ReactNode;
  /**
   * Sets the title of the `inline` and `stack` layouts in the small mono
   * face, for handles, model names and ids.
   */
  mono?: boolean;
  /** Greyed second line; falls back to the kind's default subtitle. */
  subtitle?: ReactNode;
  /**
   * A tag that leads the second line, before the subtitle (a type badge).
   * Only the two-line layouts (`stack`, `cell`, `title`) show it.
   */
  badge?: ReactNode;
  /**
   * Companion after the text (a count, a badge): on the title line in
   * `inline` and `stack`, after the subtitle in `cell` and `title`.
   */
  trailing?: ReactNode;
}

/** The greyed second line: badge, subtitle, then trailing; nothing when all are empty. */
function metaLine(badge: ReactNode, subtitle: ReactNode, trailing?: ReactNode): ReactNode {
  if (badge == null && subtitle == null && trailing == null) return null;
  return (
    <span className={entityMeta()}>
      {badge}
      {subtitle}
      {trailing}
    </span>
  );
}

/**
 * `Entity` — one display template for the recurring things in tables,
 * cards and menus. The four `layout`s share one slot set (`leading`,
 * `title`, `subtitle`, `badge`, `trailing`); a `kind` looks up its glyph, accent and
 * default texts in the `EntityKinds` map the implementor supplies through
 * `EntityKindsProvider` (spec: "Known Entities").
 */
export const Entity: import('react').ForwardRefExoticComponent<
  EntityProps & import('react').RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, EntityProps>(
  ({ className, layout = 'inline', kind, leading, title, mono, subtitle, badge, trailing, ...props }, ref) => {
    const kinds = useEntityKinds();
    const found = kind != null
      ? kinds[kind]
      : undefined;
    if (kind != null && found == null) {
      devWarn(`Entity: kind "${kind}" is not in the EntityKinds map — supply it through EntityKindsProvider`);
    }
    const resolvedTitle = title ?? found?.title;
    const resolvedSubtitle = subtitle ?? found?.subtitle;
    const tone = found?.tone;
    const glyph = found?.icon;

    const inlineLeading = leading ?? (glyph != null && (
      <span className={entityTone({ tone })}>
        <Icon name={glyph} size={12} />
      </span>
    ));
    const inlineTitle = resolvedTitle != null && <span className={entityInlineName({ mono })}>{resolvedTitle}</span>;

    if (layout === 'inline') {
      return createElement(
        'span',
        { ref, className: cn(entityCell(), className), ...props },
        inlineLeading,
        inlineTitle,
        trailing,
      );
    }

    if (layout === 'stack') {
      return createElement(
        'div',
        { ref, className: cn(entityCellStack(), className), ...props },
        <span className={entityCell()}>
          {inlineLeading}
          {inlineTitle}
          {trailing}
        </span>,
        metaLine(badge, resolvedSubtitle),
      );
    }

    const large = layout === 'title';
    const root = large
      ? entityTitle()
      : entityCell();
    const tileSize = large
      ? 'md'
      : 'sm';
    const glyphSize = large
      ? 16
      : 13;
    const stack = badge != null || trailing != null
      ? toolTitleStack()
      : entityCellStack();
    return createElement(
      'div',
      { ref, className: cn(root, className), ...props },
      leading ?? (glyph != null && (
        <span className={cn(entityTile({ size: tileSize }), entityTone({ tone }))}>
          <Icon name={glyph} size={glyphSize} />
        </span>
      )),
      <div className={stack}>
        {resolvedTitle != null && <span className={entityTitleName()}>{resolvedTitle}</span>}
        {metaLine(badge, resolvedSubtitle, trailing)}
      </div>,
    );
  },
);

Entity.displayName = 'Entity';
