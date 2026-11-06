import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Button } from './Button';

afterEach(cleanup);

describe('Button', () => {
  it('renders a button with type=button', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('type')).toBe('button');
  });

  it.each(['primary', 'accent', 'secondary', 'ghost', 'danger'] as const)('renders variant %s', (variant) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeTruthy();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    render(<Button size={size}>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeTruthy();
  });

  it('stretches when block', () => {
    render(<Button block>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' }).className).toContain('w-full');
  });

  it('renders leading and trailing content', () => {
    render(
      <Button iconLeading={<i data-testid="l" />} iconTrailing={<i data-testid="t" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeTruthy();
    expect(screen.getByTestId('t')).toBeTruthy();
  });

  it('fires onClick', () => {
    const onClick = mock(() => undefined);
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const onClick = mock(() => undefined);
    render(<Button disabled onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders asChild as the single child element carrying the button classes', () => {
    const { container } = render(<Button asChild><a href="/x">Link</a></Button>);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(container.querySelector('button')).toBeNull();
    expect(container.firstElementChild).toBe(link);
    expect(link.getAttribute('href')).toBe('/x');
    expect(link.getAttribute('type')).toBeNull();
    const { container: reference } = render(<Button>Ref</Button>);
    expect(link.className).toBe(reference.querySelector('button')?.className ?? '');
  });

  it('keeps leading and trailing icons inside the asChild element', () => {
    const { container } = render(
      <Button asChild iconLeading={<i data-testid="l" />} iconTrailing={<i data-testid="t" />}>
        <a href="/x">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(link.contains(screen.getByTestId('l'))).toBe(true);
    expect(link.contains(screen.getByTestId('t'))).toBe(true);
    expect(link.firstElementChild).toBe(screen.getByTestId('l'));
    expect(link.lastElementChild).toBe(screen.getByTestId('t'));
  });
});
