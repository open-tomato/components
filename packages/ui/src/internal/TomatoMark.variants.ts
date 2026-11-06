import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/** The mark svg: never shrinks inside a flex row. */
export const tomatoMark: (props?: ClassProp) => string = cva('shrink-0');

/** The mark's leaf path, in the accent fill. */
export const tomatoMarkLeaf: (props?: ClassProp) => string = cva('fill-accent');

/** The mark's round body, in the primary fill. */
export const tomatoMarkBody: (props?: ClassProp) => string = cva('fill-primary');
