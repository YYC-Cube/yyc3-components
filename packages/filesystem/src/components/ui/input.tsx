import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;

export const Input = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => <input ref={ref} {...props} />
);
Input.displayName = 'Input';
