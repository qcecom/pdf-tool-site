import { Suspense, lazy } from 'react';
const OcrView = lazy(() => import('@/features/ocr/View'));
export default function OcrRoute() {
  return <Suspense fallback={null}><OcrView /></Suspense>;
}
