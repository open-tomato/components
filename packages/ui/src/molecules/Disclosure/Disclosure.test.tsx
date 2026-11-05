import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Accordion, AccordionItem } from './Accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

describe('Accordion', () => {
  it('single mode opens one item and closes the rest', () => {
    render(
      <Accordion defaultValue="a">
        <AccordionItem value="a" title="First">Body A</AccordionItem>
        <AccordionItem value="b" title="Second">Body B</AccordionItem>
      </Accordion>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(second);
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(first.getAttribute('aria-expanded')).toBe('false');
  });

  it('multiple mode keeps several items open', () => {
    render(
      <Accordion mode="multiple" defaultValue={['a']}>
        <AccordionItem value="a" title="First">Body A</AccordionItem>
        <AccordionItem value="b" title="Second">Body B</AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: 'Second' }).getAttribute('aria-expanded')).toBe('true');
  });
});

describe('Tabs', () => {
  it('shows the selected panel and switches on activation', () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one" icon={<span data-testid="icon" />}>One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Panel one')).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
    const two = screen.getByRole('tab', { name: 'Two' });
    fireEvent.mouseDown(two);
    fireEvent.focus(two);
    fireEvent.click(two);
    expect(screen.getByText('Panel two')).toBeTruthy();
    expect(screen.queryByText('Panel one')).toBeNull();
  });
});
