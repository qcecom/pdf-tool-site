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
  jobDescription?: string;
}

export interface ATSNormalizationReport {
  originalLength: number;
  normalizedLength: number;
  removedElements: string[];
  warnings: string[];
}

export interface ATSKeywordAnalysis {
  score: number;
  commonKeywords: string[];
  missingKeywords: string[];
}

export interface ExportTextResult {
  text: string;
  report: ATSNormalizationReport;
  keywordAnalysis: ATSKeywordAnalysis | null;
}

export interface OcrPayload {
  file: ArrayBuffer;
  lang: 'eng' | 'vie';
}
