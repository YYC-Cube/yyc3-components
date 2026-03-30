import React from 'react';
export function ScrollArea(props: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, props.children);
}
