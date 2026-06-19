import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'vol-btn inline-flex items-center gap-2.5 px-5 py-3.25 rounded-[13px] text-sm font-semibold tracking-[0.01em] leading-none cursor-pointer no-underline select-none will-change-transform outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        base: 'vol-base',
        outlined: 'vol-outlined',
      },
      color: {
        x: 'vol-x',
        o: 'vol-o',
        natural: 'vol-natural',
      },
    },
    defaultVariants: {
      variant: 'base',
      color: 'x',
    },
  },
);

function Button({
  variant,
  color,
  className,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, color }), className)}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
