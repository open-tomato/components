// @@T tpl-1 begin
import type { JSX } from 'react';
// @@T tpl-1 end
// @@V tpl-1 begin

import { fakeQr, fakeQrInk, fakeQrPaper } from './fake-qr.variants';
// @@V tpl-1 end
/**
 * Story fixture — a deterministic "QR-ish" 25×25 pattern that LOOKS like a
 * QR code without claiming to be one (seeded LCG, no Math.random, stable
 * across renders → safe for visual baselines). The real 2FA screen receives
 * its QR through TwoFactorPage's `qr` slot from the server.
 * NOT public API: never export from src/ barrels.
 */
const N = 25;

const seedGrid = (): boolean[][] => {
  let s = 0xc0de;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s & 0xffff) / 0xffff;
  };
  // builder-local mutation: the grid is constructed once at module load
  const grid: boolean[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => false));
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) grid[y]![x] = rand() > 0.52;
  for (const [gy, gx] of [
    [0, 0],
    [0, N - 7],
    [N - 7, 0],
  ] as const) {
    for (let y = gy; y < gy + 7; y++) for (let x = gx; x < gx + 7; x++) grid[y]![x] = false;
  }
  return grid;
};

const GRID = seedGrid();

const Finder = ({ gx, gy, cell }: { gx: number; gy: number; cell: number }) => (
  <g>
    {/* @@V tpl-1 begin */}
    <rect x={gx * cell} y={gy * cell} width={cell * 7} height={cell * 7} className={fakeQrInk()} />
    <rect x={(gx + 1) * cell} y={(gy + 1) * cell} width={cell * 5} height={cell * 5} className={fakeQrPaper()} />
    <rect x={(gx + 2) * cell} y={(gy + 2) * cell} width={cell * 3} height={cell * 3} className={fakeQrInk()} />
    {/* @@V tpl-1 end */}
  </g>
);

// @@T tpl-1 begin
export const FakeQrCode = ({ size = 172 }: { size?: number }): JSX.Element => {
// @@T tpl-1 end
  const cell = size / N;
  return (
    // @@V tpl-1 begin
    <div className={fakeQr()}>
      {/* @@V tpl-1 end */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {GRID.flatMap((row, y) => row.map(
          (v, x) => v && (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              // @@V tpl-1 begin
              className={fakeQrInk()}
              // @@V tpl-1 end
            />
          ),
        ))}
        <Finder gx={0} gy={0} cell={cell} />
        <Finder gx={N - 7} gy={0} cell={cell} />
        <Finder gx={0} gy={N - 7} cell={cell} />
      </svg>
    </div>
  );
};
