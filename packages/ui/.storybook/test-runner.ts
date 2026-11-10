import { waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

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
 * Diff tolerance; README.md "Visual diff tolerance" holds the readings.
 * The type faces ship in the package (src/styles/fonts/), so every pass
 * draws text with the same font files, and the edge-pixel noise that
 * once needed a wide tolerance is gone. Measured on 2026-11-10 over 3
 * passes of the 674 shots at the exact setting (colour threshold 0, no
 * changed pixel allowed), load average 11 to 15: 2022 of 2023
 * comparisons matched exactly, and one shot differed by 1 pixel once,
 * matching on its repeat. So a pixel counts as changed when its colour
 * moves past 0.01 (jest-image-snapshot's default, about 3 of 255
 * brightness levels), and a shot fails when more than 1 pixel changed.
 */
const PIXEL_COLOR_THRESHOLD = 0.01;
const MAX_CHANGED_PIXELS = 1;

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
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  // Both themes are captured and compared before the story fails: each
  // theme keeps its own toMatchImageSnapshot call, so each writes its own
  // baseline and diff image under `<story id>--<theme>`, but a mismatch
  // throws, so the call is caught and the errors are thrown once after the
  // loop. Otherwise a failed light shot would end the story and its dark
  // shot would never be compared. The joined message holds each theme's
  // own error, diff path included, which is what the review page
  // (scripts/visual-review) reads.
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
    const failures: string[] = [];
    for (const theme of THEMES) {
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);

      // Deterministic settle: network idle, fonts loaded, animations off.
      await waitForPageReady(page);
      await page.evaluate(() => document.fonts.ready);

      const image = await page.screenshot({ animations: 'disabled' });

      try {
        expect(image).toMatchImageSnapshot({
          customSnapshotsDir,
          customDiffDir,
          customSnapshotIdentifier: `${context.id}--${theme}`,
          customDiffConfig: { threshold: PIXEL_COLOR_THRESHOLD },
          failureThreshold: MAX_CHANGED_PIXELS,
          failureThresholdType: 'pixel',
        });
      } catch (error: unknown) {
        const message = error instanceof Error
          ? error.message
          : String(error);
        failures.push(`${theme} theme: ${message}`);
      }
    }
    if (failures.length > 0) {
      throw new Error(failures.join('\n\n'));
    }
  },
};

export default config;
