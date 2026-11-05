import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { devError, devWarn } from './dev';

describe('dev helpers', () => {
  const original = process.env.NODE_ENV;
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });
  afterEach(() => {
    process.env.NODE_ENV = original;
  });

  it('forwards warnings and errors outside production', () => {
    const warn = spyOn(console, 'warn').mockImplementation(() => {});
    const error = spyOn(console, 'error').mockImplementation(() => {});
    devWarn('w', 1);
    devError('e');
    expect(warn).toHaveBeenCalledWith('w', 1);
    expect(error).toHaveBeenCalledWith('e');
    warn.mockRestore();
    error.mockRestore();
  });

  it('stays silent in production', () => {
    process.env.NODE_ENV = 'production';
    const warn = spyOn(console, 'warn').mockImplementation(() => {});
    const error = spyOn(console, 'error').mockImplementation(() => {});
    devWarn('w');
    devError('e');
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    warn.mockRestore();
    error.mockRestore();
  });
});
