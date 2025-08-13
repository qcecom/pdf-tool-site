import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import ATSExportClient from './Client';

export const metadata = {
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
