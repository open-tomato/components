import type { CSSProperties } from 'react';

import { cn } from '../../lib';

// @@V org-1 begin
import { slider, sliderInput, sliderReadout } from './FormKit.variants';
// @@V org-1 end

export interface SliderProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats the mono readout next to the track (e.g. 184000 → "184k"). */
  format?: (value: number) => string;
  className?: string;
}

// @@T org-1 begin
export const Slider: { (props: SliderProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format,
  className,
}: SliderProps) => {
  const pct = ((value - min) / (max - min)) * 100;
  // --pct drives the track's filled/unfilled gradient — genuinely dynamic.
  const style = { '--pct': `${pct}%` } as CSSProperties;
  return (
    // @@V org-1 begin
    <div className={cn(slider(), className)}>
      {/* @@V org-1 end */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={sliderInput()}
        style={style}
      />
      {/* @@V org-1 begin */}
      <span className={sliderReadout()}>
        {/* @@V org-1 end */}
        {format
          ? format(value)
          : value}
      </span>
    </div>
  );
};

Slider.displayName = 'Slider';
