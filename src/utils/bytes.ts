export function bytesOf(v: any): number {
  if (!v) return 0;
  if (typeof v.size === 'number') return v.size;             // Blob/File
  if (typeof v.byteLength === 'number') return v.byteLength; // ArrayBuffer/TypedArray
  if (typeof v.length === 'number') return v.length;         // Uint8Array/Buffer
  if (typeof v === 'string') return new TextEncoder().encode(v).length;
  return 0;
}
