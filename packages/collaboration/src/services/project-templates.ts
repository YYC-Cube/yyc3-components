export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  files: Record<string, string>;
  color: string;
  entryPoint: string;
  language?: string;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch',
    icon: '📄',
    tags: ['blank'],
    files: {},
    color: '#64748b',
    entryPoint: 'index.js',
  },
  {
    id: 'react-app',
    name: 'React App',
    description: 'A React application template',
    icon: '⚛️',
    tags: ['react', 'frontend'],
    files: {
      'index.html':
        '<!DOCTYPE html><html><head><title>React App</title></head><body><div id="root"></div></body></html>',
      'src/index.tsx':
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\n\nfunction App() {\n  return <h1>Hello React</h1>;\n}\n\nReactDOM.createRoot(document.getElementById('root')!).render(<App />);",
    },
    color: '#0ea5e9',
    entryPoint: 'src/index.tsx',
    language: 'typescript',
  },
];
