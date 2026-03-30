import React from 'react';

type Props = React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>;

export const Badge = React.forwardRef<HTMLSpanElement, Props>((props, ref) => (
  <span ref={ref} {...props} />
));
Badge.displayName = 'Badge';
