/**
 * The `bun test` preload (`bunfig.toml`): registers happy-dom's window,
 * document and friends as globals, then unmounts what each test rendered.
 * Testing Library is imported after the registration so it sees a DOM.
 */
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterEach } from 'bun:test';

GlobalRegistrator.register();

const { cleanup } = await import('@testing-library/react');

afterEach(() => {
  cleanup();
});
