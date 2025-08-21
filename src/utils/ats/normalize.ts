import type { ATSKeywordAnalysis, ATSNormalizationReport } from "@/pdf/types";

export function normalizeTextForATS(rawText: string): {
  text: string;
  report: ATSNormalizationReport;
} {
  const originalLength = rawText.length;
  const removedElements: string[] = [];
  let text = rawText.replace(/[^\x00-\x7F]/g, (ch) => {
    removedElements.push(ch);
    return "";
  });
  text = text.replace(/\s+/g, " ").trim();
  const warnings: string[] = [];
  if (removedElements.length > 0) warnings.push("Removed non-ASCII characters");
  return {
    text,
    report: {
      originalLength,
      normalizedLength: text.length,
      removedElements,
      warnings,
    },
  };
}

export function analyzeATSKeywords(text: string, jobDescription: string): ATSKeywordAnalysis {
  const tokenize = (str: string) => str.toLowerCase().match(/\b[a-z0-9]{2,}\b/g) || [];
  const jdWords = Array.from(new Set(tokenize(jobDescription)));
  const textWords = new Set(tokenize(text));
  const commonKeywords = jdWords.filter((w) => textWords.has(w));
  const missingKeywords = jdWords.filter((w) => !textWords.has(w));
  const score = jdWords.length ? Math.round((commonKeywords.length / jdWords.length) * 100) : 0;
  return { score, commonKeywords, missingKeywords };
}

