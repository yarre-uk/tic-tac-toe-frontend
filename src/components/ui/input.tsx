import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'border-line bg-bg-cell text-ink placeholder:text-ink-3 ring-x/30 aria-invalid:border-o aria-invalid:ring-o/20 border',
        'disabled:bg-bg-cell/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'h-8 w-full min-w-0 rounded-lg aria-invalid:ring-3',
        'px-2.5 py-1 text-sm transition-colors outline-none md:text-base',
        'focus-visible:border-x focus-visible:ring-3',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
