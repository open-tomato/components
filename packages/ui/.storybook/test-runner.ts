import { waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { prepareWithStaticFonts } from './visual-fonts';

/**
 * Visual regression layer — one PNG per story × theme, diffed against the
 * baselines of THIS environment (baselines are untracked and never cross
 * machines; CI keeps its own set via actions/cache). See
 * the visual suite docs in AGENTS.md for context.
 *
 * Themes are applied exactly the way .storybook/preview.ts applies them:
 * data-theme on the document element. Tokens are pure CSS vars keyed off
 * [data-theme], so toggling the attribute re-themes the render.
 */
const THEMES = ['light', 'dark'] as const;

/**
 * Diff tolerance, provisional: README.md lists both values under "Visual
 * diff tolerance (to revisit)". Chromium does not draw text the same way
 * on every render, so the edge pixels of glyphs differ between passes of
 * the same page, at rest and with one worker. Measured on the kit's 658
 * shots: at the default per-pixel threshold (0.01) a flaky shot flagged up
 * to 396 pixels and the smallest reviewed real change 150; at 0.1 those
 * were 12 and 85. So a pixel counts as changed when its colour moves
 * past 0.1 (about 26 of 255 brightness levels), and a shot fails when
 * more than 20 pixels changed.
 */
const PIXEL_COLOR_THRESHOLD = 0.1;
const MAX_CHANGED_PIXELS = 20;

const customSnapshotsDir = `${process.cwd()}/visual/__image_snapshots__`;
const customDiffDir = `${process.cwd()}/visual/__diff_output__`;

// jest-image-snapshot augments the Jest matchers; expect is a Jest global
// inside the test-runner process. The shim avoids pulling Jest's global
// types into the project tsconfig.
declare const expect: {
  extend: (matchers: Record<string, unknown>) => void;
  (received: unknown): {
    toMatchImageSnapshot: (options: Record<string, unknown>) => void;
  };
};

const config: TestRunnerConfig = {
  // Every story file's page loads the fonts through a static-only pin;
  // see visual-fonts.ts for why one CSS answer used to fail a whole file.
  prepare: prepareWithStaticFonts,
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Async-loaded glyphs (atoms/Icon: per-name React.lazy chunks) mark
    // their stand-ins with data-glyph-pending. Wait until every pending
    // glyph has committed before capturing either theme — otherwise the
    // screenshot races the lazy commit and the baselines flake. The cheap
    // evaluate guard keeps glyph-less stories on their original capture
    // timing (waitForSelector costs a frame even when nothing matches,
    // which was enough to shift the timer-driven Toast demos). A timeout
    // on the wait is a real failure (a chunk never loaded), so let it
    // throw.
    const hasPendingGlyphs = await page.evaluate(() => document.querySelector('[data-glyph-pending]') != null);
    if (hasPendingGlyphs) {
      await page.waitForSelector('[data-glyph-pending]', {
        state: 'detached',
        timeout: 15_000,
      });
    }
    for (const theme of THEMES) {
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);

      // Deterministic settle: network idle, fonts loaded, animations off.
      await waitForPageReady(page);
      await page.evaluate(() => document.fonts.ready);

      const image = await page.screenshot({ animations: 'disabled' });

      expect(image).toMatchImageSnapshot({
        customSnapshotsDir,
        customDiffDir,
        customSnapshotIdentifier: `${context.id}--${theme}`,
        customDiffConfig: { threshold: PIXEL_COLOR_THRESHOLD },
        failureThreshold: MAX_CHANGED_PIXELS,
        failureThresholdType: 'pixel',
      });
    }
  },
};

export default config;
