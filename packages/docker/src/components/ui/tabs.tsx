import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>;

export const Tabs = (props: Props) => <div {...props} />;

export const TabsList = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => <div ref={ref} {...props} />
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & Record<string, unknown>>(
  (props, ref) => <button ref={ref} {...props} />
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => <div ref={ref} {...props} />
);
TabsContent.displayName = 'TabsContent';
