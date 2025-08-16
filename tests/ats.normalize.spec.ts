import { test, expect } from '@playwright/test';
import { normalizeText } from '../src/pdf/ats/normalize';

test('normalizeText removes headers and de-hyphenates', () => {
  const input = "HEADER\nWork Expe-\nrience\nPage 1 of 3\n• Built tools";
  const out = normalizeText(input);
  expect(out).toContain('Work Experience');
  expect(out).toContain('- Built tools');
  expect(out).not.toMatch(/Page 1 of 3/);
});
