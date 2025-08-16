export const storage = {
  get(k: string) {
    try { return window.localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string) {
    try { window.localStorage.setItem(k, v); } catch {}
  },
  remove(k: string) {
    try { window.localStorage.removeItem(k); } catch {}
  }
};
