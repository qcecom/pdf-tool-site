import { useCallback, useEffect, useRef, useState } from 'react';

const DAY = 24 * 60 * 60 * 1000;
const KEY = 'ats-quota';
const FREE_LIMIT = 5;
const FREE_BYTES = 5 * 1024 * 1024;

interface QuotaState {
  date: string;
  count: number;
  bytes: number;
}

function loadState(): QuotaState {
  if (typeof window === 'undefined') return { date: '', count: 0, bytes: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: '', count: 0, bytes: 0 };
    return JSON.parse(raw) as QuotaState;
  } catch {
    return { date: '', count: 0, bytes: 0 };
  }
}

export function useQuota() {
  const [state, setState] = useState<QuotaState>(() => {
    const s = loadState();
    if (!s.date || Date.now() - new Date(s.date).getTime() > DAY) {
      return { date: new Date().toISOString(), count: 0, bytes: 0 };
    }
    return s;
  });
  const isPro = useRef(false); // stub for future

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEY, JSON.stringify(state));
    }
  }, [state]);

  const allowed = useCallback(
    (fileSize = 0) => {
      if (isPro.current) return true;
      if (state.count >= FREE_LIMIT) return false;
      if (state.bytes + fileSize > FREE_BYTES) return false;
      return true;
    },
    [state]
  );

  const consume = useCallback(
    (fileSize = 0) => {
      setState((s) => ({
        date: s.date,
        count: s.count + 1,
        bytes: s.bytes + fileSize,
      }));
    },
    []
  );

  return { allowed, consume, state };
}
