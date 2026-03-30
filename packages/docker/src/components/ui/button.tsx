import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Record<string, unknown>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  (props, ref) => <button ref={ref} {...props} />
);
Button.displayName = 'Button';
