export function formatBytes(bytes: number, frac: number = 1) {
  if (!Number.isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(frac)} ${units[i]}`;
}

export function deriveOutputName(inputName: string, suffix: string, ext: string = ".pdf") {
  const dot = inputName.lastIndexOf(".");
  const base = dot > -1 ? inputName.slice(0, dot) : inputName;
  return `${base}${suffix}${ext}`;
}
