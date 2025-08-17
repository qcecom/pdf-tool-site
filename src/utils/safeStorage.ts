export const storage = {
  get(k: string) {
    try { return window.localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string) {
    try { window.localStorage.setItem(k, v); } catch { /* empty */ }
  },
  remove(k: string) {
    try { window.localStorage.removeItem(k); } catch { /* empty */ }
  }
};
