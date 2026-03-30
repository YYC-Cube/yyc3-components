import React from 'react';
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, props.children);
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, props.children);
}
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return React.createElement('h3', props, props.children);
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, props.children);
}
