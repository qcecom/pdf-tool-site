export type JobPhase = 'idle' | 'upload' | 'process' | 'done' | 'error';

export type ErrorCode =
  | 'E_UNSUPPORTED_TYPE'
  | 'E_TOO_LARGE'
  | 'E_UPLOAD_FAIL'
  | 'E_PROCESS_FAIL'
  | 'E_STATUS_LOST';

export interface JobProgress {
  jobId: string;
  phase: JobPhase;
  percent: number;
  bytesDone?: number;
  bytesTotal?: number;
  etaSeconds?: number;
  downloadUrl?: string;
  error?: { code: ErrorCode; message: string };
}

