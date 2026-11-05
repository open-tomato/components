import {
  forwardRef,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
} from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

// @@V org-2 begin
import {
  searchClear,
  searchField,
  searchIcon,
  searchInput,
} from './Toolbar.variants';
// @@V org-2 end

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
}

/** The toolbar's search field — icon, controlled text, inline clear. */
// @@T org-2 begin
export const SearchInput: ForwardRefExoticComponent<SearchInputProps & RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, SearchInputProps>(
// @@T org-2 end

  (
    // @@S org-2 begin
    { className, value, onChange, placeholder = 'Search…', ...props },
    // @@S org-2 end
    ref,
  ) => (
    <div
      // @@V org-2 begin
      className={cn(searchField(), className)}
      // @@V org-2 end
    >
      <span
        // @@V org-2 begin
        className={searchIcon()}
        // @@V org-2 end
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
            // @@V org-2 begin
            searchClear(),
            // @@V org-2 end
          )}
        >
          <StrokeIcon name="x" size={15} />
        </button>
      )}
    </div>
  ),
);

SearchInput.displayName = 'SearchInput';
