import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>;

export const Card = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => <div ref={ref} {...props} />
);
Card.displayName = 'Card';
