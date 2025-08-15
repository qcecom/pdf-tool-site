import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import ATSExportClient from './Client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATS Export',
  description: 'Extract text',
};

export default function ATSExportPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <ATSExportClient />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
