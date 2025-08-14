export type JobState = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface ProgressInfo {
  phase: 'upload' | 'processing';
  percent: number;
  bytesDone: number;
  bytesTotal: number;
  etaSeconds: number;
}

export interface DoneInfo {
  downloadUrl: string;
}

export interface ErrorInfo {
  code: string;
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
