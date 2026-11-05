import type { JSX, ReactNode } from 'react';

import { EntityKindsContext, type EntityKinds } from './entityKindsContext';

export interface EntityKindsProviderProps {
  kinds: EntityKinds;
  children?: ReactNode;
}

/** Supplies the `EntityKinds` map read by `Entity` and by the search suggestions. */
export const EntityKindsProvider = ({ kinds, children }: EntityKindsProviderProps): JSX.Element => (
  <EntityKindsContext.Provider value={kinds}>{children}</EntityKindsContext.Provider>
);
