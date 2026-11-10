/**
 * The visual suite's font pin (`.storybook/visual-fonts.ts`): Google Fonts
 * answers the same CSS URL in two forms, static `/s/` files or generated
 * `/l/font?kit=` files, and the two draw text differently. The pin keeps
 * only static answers, refetching until one arrives.
 */
import { describe, expect, it } from 'bun:test';

import { firstStaticAnswer, isStaticGoogleFontsCss } from '../.storybook/visual-fonts';

const STATIC_FACE = `@font-face {
  font-family: 'Manrope';
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/manrope/v23/static-face.woff2) format('woff2');
}`;

const KIT_FACE = `@font-face {
  font-family: 'Manrope';
  font-weight: 400;
  src: url(https://fonts.gstatic.com/l/font?kit=generated-face&skey=0&v=v23) format('woff2');
}`;

/** A fetcher that hands out the given answers in order and counts its calls. */
function scripted(answers: Array<{ ok: boolean; body: string }>) {
  let calls = 0;
  const fetchOnce = async () => {
    const answer = answers[calls] ?? answers[answers.length - 1];
    calls += 1;
    if (answer === undefined) throw new Error('scripted fetcher has no answers');
    return answer;
  };
  return { fetchOnce, calls: () => calls };
}

describe('isStaticGoogleFontsCss', () => {
  it('accepts CSS whose every face is a static file', () => {
    // Arrange
    const css = `${STATIC_FACE}\n${STATIC_FACE}`;

    // Act
    const accepted = isStaticGoogleFontsCss(css);

    // Assert
    expect(accepted).toBe(true);
  });

  it('rejects CSS whose faces are generated kit files', () => {
    expect(isStaticGoogleFontsCss(KIT_FACE)).toBe(false);
  });

  it('rejects CSS that mixes static and generated faces', () => {
    expect(isStaticGoogleFontsCss(`${STATIC_FACE}\n${KIT_FACE}`)).toBe(false);
  });

  it('rejects a body with no font URL at all', () => {
    expect(isStaticGoogleFontsCss('<html>rate limited</html>')).toBe(false);
  });

  it('reads quoted URLs the same as bare ones', () => {
    const quoted = STATIC_FACE.replace('url(https', 'url(\'https').replace('.woff2)', '.woff2\')');

    expect(isStaticGoogleFontsCss(quoted)).toBe(true);
  });
});

describe('firstStaticAnswer', () => {
  it('skips generated answers and returns the first static one', async () => {
    // Arrange
    const fetcher = scripted([
      { ok: true, body: KIT_FACE },
      { ok: true, body: KIT_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    // Act
    const answer = await firstStaticAnswer(fetcher.fetchOnce, 5);

    // Assert
    expect(answer?.body).toBe(STATIC_FACE);
    expect(fetcher.calls()).toBe(3);
  });

  it('skips a failed response even when its body looks static', async () => {
    const fetcher = scripted([
      { ok: false, body: STATIC_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    const answer = await firstStaticAnswer(fetcher.fetchOnce, 5);

    expect(answer?.ok).toBe(true);
    expect(fetcher.calls()).toBe(2);
  });

  it('gives up after the attempt limit and returns undefined', async () => {
    const fetcher = scripted([{ ok: true, body: KIT_FACE }]);

    const answer = await firstStaticAnswer(fetcher.fetchOnce, 4);

    expect(answer).toBeUndefined();
    expect(fetcher.calls()).toBe(4);
  });
});
