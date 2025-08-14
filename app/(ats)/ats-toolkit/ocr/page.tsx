import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import OCRClient from './Client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR',
  description: 'Image to text',
};

export default function OCRPage() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <OCRClient />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
