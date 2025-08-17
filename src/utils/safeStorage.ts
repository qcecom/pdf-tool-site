import { isBrowser } from "@/utils/env";

export const storage = {
  get(k: string) {
    if (!isBrowser) return null;
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* empty */
    }
  },
  remove(k: string) {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* empty */
    }
  },
};
