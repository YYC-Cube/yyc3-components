/**
 * Virtual File System Hook (Placeholder)
 *
 * This is a minimal placeholder implementation
 */

import { useState, useCallback } from 'react';

export interface VirtualFile {
  path: string;
  content: string;
  isDirty: boolean;
  language?: string;
}

export interface UseVirtualFileSystemReturn {
  files: Map<string, VirtualFile>;
  readFile: (path: string) => string | null;
  writeFile: (path: string, content: string, language?: string) => void;
  deleteFile: (path: string) => void;
  listFiles: () => string[];
  getDirtyFiles: () => VirtualFile[];
  markSaved: (path: string) => void;
}

export function useVirtualFileSystem(): UseVirtualFileSystemReturn {
  const [files, setFiles] = useState<Map<string, VirtualFile>>(new Map());

  const readFile = useCallback(
    (path: string): string | null => {
      return files.get(path)?.content ?? null;
    },
    [files]
  );

  const writeFile = useCallback((path: string, content: string, language?: string) => {
    setFiles((prev) => {
      const next = new Map(prev);
      next.set(path, { path, content, isDirty: true, language });
      return next;
    });
  }, []);

  const deleteFile = useCallback((path: string) => {
    setFiles((prev) => {
      const next = new Map(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const listFiles = useCallback(() => {
    return Array.from(files.keys());
  }, [files]);

  const getDirtyFiles = useCallback(() => {
    return Array.from(files.values()).filter((f) => f.isDirty);
  }, [files]);

  const markSaved = useCallback((path: string) => {
    setFiles((prev) => {
      const next = new Map(prev);
      const file = next.get(path);
      if (file) {
        next.set(path, { ...file, isDirty: false });
      }
      return next;
    });
  }, []);

  return {
    files,
    readFile,
    writeFile,
    deleteFile,
    listFiles,
    getDirtyFiles,
    markSaved,
  };
}
