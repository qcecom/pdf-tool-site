export function bytesOf(v: any): number {
  if (!v) return 0;
  if (typeof (v as any).size === 'number') return (v as any).size;
  if (typeof (v as any).byteLength === 'number') return (v as any).byteLength;
  if (typeof (v as any).length === 'number') return (v as any).length;
  if (typeof v === 'string') return new TextEncoder().encode(v).length;
  return 0;
}
