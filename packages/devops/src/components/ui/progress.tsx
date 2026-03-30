import React from 'react';
export function Progress(
  props: React.HTMLAttributes<HTMLDivElement> & { value?: number }
) {
  return React.createElement('div', props);
}
