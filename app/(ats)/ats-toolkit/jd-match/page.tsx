import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import JDMatchClient from './Client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JD Match',
  description: 'Score resume vs JD',
};

export default function JDMatchPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <JDMatchClient />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
