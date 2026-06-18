import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '@/lib/utils';

const variantClass = { base: 'vol-base', outlined: 'vol-outlined' } as const;
const colorClass = { x: 'vol-x', o: 'vol-o', natural: 'vol-natural' } as const;

type VolButtonProps = ButtonPrimitive.Props & {
  variant?: 'base' | 'outlined';
  color?: 'x' | 'o' | 'natural';
  arrow?: boolean;
};

function VolButton({
  variant = 'base',
  color = 'x',
  arrow,
  className,
  children,
  ...props
}: VolButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(
        'vol-btn',
        variantClass[variant],
        colorClass[color],
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <span className="vol-arrow">→</span>}
    </ButtonPrimitive>
  );
}

export { VolButton };
