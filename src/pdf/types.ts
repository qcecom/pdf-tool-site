export interface CompressPayload {
  file: ArrayBuffer;
  quality?: number;
}

export interface MergePayload {
  files: ArrayBuffer[];
}

export interface SplitPayload {
  file: ArrayBuffer;
  ranges: number[][];
}
