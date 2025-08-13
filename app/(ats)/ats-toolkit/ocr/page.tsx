import AppErrorBoundary from '@/components/AppErrorBoundary';
import { ToastProvider } from '@/components/toast/ToastProvider';
import OCRClient from './Client';

export const metadata = {
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
