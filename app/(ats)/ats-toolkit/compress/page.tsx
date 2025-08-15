import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import CompressClient from './Client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress',
  description: 'Shrink PDF size',
};

export default function CompressPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <CompressClient />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
