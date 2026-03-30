export interface GitCommitOptions {
  message: string;
  files?: string[];
}

export interface GitCheckoutOptions {
  branch: string;
  create?: boolean;
}

export interface GitFileChange {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'copied' | 'untracked';
  linesAdded?: number;
  linesDeleted?: number;
  oldPath?: string;
}
