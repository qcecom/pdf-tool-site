export type MatchReport = {
  score0to100: number;
  mustHaveMissing: string[];
  niceToHaveMissing: string[];
  bulletSuggestions: string[];
};

const STOPWORDS = new Set('the a an and or of to in with on for by'.split(' '));
const SYNONYMS: Record<string, string[]> = {
  excel: ['ms excel'],
  "bachelor's": ['ba', 'bs', 'bsc'],
  crm: ['salesforce', 'hubspot'],
  python: ['py'],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

function expand(tokens: string[]): Set<string> {
  const set = new Set(tokens);
  for (const t of tokens) {
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (t === key || syns.includes(t)) {
        set.add(key);
        syns.forEach((s) => set.add(s));
      }
    }
  }
  return set;
}

export function scoreResumeVsJD(resumeText: string, jdText: string): MatchReport {
  const resumeTokens = expand(tokenize(resumeText));
  const jdTokens = expand(tokenize(jdText));
  const mustHaveMissing: string[] = [];
  const niceToHaveMissing: string[] = [];

  jdTokens.forEach((t) => {
    if (!resumeTokens.has(t)) {
      if (['must', 'required'].includes(t)) return;
      if (['nice', 'plus', 'preferred'].includes(t)) return;
      if (resumeTokens.size === 0) return;
      // naive: treat first half as must, rest as nice
    }
  });

  const intersection = new Set([...jdTokens].filter((t) => resumeTokens.has(t)));
  const keywordScore = jdTokens.size ? (intersection.size / jdTokens.size) * 40 : 0;
  const synonymScore = intersection.size * 2; // crude
  const experienceScore = resumeText.includes('experience') ? 20 : 0;
  const educationScore = /bachelor|degree|cert/i.test(resumeText) ? 10 : 0;
  const formatScore = /\n- /.test(resumeText) ? 10 : 0;

  const total = Math.min(
    100,
    Math.round(keywordScore + synonymScore + experienceScore + educationScore + formatScore)
  );

  const missing = [...jdTokens].filter((t) => !resumeTokens.has(t));
  missing.slice(0, 5).forEach((m, i) => {
    if (i < 3) mustHaveMissing.push(m);
    else niceToHaveMissing.push(m);
  });

  const bulletSuggestions = missing.slice(0, 3).map(
    (m) => `Improved ${m} by 10% using data-driven methods`
  );

  return { score0to100: total, mustHaveMissing, niceToHaveMissing, bulletSuggestions };
}
