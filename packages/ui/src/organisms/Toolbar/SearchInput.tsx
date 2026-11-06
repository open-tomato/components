import {
  forwardRef,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
} from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

import {
  searchClear,
  searchField,
  searchIcon,
  searchInput,
} from './Toolbar.variants';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
}

/** The toolbar's search field — icon, controlled text, inline clear. */
export const SearchInput: ForwardRefExoticComponent<SearchInputProps & RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, SearchInputProps>(

  (
    { className, value, onChange, placeholder = 'Search…', ...props },
    ref,
  ) => (
    <div
      className={cn(searchField(), className)}
    >
      <span
        className={searchIcon()}
      >
        <StrokeIcon name="search" size={16} />
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={searchInput({ clearable: value.length > 0 })}
        {...props}
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className={cn(
            touchable({ inline: true, rounded: 'sm', noBrightness: false }),
            searchClear(),
          )}
        >
          <StrokeIcon name="x" size={15} />
        </button>
      )}
    </div>
  ),
);

SearchInput.displayName = 'SearchInput';
