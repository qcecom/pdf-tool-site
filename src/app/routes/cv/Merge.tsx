import React, { Suspense } from 'react';
const MergeView = React.lazy(() => import('@/features/merge/View'));
export default function MergeRoute() {
  return <Suspense fallback={null}><MergeView /></Suspense>;
}
