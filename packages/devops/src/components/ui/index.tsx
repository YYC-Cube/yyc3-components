import React from 'react';

export function Badge({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) {
  return React.createElement('div', props, children);
}

export function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  size?: string;
}) {
  return React.createElement('button', props, children);
}

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}

export function CardHeader({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}

export function CardTitle({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return React.createElement('h3', props, children);
}

export function CardContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}

export function Tabs({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}

export function TabsList({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}

export function TabsTrigger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  return React.createElement('button', props, children);
}

export function TabsContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  return React.createElement('div', props, children);
}

export function Progress({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value?: number }) {
  return React.createElement('div', props);
}

export function ScrollArea({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement('div', props, children);
}
