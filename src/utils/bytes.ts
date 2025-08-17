export function bytesOf(v: Blob | File | ArrayBuffer | Uint8Array | string): number {
  if (typeof v === 'string') {
    return new TextEncoder().encode(v).byteLength;
  }
  if (v instanceof Blob) {
    return v.size;
  }
  if (v instanceof ArrayBuffer) {
    return v.byteLength;
  }
  if (v instanceof Uint8Array) {
    return v.byteLength;
  }
  throw new Error('Unsupported type for bytesOf');
}

