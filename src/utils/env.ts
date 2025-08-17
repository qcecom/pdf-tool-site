export const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export const isWorker = typeof self !== "undefined" && typeof Window === "undefined";
