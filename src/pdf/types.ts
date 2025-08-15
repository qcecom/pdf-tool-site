export interface CompressCvPayload {
  file: ArrayBuffer;
  target?: '2mb' | '1mb';
  quality?: number;
}

export interface MergeCvPayload {
  files: ArrayBuffer[];
}

export interface ExportTextPayload {
  file: ArrayBuffer;
}

export interface OcrPayload {
  file: ArrayBuffer;
  lang: 'eng' | 'vie';
}
