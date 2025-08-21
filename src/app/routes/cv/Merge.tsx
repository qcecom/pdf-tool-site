import { Suspense, lazy } from 'react';
const MergeView = lazy(() => import('@/features/merge/View'));
export default function MergeRoute() {
  return <Suspense fallback={null}><MergeView /></Suspense>;
}
