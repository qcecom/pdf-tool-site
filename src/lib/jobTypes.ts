import type { ErrorCode } from '@/types/job';

export type JobState = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface ErrorInfo {
  code: ErrorCode;
  message: string;
}

export interface FileJob {
  file: File | null;
  filename: string;
  size: number;
  jobId?: string;
  state: JobState;
  progress: number;
  eta?: number;
  downloadUrl?: string;
  error?: ErrorInfo;
  controller?: AbortController;
}
