import React from 'react';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs(props: TabsProps) {
  return React.createElement('div', props, props.children);
}

export function TabsList(props: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, props.children);
}

export function TabsTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
) {
  return React.createElement('button', props, props.children);
}

export function TabsContent(
  props: React.HTMLAttributes<HTMLDivElement> & { value: string }
) {
  return React.createElement('div', props, props.children);
}
