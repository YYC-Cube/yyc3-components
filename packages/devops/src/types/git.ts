export interface GitCommitOptions {
  message: string;
  files?: string[];
}

export interface GitCheckoutOptions {
  branch: string;
  create?: boolean;
}
