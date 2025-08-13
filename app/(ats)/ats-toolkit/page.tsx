import Hero from '@/components/Hero';
import ToolCard from '@/components/ToolCard';
import PrivacyFooter from '@/components/PrivacyFooter';
import { ToastProvider } from '@/components/toast/ToastProvider';
import AppErrorBoundary from '@/components/AppErrorBoundary';

const tools = [
  { title: 'Compress', href: '/ats-toolkit/compress', hint: 'Shrink PDF size' },
  { title: 'ATS Export', href: '/ats-toolkit/ats-export', hint: 'Extract clean text' },
  { title: 'OCR', href: '/ats-toolkit/ocr', hint: 'Image/PDF to text' },
  { title: 'JD Match', href: '/ats-toolkit/jd-match', hint: 'Resume vs Job' },
];

export const metadata = {
  title: 'ATS Toolkit',
  description: 'Tools for ATS friendly resumes',
};

export default function Page() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <Hero />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
          {tools.map((t) => (
            <ToolCard key={t.href} {...t} />
          ))}
        </div>
        <div className="mt-10 p-4 border rounded max-w-md mx-auto text-sm">
          <h4 className="font-semibold mb-2">Enable full features</h4>
          <p className="mb-1">Optional installs:</p>
          <pre className="bg-gray-100 p-2 rounded text-xs">
            npm install pdf-lib pdfjs-dist tesseract.js
          </pre>
        </div>
        <PrivacyFooter />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
