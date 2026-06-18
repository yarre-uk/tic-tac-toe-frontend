import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '@/lib/utils';

type KeycapButtonProps = ButtonPrimitive.Props & {
  variant?: 'base' | 'outlined';
  color?: 'x' | 'o';
};

function KeycapButton({
  variant = 'base',
  color = 'x',
  className,
  children,
  ...props
}: KeycapButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(
        'vol-btn',
        variant === 'base' ? 'vol-base' : 'vol-outlined',
        color === 'o' && 'vol-o',
        className,
      )}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { KeycapButton };
