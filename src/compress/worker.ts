import { compressPdf, CompressOptions } from './index';

type In = { file: ArrayBuffer; options: CompressOptions; startPage?: number; endPage?: number };
type Out = { type: 'result'; data: ArrayBuffer; meta: any } | { type: 'error'; message: string };

self.onmessage = async (e: MessageEvent<In>) => {
  const post = (m: Out, t?: Transferable[]) => (self as any).postMessage(m, t);
  try {
    const { file, options } = e.data; // startPage/endPage handled within compressPdf if needed
    const res = await compressPdf(new Blob([file], { type: 'application/pdf' }), options);
    const buf = await res.blob.arrayBuffer();
    post({ type: 'result', data: buf, meta: res }, [buf]);
  } catch (err: any) {
    post({ type: 'error', message: err?.message || 'compress failed' });
  }
};
