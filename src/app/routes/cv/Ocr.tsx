import React, { Suspense } from 'react';
const OcrView = React.lazy(() => import('@/features/ocr/View'));
export default function OcrRoute() {
  return <Suspense fallback={null}><OcrView /></Suspense>;
}
