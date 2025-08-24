export async function fileToUint8(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export function prettyBytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(2)} ${units[i]}`;
}
