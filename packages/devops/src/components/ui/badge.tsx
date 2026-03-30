import React from 'react';
export function Badge(
  props: React.HTMLAttributes<HTMLDivElement> & { variant?: string }
) {
  return React.createElement('div', props, props.children);
}
