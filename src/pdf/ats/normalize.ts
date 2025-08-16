export function normalizeText(raw: string): string {
  // unify bullets
  let s = raw.replace(/[•·–—*]/g, '-');
  // de-hyphenation across lines
  s = s.replace(/(\w+)-\n(\w+)/g, '$1$2');
  // kill common page number headers/footers
  s = s.replace(/^\s*Page \d+( of \d+)?\s*$/gmi, '');
  // collapse spaces
  s = s.replace(/[ \t]+/g, ' ');
  // collapse multiple blank lines
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}
