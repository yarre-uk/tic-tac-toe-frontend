import type { VariantProps } from 'class-variance-authority';

import { Text } from './text';
import type { textVariants } from './text';

import { isDefined } from '@/lib/utils';

type ErrorProps = Readonly<{
  size?: VariantProps<typeof textVariants>['size'];
  className?: string;
  message?: string;
}>;

function FormError({ size = 'sm', className, message }: ErrorProps) {
  if (!isDefined(message)) return null;

  return (
    <Text as="span" size={size} color="o" className={className}>
      {message}
    </Text>
  );
}

export { FormError };
