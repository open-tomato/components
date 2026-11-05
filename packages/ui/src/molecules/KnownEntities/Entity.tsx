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

export type EntityLayout = 'inline' | 'cell' | 'title';

export interface EntityProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * `inline` — one line (leading + title); `cell` — compact double line;
   * `title` — larger tile with a double line.
   */
  layout?: EntityLayout;
  /** Key into the `EntityKinds` map: supplies icon, tone and default texts. */
  kind?: string;
  /** Identity slot — replaces the glyph the kind supplies. */
  leading?: ReactNode;
  /** Top line; falls back to the kind's default title. */
  title?: ReactNode;
  /** Greyed second line; falls back to the kind's default subtitle. */
  subtitle?: ReactNode;
  /** Companion after the text (a badge, a count) — on the second line when there is one. */
  trailing?: ReactNode;
}

/**
 * `Entity` — one display template for the recurring things in tables,
 * cards and menus. The three `layout`s share one slot set (`leading`,
 * `title`, `subtitle`, `trailing`); a `kind` looks up its glyph, accent and
 * default texts in the `EntityKinds` map the implementor supplies through
 * `EntityKindsProvider` (spec: "Known Entities").
 */
export const Entity: import('react').ForwardRefExoticComponent<
  EntityProps & import('react').RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, EntityProps>(
  ({ className, layout = 'inline', kind, leading, title, subtitle, trailing, ...props }, ref) => {
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

    if (layout === 'inline') {
      return createElement(
        'span',
        { ref, className: cn(entityCell(), className), ...props },
        leading ?? (glyph != null && (
          <span className={entityTone({ tone })}>
            <Icon name={glyph} size={12} />
          </span>
        )),
        resolvedTitle != null && <span className={entityInlineName()}>{resolvedTitle}</span>,
        trailing,
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
    const stack = trailing != null
      ? toolTitleStack()
      : entityCellStack();
    const hasMeta = resolvedSubtitle != null || trailing != null;
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
        {hasMeta && (
          <span className={entityMeta()}>
            {resolvedSubtitle}
            {trailing}
          </span>
        )}
      </div>,
    );
  },
);

Entity.displayName = 'Entity';
