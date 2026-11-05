import type { IconName } from '../../atoms/Icon';
import type { ChartTone } from '../../lib';

import { createContext, useContext, type Context } from 'react';

/** What one kind of entity looks like: its icon, accent and default texts. */
export interface EntityKind {
  /** Glyph shown in `leading` when the caller supplies none. */
  icon?: IconName;
  /** Accent (shared chart palette) tinting the glyph. */
  tone?: ChartTone;
  /** Default title when the caller passes none. */
  title?: string;
  /** Default subtitle when the caller passes none. */
  subtitle?: string;
}

/** The implementor's map from a `kind` key to its look. The kit ships none. */
export type EntityKinds = Readonly<Record<string, EntityKind>>;

const EMPTY_KINDS: EntityKinds = {};

export const EntityKindsContext: Context<EntityKinds> = createContext<EntityKinds>(EMPTY_KINDS);

/** The map supplied by the nearest `EntityKindsProvider` (empty without one). */
export const useEntityKinds = (): EntityKinds => useContext(EntityKindsContext);
