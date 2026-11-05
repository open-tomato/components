import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/** FakeQrCode — the framed card the pattern sits on. */
export const fakeQr: (props?: ClassProp) => string = cva(
  'rounded-md border border-border-soft bg-surface-2 p-2 shadow-xs',
);

/** A dark module: data cells and the finder's outer and inner squares. */
export const fakeQrInk: (props?: ClassProp) => string = cva('fill-fg1');

/** The finder's light ring between its outer and inner squares. */
export const fakeQrPaper: (props?: ClassProp) => string = cva('fill-surface-2');
