import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      xxs: 'text-[0.65rem]',
      xs: 'text-xs',
      sm: 'text-xs sm:text-sm',
      base: 'text-sm sm:text-base',
      lg: 'text-base sm:text-lg',
      xl: 'text-lg sm:text-xl',
      '2xl': 'text-xl sm:text-2xl',
      '3xl': 'text-2xl md:text-3xl',
      '4xl': 'text-2xl sm:text-3xl md:text-4xl',
      '5xl': 'text-3xl sm:text-4xl md:text-5xl',
      title: 'text-[80px] sm:text-[100px] md:text-[120px]',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      inherit: 'text-inherit',
      primary: 'text-ink',
      secondary: 'text-ink-2',
      muted: 'text-ink-3',
      x: 'text-x',
      o: 'text-o',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
    tracking: {
      normal: 'tracking-normal',
      wide: 'tracking-[0.3rem]',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'primary',
    leading: 'normal',
  },
});

type TextProps<T extends ElementType = 'p'> = {
  as?: T;
} & VariantProps<typeof textVariants> &
  Omit<
    ComponentPropsWithoutRef<T>,
    keyof VariantProps<typeof textVariants> | 'as'
  >;

function Text<T extends ElementType = 'p'>({
  as,
  size,
  weight,
  color = 'inherit',
  leading,
  tracking,
  className,
  ...props
}: TextProps<T>) {
  const Tag = as ?? 'p';

  return (
    <Tag
      className={cn(
        textVariants({ size, weight, color, leading, tracking }),
        className,
      )}
      {...props}
    />
  );
}

export { Text, textVariants };
