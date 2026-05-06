import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'border-line bg-bg-cell text-ink placeholder:text-ink-3 ring-x/30 aria-invalid:border-o aria-invalid:ring-o/20 disabled:bg-bg-cell/50 h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-x focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
