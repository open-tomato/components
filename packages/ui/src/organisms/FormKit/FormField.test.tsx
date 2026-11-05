import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { FormField } from './FormField';

describe('FormField', () => {
  it('labels the control through htmlFor and marks required', () => {
    render(
      <FormField label="Name" htmlFor="n" required>
        <input id="n" />
      </FormField>,
    );
    expect(screen.getByLabelText(/Name/)).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('renders labelEnd without a label', () => {
    render(<FormField labelEnd={<a href="#x">Forgot?</a>}><input /></FormField>);
    expect(screen.getByRole('link', { name: 'Forgot?' })).toBeTruthy();
  });

  it('renders no label row when neither is given', () => {
    const { container } = render(<FormField><input /></FormField>);
    expect(container.querySelector('label')).toBeNull();
  });

  it('puts the hint below by default', () => {
    const { container } = render(<FormField hint="Helpful"><input /></FormField>);
    const hint = screen.getByText('Helpful');
    const input = container.querySelector('input') as HTMLElement;
    expect(input.compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('puts the hint above when asked', () => {
    const { container } = render(<FormField hint="Helpful" hintPlacement="above"><input /></FormField>);
    const hint = screen.getByText('Helpful');
    const input = container.querySelector('input') as HTMLElement;
    expect(input.compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('error replaces the hint', () => {
    render(<FormField hint="Helpful" error="Required"><input /></FormField>);
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('Helpful')).toBeNull();
  });
});
