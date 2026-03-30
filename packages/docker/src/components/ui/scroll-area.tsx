import React from 'react';

export const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
ScrollArea.displayName = 'ScrollArea';
