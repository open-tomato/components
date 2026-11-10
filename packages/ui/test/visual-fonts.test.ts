/**
 * The visual suite's font pin (`.storybook/visual-fonts.ts`): Google Fonts
 * answers the same CSS URL in two forms, static `/s/` files or generated
 * `/l/font?kit=` files, and the two draw text differently. The pin keeps
 * only static answers, refetching until one arrives, and keeps every
 * accepted answer in a disk cache so later pages never touch the network.
 */
import { existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

import {
  firstAcceptedAnswer,
  isStaticGoogleFontsCss,
  readCachedResponse,
  writeCachedResponse,
} from '../.storybook/visual-fonts';

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

interface Answer {
  ok: boolean;
  body: string;
}

const isStaticAnswer = (answer: Answer) => answer.ok && isStaticGoogleFontsCss(answer.body);

/** A fetcher that hands out the given answers in order and counts its calls. */
function scripted(answers: Answer[]) {
  let calls = 0;
  const fetchOnce = async (): Promise<Answer> => {
    const answer = answers[Math.min(calls, answers.length - 1)];
    calls += 1;
    if (answer === undefined) throw new Error('scripted fetcher has no answers');
    return answer;
  };
  return { fetchOnce, calls: () => calls };
}

function freshCacheDir(): string {
  return join(mkdtempSync(join(tmpdir(), 'visual-fonts-')), 'cache');
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
    const quoted = 'src: url(\'https://fonts.gstatic.com/s/manrope/v23/static-face.woff2\') format(\'woff2\');';

    expect(isStaticGoogleFontsCss(quoted)).toBe(true);
  });
});

describe('firstAcceptedAnswer', () => {
  it('skips rejected answers and returns the first accepted one', async () => {
    // Arrange
    const fetcher = scripted([
      { ok: true, body: KIT_FACE },
      { ok: true, body: KIT_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    // Act
    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 5);

    // Assert
    expect(answer?.body).toBe(STATIC_FACE);
    expect(fetcher.calls()).toBe(3);
  });

  it('skips a failed response even when its body looks static', async () => {
    const fetcher = scripted([
      { ok: false, body: STATIC_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 5);

    expect(answer?.ok).toBe(true);
    expect(fetcher.calls()).toBe(2);
  });

  it('counts a thrown fetch as a failed attempt, reports it and keeps going', async () => {
    // Arrange
    let calls = 0;
    const reported: string[] = [];
    const fetchOnce = async (): Promise<Answer> => {
      calls += 1;
      if (calls === 1) throw new Error('net::ERR_NAME_NOT_RESOLVED');
      return { ok: true, body: STATIC_FACE };
    };

    // Act
    const answer = await firstAcceptedAnswer(fetchOnce, isStaticAnswer, 5, (error) => {
      reported.push(String(error));
    });

    // Assert
    expect(answer?.body).toBe(STATIC_FACE);
    expect(calls).toBe(2);
    expect(reported).toEqual(['Error: net::ERR_NAME_NOT_RESOLVED']);
  });

  it('returns undefined when every attempt throws', async () => {
    let calls = 0;
    const fetchOnce = async (): Promise<Answer> => {
      calls += 1;
      throw new Error('Timeout 5000ms exceeded');
    };

    const answer = await firstAcceptedAnswer(fetchOnce, isStaticAnswer, 3);

    expect(answer).toBeUndefined();
    expect(calls).toBe(3);
  });

  it('gives up after the attempt limit and returns undefined', async () => {
    const fetcher = scripted([{ ok: true, body: KIT_FACE }]);

    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 4);

    expect(answer).toBeUndefined();
    expect(fetcher.calls()).toBe(4);
  });
});

describe('the font cache', () => {
  const URL_A = 'https://fonts.gstatic.com/s/manrope/v23/face-a.woff2';
  const URL_B = 'https://fonts.gstatic.com/s/manrope/v23/face-b.woff2';

  it('returns what was written for the same URL', () => {
    // Arrange
    const dir = freshCacheDir();
    const body = Buffer.from([0x77, 0x4f, 0x46, 0x32, 0x00, 0xff]);

    // Act
    writeCachedResponse(dir, URL_A, { contentType: 'font/woff2', body });
    const cached = readCachedResponse(dir, URL_A);

    // Assert
    expect(cached?.contentType).toBe('font/woff2');
    expect(cached?.body.equals(body)).toBe(true);
  });

  it('answers undefined for a URL it never stored', () => {
    const dir = freshCacheDir();
    writeCachedResponse(dir, URL_A, { contentType: 'font/woff2', body: Buffer.from('a') });

    expect(readCachedResponse(dir, URL_B)).toBeUndefined();
  });

  it('answers undefined before the directory exists', () => {
    const dir = freshCacheDir();

    expect(existsSync(dir)).toBe(false);
    expect(readCachedResponse(dir, URL_A)).toBeUndefined();
  });

  it('leaves no temporary file behind after a write', () => {
    const dir = freshCacheDir();

    writeCachedResponse(dir, URL_A, { contentType: 'text/css', body: Buffer.from(STATIC_FACE) });

    expect(readdirSync(dir).filter((name) => name.includes('.tmp'))).toEqual([]);
    expect(readdirSync(dir)).toHaveLength(1);
  });
});
