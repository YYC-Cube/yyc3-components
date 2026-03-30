import React from 'react';
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) { return React.createElement('button', props, props.children); }
